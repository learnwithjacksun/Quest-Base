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
