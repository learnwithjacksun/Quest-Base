# @questbase/sdk

Official Quest Base JavaScript / React SDK.

## Install

```bash
npm install @questbase/sdk
```

## Forms (public form ID)

```ts
import { questbase } from "@questbase/sdk";

const qb = questbase({ baseUrl: "http://localhost:9000" });
await qb.forms.submit("your-form-id", { email: "ada@example.com", message: "Hi" });
```

## OTP (email + SMS)

Hybrid: call from the browser with a public OTP ID (configure allowed origins),
or from your server with a project API key.

```ts
import { questbase } from "@questbase/sdk";

// Browser — no API key needed when the origin is allowed
const qb = questbase({ baseUrl: "http://localhost:9000" });

await qb.otp.send("your-otp-id", {
  channel: "email", // or "sms"
  to: "ada@example.com",
});

await qb.otp.verify("your-otp-id", {
  to: "ada@example.com",
  code: "482910",
});

// Server-to-server — pass your project API key
const server = questbase({
  apiKey: "qb_...",
  baseUrl: "http://localhost:9000",
});
await server.otp.send("your-otp-id", {
  channel: "sms",
  to: "+15551234567",
});
```

## React

```tsx
import { useQuestForm } from "@questbase/sdk/react";

const { submit, submitting, error } = useQuestForm({ formId: "your-form-id" });
await submit({ message: "Hello" });
```

## Unified client

```ts
const qb = questbase({ apiKey: "qb_..." });
await qb.forms.submit(formId, data);
await qb.otp.send(otpId, { channel: "email", to: "ada@example.com" });
// await qb.waitlist.add({ email }) // coming soon
```
