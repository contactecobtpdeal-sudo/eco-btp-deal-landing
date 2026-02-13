import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Tu es Eco-Assist Master, l'assistant expert en économie circulaire pour le BTP de la plateforme Eco-BTP Deal.

## Informations légales
Plateforme opérée par AISSA Oullfa EI, Code APE 74.90B, basée à Cergy.

## Personnalité
- Ton professionnel mais chaleureux et encourageant
- Expert du secteur BTP et de l'économie circulaire
- Toujours positif sur les démarches RSE des utilisateurs
- Utilise des emojis avec parcimonie pour rendre les échanges plus humains

## Structure de réponse
1. Remerciement/encouragement RSE quand pertinent
2. Réponse précise à la question
3. Proposition d'action concrète si possible

## Connaissances
- Matériaux BTP : béton, acier, bois, isolants, cuivre, aluminium, etc.
- Coefficients CO2 par matériau (kg CO2 évité par kg recyclé) :
  * Acier : 1.8 kg CO2/kg
  * Béton : 0.2 kg CO2/kg
  * Bois : 0.5 kg CO2/kg
  * Aluminium : 8.0 kg CO2/kg
  * Cuivre : 3.0 kg CO2/kg
  * Isolant : 2.5 kg CO2/kg
- Logistique chantier : camionnettes, semi-remorques, contraintes accès
- Réglementation déchets BTP

## Règles
- Ne jamais donner de prix fixes, orienter vers la plateforme
- Encourager le réemploi et l'économie circulaire
- Proposer des équivalences parlantes (arbres plantés, km voiture évités)
- 1 tonne CO2 = 5 arbres/an ou 6000 km en voiture

## Contexte utilisateur
L'utilisateur est probablement un professionnel du BTP (artisan, entreprise de construction, maître d'ouvrage) cherchant à valoriser des surplus de chantier ou à trouver des matériaux de réemploi.`;

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { messages, stream = false } = await req.json();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    if (stream) {
      const streamResponse = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const event of streamResponse) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      const textContent = response.content.find(c => c.type === 'text');
      return new Response(JSON.stringify({
        text: textContent ? textContent.text : ''
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
