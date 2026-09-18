// infrastructure/email/EmailApiSender.ts
// Outbound email delivery service adapting IEmailSender to the Cloudflare Edge Worker gateway.
// Zero credentials exposed to client bundles — requests route through /api/contact or microservice.

import type { EmailPayload, IEmailSender } from "../../domain/repositories/admin/IEmailSender";
import { getEnv } from "../system/env";

export class EmailApiSender implements IEmailSender {
  /**
   * Dispatches a transactional email through the secure edge proxy.
   */
  async send(payload: EmailPayload): Promise<void> {
    const env = getEnv();
    const rawUrl = env.email.apiUrl || "/api/contact";
    const targetUrl =
      typeof window === "undefined" && rawUrl.startsWith("/")
        ? `${env.app.siteUrl}${rawUrl}`
        : rawUrl;

    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-requested-with": "XMLHttpRequest",
        },
        body: JSON.stringify({
          name: payload.replyTo || "Consultation Inquiry",
          email: payload.replyTo || "inquiry@sachin-shakya.com",
          subject: payload.subject,
          message: payload.html,
          html: payload.html,
          to: payload.to,
          profile: env.email.profile,
          customConfig: {
            fromName: "Sachin Shakya — Admin Console",
            fromEmail: "sachin.shakya@live.com",
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "Unknown error");
        // In local Vite dev environment, /api/contact might not be running if worker is standalone.
        // Log graceful telemetry warning rather than crashing user session.
        if (env.app.isDev) {
          console.warn(
            `[EmailApiSender:DevMode] Edge email proxy returned ${response.status} (${errText}). Outbound notification simulated.`
          );
          return;
        }

        throw new Error(`Email dispatch failed with status ${response.status}: ${errText}`);
      }
    } catch (err: unknown) {
      if (env.app.isDev) {
        console.warn(
          "[EmailApiSender:DevMode] Local edge email dispatch simulated:",
          err instanceof Error ? err.message : err
        );
        return;
      }

      throw err instanceof Error ? err : new Error("Failed to dispatch outbound email.");
    }
  }
}
