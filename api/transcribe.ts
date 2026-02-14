import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Clé API OpenAI non configurée" });
    }

    const { audio } = req.body;
    if (!audio) {
      return res.status(400).json({ error: "Données audio manquantes" });
    }

    // Le client envoie l'audio en base64 avec un préfixe data URI
    const base64Data = audio.includes(",") ? audio.split(",")[1] : audio;
    const audioBuffer = Buffer.from(base64Data, "base64");

    // Déterminer l'extension à partir du type MIME
    let ext = "webm";
    if (audio.includes("audio/mp4")) ext = "mp4";
    else if (audio.includes("audio/ogg")) ext = "ogg";
    else if (audio.includes("audio/wav")) ext = "wav";

    // Créer un File compatible avec l'API OpenAI
    const file = new File([audioBuffer], `audio.${ext}`, {
      type: `audio/${ext}`,
    });

    const openai = new OpenAI({ apiKey });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "fr",
      response_format: "text",
    });

    return res.status(200).json({ text: transcription });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur de transcription";
    return res.status(500).json({ error: message });
  }
}
