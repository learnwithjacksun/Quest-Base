import type { ComponentType } from "react";
import {
  ApiIcon,
  DashboardSquare01Icon,
  MailSend01Icon,
  SecurityCheckIcon,
  Shield01Icon,
  UserMultipleIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons";
import Form2MailIllustration from "./illustrations/form2mail-illustration";
import OtpIllustration from "./illustrations/otp-illustration";
import WaitlistIllustration from "./illustrations/waitlist-illustration";
import SpamIllustration from "./illustrations/spam-illustration";
import ApiIllustration from "./illustrations/api-illustration";
import WebhooksIllustration from "./illustrations/webhooks-illustration";
import DashboardIllustration from "./illustrations/dashboard-illustration";

export type ServiceCardData = {
  id: string;
  title: string;
  description: string;
  icon: typeof MailSend01Icon;
  Illustration: ComponentType;
  colSpan: 1 | 2;
};

export const services: ServiceCardData[] = [
  {
    id: "form2mail",
    title: "form2mail",
    description:
      "Point any HTML form at our endpoint and deliver submissions straight to your inbox — no backend required.",
    icon: MailSend01Icon,
    Illustration: Form2MailIllustration,
    colSpan: 2,
  },
  {
    id: "otp",
    title: "OTP Verification",
    description:
      "Send and verify OTPs over email and SMS with configurable templates, expiry, and rate limits.",
    icon: SecurityCheckIcon,
    Illustration: OtpIllustration,
    colSpan: 1,
  },
  {
    id: "waitlist",
    title: "Waitlist Management",
    description:
      "Collect early-access signups, manage your queue, and invite users when you're ready to launch.",
    icon: UserMultipleIcon,
    Illustration: WaitlistIllustration,
    colSpan: 1,
  },
  {
    id: "spam",
    title: "Spam Detection",
    description:
      "Verify emails and filter spam submissions before they reach your inbox or waitlist.",
    icon: Shield01Icon,
    Illustration: SpamIllustration,
    colSpan: 1,
  },
  {
    id: "api",
    title: "Unified API",
    description:
      "One API surface for forms, OTPs, and waitlists — ship features without stitching services together.",
    icon: ApiIcon,
    Illustration: ApiIllustration,
    colSpan: 1,
  },
  {
    id: "webhooks",
    title: "Webhooks",
    description:
      "Push real-time events to your app when submissions arrive, OTPs verify, or waitlists update.",
    icon: WebhookIcon,
    Illustration: WebhooksIllustration,
    colSpan: 1,
  },
  {
    id: "dashboard",
    title: "Developer Dashboard",
    description:
      "Monitor submissions, OTP traffic, and waitlist growth from a single control panel.",
    icon: DashboardSquare01Icon,
    Illustration: DashboardIllustration,
    colSpan: 1,
  },
];
