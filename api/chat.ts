import Anthropic from "@anthropic-ai/sdk";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_PROMPT = `Tu es l'assistant IA d'Eco-BTP Deal, la marketplace de référence pour le réemploi de matériaux de construction (BTP) en France.

## À propos d'Eco-BTP Deal
- Marketplace en ligne spécialisée dans le réemploi et la revente de matériaux de construction
- Objectif : réduire le gaspillage dans le secteur du BTP en facilitant l'économie circulaire
- Plateforme mettant en relation acheteurs et vendeurs de matériaux de seconde main
- Matériaux disponibles : briques, tuiles, bois, métaux, sanitaires, portes, fenêtres, carrelage, isolants, etc.
- Zone de couverture : France métropolitaine

## Services principaux
- **Achat de matériaux de réemploi** : catalogue en ligne avec recherche par catégorie, localisation et prix
- **Vente de matériaux** : les professionnels et particuliers peuvent déposer des annonces
- **Livraison** : service de livraison disponible selon les régions, devis sur demande
- **Accompagnement** : conseils sur la conformité réglementaire et les diagnostics ressources
- **Garanties** : vérification qualité des matériaux, descriptions détaillées, photos

## Réglementation
- Loi AGEC (Anti-Gaspillage pour une Économie Circulaire) : obligation de diagnostic PEMD (Produits Équipements Matériaux Déchets) pour les chantiers de démolition
- REP Bâtiment : filière de Responsabilité Élargie du Producteur appliquée au secteur du bâtiment
- Eco-BTP Deal aide les professionnels à se conformer à ces réglementations

## Avantages du réemploi
- Économies de 30% à 70% par rapport au neuf
- Réduction de l'empreinte carbone du chantier
- Conformité aux exigences environnementales croissantes
- Matériaux de qualité, souvent avec du cachet (ancien)

## Contact
- Email : contact.eco.btp.deal@gmail.com (seul canal de contact)

## Consignes de comportement
- Réponds toujours en français
- Sois professionnel, chaleureux et orienté solution
- Mets en avant les avantages économiques et écologiques du réemploi
- Si tu ne connais pas la réponse exacte, propose de mettre en relation avec l'équipe commerciale
- Encourage les visiteurs à explorer le catalogue et à créer un compte
- Ne donne jamais de prix précis (ils varient selon le stock), renvoie vers le catalogue
- Propose toujours un appel à l'action (visiter le catalogue, contacter l'équipe, demander un devis)
- Garde les réponses concises (max 3-4 paragraphes)`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, lead } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages requis" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Clé API Anthropic non configurée" });
    }

    const client = new Anthropic({ apiKey });

    const systemWithLead = lead
      ? `${SYSTEM_PROMPT}\n\n## Informations sur l'utilisateur actuel\n- Nom : ${lead.name}\n- Email : ${lead.email}\nPersonnalise subtilement tes réponses en utilisant son prénom.`
      : SYSTEM_PROMPT;

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemWithLead,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur interne";
    if (!res.headersSent) {
      return res.status(500).json({ error: message });
    }
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
}
