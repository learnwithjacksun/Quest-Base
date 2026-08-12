export type OtpIntegrationSampleContext = {
  sendEndpoint: string;
  verifyEndpoint: string;
  otpId: string;
};

export function getOtpFetchSample({
  sendEndpoint,
  verifyEndpoint,
}: OtpIntegrationSampleContext) {
  return `// 1) Send a code
const sendRes = await fetch("${sendEndpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    channel: "email", // or "sms"
    to: "ada@example.com",
  }),
});
const sendResult = await sendRes.json();
console.log(sendResult);

// 2) Verify the code the user typed
const verifyRes = await fetch("${verifyEndpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    to: "ada@example.com",
    code: "482910",
  }),
});
const verifyResult = await verifyRes.json();
console.log(verifyResult);`;
}

export function getOtpSdkSample({ otpId }: OtpIntegrationSampleContext) {
  return `import { questbase } from "@questbase/sdk";

// Browser: no API key needed when your origin is allowed in Settings.
const qb = questbase({
  // baseUrl: "http://localhost:9000", // optional override
});

await qb.otp.send("${otpId}", {
  channel: "email", // or "sms"
  to: "ada@example.com",
});

await qb.otp.verify("${otpId}", {
  to: "ada@example.com",
  code: "482910",
});`;
}

export function getOtpServerSample({ otpId }: OtpIntegrationSampleContext) {
  return `import { questbase } from "@questbase/sdk";

// Server-to-server: pass your project API key (keep it secret).
const qb = questbase({
  apiKey: process.env.QUESTBASE_API_KEY!,
});

await qb.otp.send("${otpId}", {
  channel: "sms",
  to: "+15551234567",
});

const result = await qb.otp.verify("${otpId}", {
  to: "+15551234567",
  code: "482910",
});

if (result.verified) {
  // continue sign-in / checkout / etc.
}`;
}

export function getOtpInstallSample() {
  return `npm install @questbase/sdk
# or
bun add @questbase/sdk`;
}
