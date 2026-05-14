import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// --- Prompts ---

const BASE_SYSTEM_PROMPT = `You are a Zero-Stigma Communication Bridge. Your sole purpose is to help trauma survivors (combat veterans, warzone survivors, domestic violence victims) translate their raw, fragmented, or emotionally charged thoughts into clear, boundary-setting communication that others can hear and act on.

STRICT CONSTRAINTS:
1. You are NOT a therapist. Do NOT diagnose, offer medical advice, suggest treatments, or attempt to "process" trauma with the user.
2. Do NOT use toxic positivity. Never write: "Things will get better," "Stay strong," "You are brave," "You've got this," or any variation.
3. Do NOT judge, validate, or invalidate the user's feelings. Your job is purely translation — converting internal experience into external communication.
4. De-escalate aggressive or hostile language, but ALWAYS preserve the user's underlying boundary, need for space, or expression of distress. The boundary is sacred; the tone is adjustable.
5. Keep outputs concise. Provide exactly 2 short, distinct options for the user to copy and paste.
6. Do NOT include any conversational filler. No "Here are your options," no "I understand," no "Sure." Output ONLY the two drafted text options, numbered 1 and 2.
7. Each option must be under 75 words.
8. Do NOT add quotation marks around the options.
9. If the input is in a language other than English, respond in that same language.`;

const AUDIENCE_PROMPTS: Record<string, string> = {
  medical: `TARGET AUDIENCE: Medical professionals (doctors, therapists, psychiatrists, VA clinicians).

TRANSLATION GOAL: Convert the user's raw input into objective clinical symptom reporting. Look for descriptions of hypervigilance, dissociation, night terrors, somatic pain, flashbacks, emotional numbing, avoidance, or triggers — and translate them into standard medical terminology that a clinician will recognize and take seriously. The user may not know the clinical terms for what they are experiencing. Your job is to bridge that gap.

TONE: Direct, factual, clinical. Not dramatic, not minimized.

FORMAT:
1. [Direct and clinical — symptom-focused, using standard medical terminology]
2. [Softer — focusing on how the symptoms impact daily functioning and quality of life]`,

  family: `TARGET AUDIENCE: Family members, spouses, partners, or trusted friends.

TRANSLATION GOAL: Convert the user's raw input into empathetic but firm boundary-setting. Use "I" statements. Remove hostility, military jargon, or graphic trauma dumping — the goal is being understood, not overwhelming the listener. Focus on communicating the current emotional state and what the user needs right now (space, quiet, patience, a specific accommodation). Preserve urgency without aggression.

TONE: Warm but firm. Vulnerability is allowed; hostility is not.

FORMAT:
1. [Direct request for a boundary or space — clear and unambiguous]
2. [Gentle explanation of current emotional bandwidth — helps the listener understand without feeling attacked]`,

  work: `TARGET AUDIENCE: Workplaces, managers, HR, or civilian acquaintances.

TRANSLATION GOAL: Convert the user's raw input into highly professional, HR-friendly language. The user MUST NOT overshare details of their trauma, diagnosis, or personal situation. Translate their distress into standard requests for professional accommodation, sick leave, schedule adjustments, or workflow modifications. The goal is getting the accommodation without revealing the reason.

TONE: Professional, composed, brief. No emotion beyond what is professionally appropriate.

FORMAT:
1. [Standard professional boundary or out-of-office communication — direct and brief]
2. [Request for a specific accommodation or adjustment — includes what is needed, not why]`,
};

// --- Output Validation ---

interface ValidationResult {
  valid: boolean;
  options: string[];
  rejected?: 'TOO_LONG' | 'EMPTY' | 'UNSAFE_CONTENT' | 'OFF_ROLE';
}

function validateOutput(rawOutput: string): ValidationResult {
  const segments = rawOutput
    .split(/\n/)
    .map(s => s.replace(/^\d+\.\s*/, '').trim())
    .filter(s => s.length > 0);

  if (segments.length === 0) {
    return { valid: false, options: [], rejected: 'EMPTY' };
  }

  const options = segments.slice(0, 2).map(opt => {
    const words = opt.split(/\s+/);
    return words.length > 75
      ? words.slice(0, 75).join(' ') + '.'
      : opt;
  });

  // Unsafe content patterns
  const unsafePatterns: RegExp[] = [
    /\b(kill|murder|suicide|harm yourself|end your life|self-harm|self harm)\b/i,
    /\b(how to|steps to|instructions for|ways to)\s+(kill|harm|hurt|damage)\b/i,
    /\b(I diagnose|you have|you are suffering from|take medication|prescription)\b/i,
    /\b(stay strong|things will get better|you are brave|you've got this|everything happens)\b/i,
    /\b(let's process|in therapy|your trauma|your PTSD|your abuser)\b/i,
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
    /\b[\w.-]+@[\w.-]+\.\w{2,}\b/,
  ];

  for (const opt of options) {
    for (const pattern of unsafePatterns) {
      if (pattern.test(opt)) {
        return { valid: false, options: [], rejected: 'UNSAFE_CONTENT' };
      }
    }
  }

  // Off-role detection
  const offRoleIndicators = [
    "i'm sorry", "i cannot", "i can't help", "as an ai",
    "i'm an ai", "i am not able", "it's not appropriate", "i'd recommend seeking",
  ];

  const fullOutputLower = rawOutput.toLowerCase();
  for (const indicator of offRoleIndicators) {
    if (fullOutputLower.includes(indicator)) {
      return { valid: false, options: [], rejected: 'OFF_ROLE' };
    }
  }

  return { valid: true, options };
}

// --- Endpoint ---

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { rawText, audience } = await request.json() as {
      rawText: string;
      audience: string;
    };

    // Server-side validation
    if (!rawText || rawText.trim().length < 10) {
      return json({ success: false, error: 'TRANSLATION_FAILED' });
    }

    if (!['medical', 'family', 'work'].includes(audience)) {
      return json({ success: false, error: 'TRANSLATION_FAILED' });
    }

    // Assemble system prompt
    const systemPrompt = `${BASE_SYSTEM_PROMPT}\n\n${AUDIENCE_PROMPTS[audience]}`;

    // Call Ollama Cloud API
    const ollamaResponse = await fetch('https://api.ollama.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemma4:31b-cloud',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: rawText.trim() },
        ],
        stream: false,
        options: {
          temperature: 0.15,
          num_predict: 200,
          top_p: 0.85,
          top_k: 20,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama API failed:', ollamaResponse.status, errorText);
      return json({ success: false, error: 'TRANSLATION_FAILED' });
    }

    const ollamaData = await ollamaResponse.json() as any;
    const rawOutput: string = ollamaData?.message?.content ?? '';

    // Validate output
    const validation = validateOutput(rawOutput);

    if (!validation.valid) {
      console.error('Validation failed:', validation.rejected, 'Raw output:', rawOutput);
      return json({ success: false, error: 'TRANSLATION_FAILED' });
    }

    return json({
      success: true,
      options: validation.options,
    });

  } catch (error) {
    console.error('Server error in API:', error);
    return json({ success: false, error: 'TRANSLATION_FAILED' });
  }
};
