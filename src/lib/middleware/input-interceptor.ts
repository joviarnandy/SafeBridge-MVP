// Crisis term detection — hardcoded, no external dependencies
const CRISIS_PATTERNS: RegExp[] = [
  /\b(kill(ing|s)?|murder|suicide|suicidal|end my life|want to die|hurt myself|harming myself)\b/i,
  /\b(choking|strangling|beating|stabbing|shooting)\s*(me|her|him|them|right now)\b/i,
  /\b(he|she|they)\s*(is|are)\s*(going to|gonna)\s*(kill|murder|hurt|attack)\b/i,
  /\b(active shooter|home invasion|break(ing)? in)\b/i,
  /\b(911|emergency|help me now|call the police)\b/i,
];

export function interceptInput(rawText: string): 
  | { safe: true; sanitized: string }
  | { safe: false; crisisType: 'IMMINENT_DANGER' } 
{
  const trimmed = rawText.trim();
  
  // Length gates
  if (trimmed.length < 10) {
    return { safe: true, sanitized: trimmed }; // Let the UI handle the "too short" disable
  }

  // Crisis detection
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { safe: false, crisisType: 'IMMINENT_DANGER' };
    }
  }

  // Sanitize: strip any accidental PII patterns (phone numbers, emails)
  const sanitized = trimmed
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone removed]')  // US phone
    .replace(/\b[\w.-]+@[\w.-]+\.\w{2,}\b/g, '[email removed]')     // Email
    .replace(/\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, '[number removed]'); // SSN-like

  return { safe: true, sanitized };
}
