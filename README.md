# SafeBridge-MVP

# SafeBridge: Engineering a Zero-Stigma Communication Bridge for Trauma Survivors

*AI for Social Good · NLP · Accessibility*

## 📖 Overview

Most "AI for mental health" applications mistakenly attempt to act as therapists. SafeBridge solves a narrower, more actionable problem: it serves as a strict translator for trauma survivors.

Survivors of trauma—such as combat veterans or domestic violence victims—often face a "translation gap" between their raw internal experiences and the specific language required to communicate in clinical, professional, or relational settings. SafeBridge bridges this gap. Raw, fragmented input goes in, and two clean, audience-appropriate, copy-paste-ready messages come out.

## ✨ Core Features

* **Audience-Specific Translation:** Dynamically adjusts output for three distinct contexts: clinical symptom reporting, relational boundary setting (family), and HR-safe accommodation requests (work).
* **Stateless Edge Deployment:** Runs entirely on Cloudflare Workers with zero persistent storage, no databases, and no user input logging. Statelessness is a core privacy feature.
* **Bilingual Support:** Natively supports English and Bahasa Indonesia from launch.

## 🛡️ Safety & Privacy Architecture

Every input passes through a strict dual-gate safety system that cannot be bypassed.

### Gate 1: Client-Side Crisis Interception

* Runs locally via regex before any network call is made.
* If a crisis pattern is detected, the UI instantly locks into a non-dismissible `CrisisModal` displaying relevant emergency numbers (911, Veterans Crisis Line, National Domestic Violence Hotline).
* Silently strips PII (phone numbers, emails, SSN patterns) before text is sent to the API.

### Gate 2: Server-Side Output Validation

* Validates all LLM output post-inference.
* Blocks off-role behavior (e.g., the AI acting as a therapist) and filters unsafe patterns or hallucinated PII.
* Failed validations return a neutral error prompting rephrasing, ensuring the user never sees raw, unvalidated model output.

### 🚨 The Quick Exit System

Designed for users in compromised or monitored environments, the Quick Exit feature instantly destroys the session:

1. **Synchronous DOM Clear:** Destroys the UI instantly.
2. **History Erasure:** Overwrites browser history so the "Back" button cannot return to the app.
3. **Benign Redirect:** Forcibly navigates to `weather.gov`.
*Triggers:* Escape key, two-finger swipe right (mobile), or the persistent bottom-right UI button.

## 🏗️ Architecture & Tech Stack

* **Frontend:** SvelteKit 5 (Runes mode) & TypeScript
* **Deployment:** Cloudflare Workers (`@sveltejs/adapter-cloudflare`)
* **AI Inference:** Gemma 4 31B (`gemma4:31b-cloud`) via Ollama Cloud REST API

### Why Gemma 4 31B?

Smaller models (7B/13B class) consistently failed to uphold the application's strict negative constraints, often hallucinating supportive platitudes or slipping into a therapeutic role. The 31B parameter count provides the necessary capacity to follow complex multi-constraint role definitions without drift.

**Inference Parameters:**

* `temperature: 0.15`: Enforces absolute consistency, prioritizing precise translation over stylistic variance.
* `num_predict: 200`: Hard-caps token generation to prevent conversational padding.
* `top_p: 0.85` / `top_k: 20`: Aggressively restricts vocabulary to ensure appropriate professional and clinical language.
* `stream: false`: Ensures the entire output can be evaluated by the server-side validation layer before reaching the user.

## 🛣️ Limitations & Roadmap

* **Crisis Detection Coverage:** Current regex interception lacks coverage for metaphorical or culturally specific distress expressions. Future versions aim to implement a lightweight local classifier (ONNX-format via Transformers.js) running directly in the browser.
* **Clinical Validation:** The standard medical terminology utilized by the medical prompt requires formal review and validation by VA clinicians and trauma psychiatrists prior to real-world deployment.
* **Latency Optimization:** Exploring fine-tuning on Gemma 4 9B to recover task-specific quality at a lower parameter count, reducing API latency.
