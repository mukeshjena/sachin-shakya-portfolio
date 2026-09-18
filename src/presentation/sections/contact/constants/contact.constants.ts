// presentation/sections/contact/constants/contact.constants.ts
// Copy, field configurations, direct channels, and transmission readouts for ContactSection.
// Zero emojis, strictly Cupertino/outline style iconography metadata.

export const CONTACT_COPY = {
  eyebrow: "EXECUTIVE CONSULTATION // ARCHITECTURE ADVISORY",
  headline: "Let's Talk About Your Cloud Architecture & Costs",
  subheadline:
    "Direct engagement desk for FinOps cost reduction initiatives, multi-cloud Kubernetes platforms, and executive cloud engineering leadership roles.",
  directChannelsHeader: "DIRECT EXECUTIVE DESK",
  directChannelsSub:
    "Direct communication coordinates for enterprise stakeholders, founders, and hiring directors.",
  responseSla: "RESPONSE SLA: < 24 HOURS // DIRECT ARCHITECT REPLY",
  formTitle: "START AN ENGAGEMENT",
  formSubtitle:
    "Fill out the mission parameters below. Submissions are saved to the cluster inbox and dispatched directly to Sachin's private mailbox.",
  submitButtonText: "Dispatch Consultation Inquiry",
  submittingText: "Encrypting & Dispatching Transmission...",
  successTitle: "TRANSMISSION CONFIRMED // INQUIRY RECORDED",
  successMessage:
    "Your consultation inquiry has been recorded in the cluster inbox and forwarded to Sachin Shakya. Expect a direct, technical response within 24 business hours.",
  sendAnotherButton: "Send Another Message",
} as const;

export const CONTACT_DIRECT_CHANNELS = [
  {
    id: "email",
    label: "DIRECT EMAIL",
    value: "sachin.shakya@live.com",
    href: "mailto:sachin.shakya@live.com",
    caption: "Primary channel for advisory RFPs and confidential discussions",
  },
  {
    id: "phone",
    label: "DIRECT VOICE / WHATSAPP",
    value: "+91 99112 00473",
    href: "tel:+919911200473",
    caption: "IST Business Hours (UTC+5:30) // Global scheduling by appointment",
  },
  {
    id: "location",
    label: "HEADQUARTERS VECTOR",
    value: "Faridabad, NCR, India",
    href: "https://maps.google.com/?q=Faridabad,+Haryana,+India",
    caption: "Available for global remote leadership & hybrid onsite delivery",
  },
] as const;

export const CONTACT_FIELD_CONFIG = {
  name: {
    label: "Full Name",
    placeholder: "e.g. Alex Morgan",
  },
  email: {
    label: "Corporate / Business Email",
    placeholder: "e.g. alex.morgan@enterprise.com",
  },
  subject: {
    label: "Engagement Subject",
    placeholder: "e.g. Cloud Cost Optimization Audit ($150K/mo AWS Fleet)",
  },
  message: {
    label: "Project Scope / Challenge Description",
    placeholder:
      "Outline your current infrastructure footprint, primary pain points, cloud spend goals, or timeline expectations...",
  },
} as const;
