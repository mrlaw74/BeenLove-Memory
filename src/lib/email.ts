import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export async function sendAnniversaryEmail(to: string, years: number) {
  if (!resend) {
    console.warn("Resend API key is missing. Skipping email notification.");
    return { success: false, error: "Missing API setup" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "BeenLove Memory <notifications@beenlove.online>",
      to: [to],
      subject: `Happy ${years} Year Anniversary! 💖`,
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #fff5f7;">
          <h1 style="color: #db2777;">Happy Anniversary!</h1>
          <p style="font-size: 18px; color: #4b5563;">You've been together for <strong>${years}</strong> beautiful years.</p>
          <div style="margin-top: 30px;">
            <a href="https://beenlove.online" style="background-color: #db2777; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">View Our Timeline</a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
