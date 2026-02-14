import type { VercelRequest, VercelResponse } from "@vercel/node";

const NOTIFY_EMAIL = "contact.eco.btp.deal@gmail.com";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, messages } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nom et email requis" });
    }

    // Format conversation for the notification
    const conversationText = messages && Array.isArray(messages)
      ? messages
          .map((m: { role: string; content: string }) =>
            `${m.role === "user" ? "Client" : "Assistant"}: ${m.content}`
          )
          .join("\n\n")
      : "Aucun message échangé.";

    const timestamp = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    const subject = `Nouveau lead Eco-BTP Deal : ${name}`;
    const body = [
      `Nouveau contact depuis le chatbot Eco-BTP Deal`,
      ``,
      `Date : ${timestamp}`,
      `Nom : ${name}`,
      `Email : ${email}`,
      ``,
      `--- Conversation ---`,
      conversationText,
    ].join("\n");

    // Send via Vercel's built-in fetch to a simple email relay
    // Using a mailto-based approach via the Resend API or similar
    // For now, we log and store - the lead data is sent to the chat API
    // which personalizes responses, and we notify via a webhook-style POST

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Eco-BTP Deal <onboarding@resend.dev>",
          to: [NOTIFY_EMAIL],
          subject: subject,
          text: body,
        }),
      });
    } else {
      // Fallback: log the lead (visible in Vercel function logs)
      console.log("=== NOUVEAU LEAD ECO-BTP DEAL ===");
      console.log(`Date: ${timestamp}`);
      console.log(`Nom: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Messages: ${messages?.length || 0}`);
      console.log("=================================");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur";
    console.error("Lead notification error:", message);
    return res.status(500).json({ error: message });
  }
}
