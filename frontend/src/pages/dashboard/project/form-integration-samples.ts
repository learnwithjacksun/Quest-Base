export type IntegrationSampleContext = {
  endpoint: string;
  formId: string;
};

export const integrationStacks = [
  {
    id: "html",
    label: "Plain HTML",
    description:
      "Point your form action at the endpoint. Give every input a name. Include a hidden _gotcha honeypot to help block bots. For a thank-you page, add _next or set a default redirect in Settings — otherwise we send the visitor back to the same page they submitted from.",
  },
  {
    id: "fetch",
    label: "JavaScript (fetch)",
    description:
      "Submit JSON from the browser or a Node script with the Fetch API. After success, redirect yourself if you want a thank-you page — we never force a navigation for XHR clients.",
  },
  {
    id: "axios",
    label: "Axios",
    description:
      "Same endpoint with Axios — useful if your app already uses it.",
  },
  {
    id: "react",
    label: "React (@questbase/sdk)",
    description:
      "Install the SDK, then use useQuestForm for a Formspark-style hook with a clearer object return value.",
  },
  {
    id: "sdk",
    label: "Unified SDK",
    description:
      "One client for forms today — OTP and waitlist will share the same surface later, so your docs stay simple.",
  },
] as const;

export type IntegrationStackId = (typeof integrationStacks)[number]["id"];

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

const sharedAgentRules = `## API rules
- Method must be POST.
- Accepted body types: application/json, application/x-www-form-urlencoded, or multipart/form-data (for file uploads).
- Field names are arbitrary (name, email, message, etc.). Max 50 fields; each value max 5000 characters.
- Reserved keys (do not treat as user data): _gotcha, website, _next, _redirect, files.
- Include a honeypot input named _gotcha (hidden, empty, tabindex="-1", autocomplete="off"). If bots fill it, the submit is discarded.
- For file uploads use multipart/form-data and an input named files.
- Do not invent a custom form backend, SMTP service, or serverless mail handler — Quest Base emails the form owners.
- Keep styling consistent with the app. Briefly summarize what you changed and how to test a submission.`;

function agentIntro(formId: string, endpoint: string) {
  return `You are integrating Quest Base form2mail into my app.

## Credentials
- Form ID: ${formId}
- Form endpoint (POST only): ${endpoint}`;
}

export function getAgentPrompt(
  ctx: IntegrationSampleContext,
  stack: IntegrationStackId,
) {
  const { endpoint, formId } = ctx;
  const intro = agentIntro(formId, endpoint);

  switch (stack) {
    case "html":
      return `${intro}

## What to build
Wire a contact (or equivalent) form using plain HTML that POSTs to Quest Base.

## Integration path
Use a native HTML form:
\`\`\`html
<form action="${endpoint}" method="POST">
  ...named inputs...
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
  <!-- optional: <input type="hidden" name="_next" value="https://yoursite.com/thanks" /> -->
  <button type="submit">Send</button>
</form>
\`\`\`
- Optional thank-you redirect: hidden \`_next\` (or \`_redirect\`) with an http(s) URL.
- If \`_next\` is omitted, Quest Base sends the visitor back to the page they submitted from (or the Settings redirect).

${sharedAgentRules}

## Your task
1. Find or create the form UI in this repo.
2. Implement the HTML form integration above.
3. Do not hardcode secrets or add a parallel backend for this form.`;

    case "fetch":
      return `${intro}

## What to build
Wire a contact (or equivalent) form that submits with the Fetch API to Quest Base.

## Integration path
POST JSON to the endpoint:
\`\`\`js
const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({ name, email, message }),
});
const result = await response.json();
\`\`\`
- After success, redirect yourself if you want a thank-you page — the API does not force navigation for XHR clients.
- Still include a \`_gotcha\` field (empty string) when posting from a real form UI.

${sharedAgentRules}

## Your task
1. Find or create the form UI in this repo.
2. Implement fetch-based submit with loading and error states.
3. Do not hardcode secrets or add a parallel backend for this form.`;

    case "axios":
      return `${intro}

## What to build
Wire a contact (or equivalent) form that submits with Axios to Quest Base.

## Integration path
\`\`\`js
import axios from "axios";

const { data } = await axios.post("${endpoint}", {
  name, email, message,
}, {
  headers: { Accept: "application/json" },
});
\`\`\`
- After success, redirect yourself if you want a thank-you page — the API does not force navigation for XHR clients.
- Still include a \`_gotcha\` field (empty string) when posting from a real form UI.

${sharedAgentRules}

## Your task
1. Find or create the form UI in this repo.
2. Implement Axios-based submit with loading and error states.
3. Do not hardcode secrets or add a parallel backend for this form.`;

    case "react":
      return `${intro}

## What to build
Wire a React contact (or equivalent) form using the Quest Base SDK hook.

## Integration path
1. Install: \`npm install @questbase/sdk\` (or \`bun add @questbase/sdk\`).
2. Use \`useQuestForm\` from \`@questbase/sdk/react\`:
\`\`\`tsx
import { useQuestForm } from "@questbase/sdk/react";

const { submit, submitting, error } = useQuestForm({ formId: "${formId}" });
await submit({ name, email, message });
\`\`\`
- Show loading and error states from the hook.
- After success, redirect yourself if you want a thank-you page.

${sharedAgentRules}

## Your task
1. Find or create the React form UI in this repo.
2. Implement the \`useQuestForm\` integration above.
3. Do not hardcode secrets or add a parallel backend for this form.`;

    case "sdk":
      return `${intro}

## What to build
Wire form submissions using the unified Quest Base SDK client.

## Integration path
1. Install: \`npm install @questbase/sdk\` (or \`bun add @questbase/sdk\`).
2. Submit with the client:
\`\`\`ts
import { questbase } from "@questbase/sdk";

const qb = questbase({
  // apiKey: "qb_...", // only for server-to-server
  // baseUrl: "http://localhost:9000", // optional override
});

await qb.forms.submit("${formId}", {
  email: "ada@example.com",
  message: "Hello from Quest Base",
});
\`\`\`
- Browser calls can use the public form ID with no API key.
- After success, redirect yourself if you want a thank-you page.

${sharedAgentRules}

## Your task
1. Find or create the form/submit flow in this repo.
2. Implement \`questbase().forms.submit\` as above.
3. Do not hardcode secrets or add a parallel backend for this form.`;
  }
}
