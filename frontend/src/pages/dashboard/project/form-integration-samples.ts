export type IntegrationSampleContext = {
  endpoint: string;
  formId: string;
};

export function getHtmlSample({ endpoint }: IntegrationSampleContext) {
  return `<form action="${endpoint}" method="POST">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="you@example.com" required />
  <textarea name="message" placeholder="Message" required></textarea>

  <!-- Optional: thank-you page. Omit to stay on this page. -->
  <!-- <input type="hidden" name="_next" value="https://yoursite.com/thanks" /> -->

  <!-- Honeypot: leave empty — helps block bots -->
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />

  <button type="submit">Send</button>
</form>

<!-- For file uploads, add enctype and a files input:
<form action="${endpoint}" method="POST" enctype="multipart/form-data">
  ...
  <input type="file" name="files" multiple />
</form>
-->`;
}

export function getFetchSample({ endpoint }: IntegrationSampleContext) {
  return `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hello from Quest Base",
  }),
});

const result = await response.json();
console.log(result);

// Optional: redirect yourself after a successful XHR submit
// if (result.success) window.location.href = "/thanks";`;
}

export function getAxiosSample({ endpoint }: IntegrationSampleContext) {
  return `import axios from "axios";

const { data } = await axios.post("${endpoint}", {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello from Quest Base",
}, {
  headers: { Accept: "application/json" },
});

console.log(data);`;
}

export function getReactSample({ formId }: IntegrationSampleContext) {
  return `import { useState } from "react";
import { useQuestForm } from "@questbase/sdk/react";

const FORM_ID = "${formId}";

export function ContactForm() {
  const { submit, submitting, error } = useQuestForm({ formId: FORM_ID });
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit({ message });
    setMessage("");
  }

  return (
    <form onSubmit={onSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send"}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}`;
}

export function getUnifiedSdkSample({ formId }: IntegrationSampleContext) {
  return `import { questbase } from "@questbase/sdk";

// Forms and OTP work from the browser with a public ID (no API key).
// Pass apiKey for server-to-server calls.
const qb = questbase({
  // apiKey: "qb_...",
  // baseUrl: "http://localhost:9000", // optional override
});

await qb.forms.submit("${formId}", {
  email: "ada@example.com",
  message: "Shipped with one client",
});

// Same client surface for OTP:
// await qb.otp.send("your-otp-id", { channel: "email", to: "ada@example.com" });
// await qb.waitlist.add({ email }) // coming soon`;
}

export function getInstallSample() {
  return `npm install @questbase/sdk
# or
bun add @questbase/sdk`;
}

export function getAgentPrompt({ endpoint, formId }: IntegrationSampleContext) {
  return `You are integrating Quest Base form2mail into my app.

## What to build
Wire a contact (or equivalent) form so submissions POST to Quest Base. Quest Base emails the form owners — do not invent a custom form backend, SMTP service, or serverless mail handler for this.

## Credentials
- Form ID: ${formId}
- Form endpoint (POST only): ${endpoint}

## API rules
- Method must be POST.
- Accepted body types: application/json, application/x-www-form-urlencoded, or multipart/form-data (for file uploads).
- Field names are arbitrary (name, email, message, etc.). Max 50 fields; each value max 5000 characters.
- Reserved keys (do not treat as user data): _gotcha, website, _next, _redirect, files.
- Include a honeypot input named _gotcha (hidden, empty, tabindex="-1", autocomplete="off"). If bots fill it, the submit is discarded.
- Optional thank-you redirect for HTML form posts: hidden input _next (or _redirect) with an http(s) URL. XHR/fetch clients must redirect themselves after a successful response — the API does not force navigation for them.
- For file uploads use multipart/form-data and an input named files.

## Preferred integration paths (pick what matches this codebase)
1. Plain HTML: <form action="${endpoint}" method="POST"> with named inputs + _gotcha.
2. Browser fetch/Axios: POST JSON to ${endpoint} with Accept: application/json.
3. React: npm install @questbase/sdk, then useQuestForm({ formId: "${formId}" }) from @questbase/sdk/react.
4. Unified SDK: questbase().forms.submit("${formId}", { ...fields }).

## Your task
1. Inspect the repo and find where the form UI belongs (existing contact page, modal, or create one that fits the design system).
2. Implement the integration using the path that best matches the stack.
3. Keep styling consistent with the app. Show loading and error states for async submits.
4. Do not hardcode secrets or add a parallel backend for this form.
5. Briefly summarize what you changed and how to test a submission.`;
}
