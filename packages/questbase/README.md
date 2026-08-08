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
// await qb.otp.send(email)       // coming soon
// await qb.waitlist.add({ email }) // coming soon
```
