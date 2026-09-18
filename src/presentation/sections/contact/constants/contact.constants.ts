// presentation/sections/contact/constants/contact.constants.ts
// Copy, field configurations, direct channels, and transmission readouts for ContactSection.
// Zero emojis, strictly Cupertino/outline style iconography metadata.

export const CONTACT_COPY = {
  eyebrow: "CONTACT // UTC+5:30",
  headline: "Let's Talk About Your Cloud Bill",
  subheadline:
    "Open to conversations about CloudOps leadership, cloud cost optimisation programmes, and SRE practice. Email reaches me fastest.",
  directChannelsHeader: "DIRECT REACH",
  directChannelsSub:
    "Direct communication coordinates for enterprise stakeholders, founders, and hiring directors.",
  responseSla: "RESPONSE SLA: < 24 HOURS // DIRECT ARCHITECT REPLY",
  formTitle: "START AN ENGAGEMENT",
  formSubtitle:
    "Fill out the parameters below. Submissions are saved securely and dispatched directly to Sachin's private mailbox.",
  submitButtonText: "Send Message",
  submittingText: "Dispatching Transmission...",
  successTitle: "TRANSMISSION CONFIRMED // INQUIRY RECORDED",
  successMessage:
    "Your consultation inquiry has been recorded and forwarded to Sachin Shakya. Expect a direct, technical response within 24 business hours.",
  sendAnotherButton: "Send Another Message",
} as const;

export const CONTACT_DIRECT_CHANNELS = [
  {
    id: "email",
    label: "EMAIL",
    value: "sachinshakya69@gmail.com",
    href: "mailto:sachinshakya69@gmail.com",
    caption: "Primary channel for advisory RFPs and direct technical reach",
  },
  {
    id: "phone",
    label: "PHONE / WHATSAPP",
    value: "+91 99530 60735",
    href: "tel:+919953060735",
    caption: "IST Business Hours (UTC+5:30) // Voice & WhatsApp direct",
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    value: "in/sachin-shakya0782",
    href: "https://linkedin.com/in/sachin-shakya0782",
    caption: "Professional network, endorsements, and verified credentials",
  },
  {
    id: "location",
    label: "BASED IN",
    value: "Faridabad, Haryana 121005, India",
    href: "https://maps.google.com/?q=Faridabad,+Haryana+121005,+India",
    caption: "Available for global remote leadership & hybrid delivery",
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
