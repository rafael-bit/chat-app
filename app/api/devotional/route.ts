import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function GET() {
	try {
		if (!OPENAI_API_KEY) {
			return NextResponse.json({ error: "Chave da OpenAI não configurada" }, { status: 500 });
		}

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "system",
						content: "Você é um assistente especializado em criar devocionais bíblicos inspiradores."
					},
					{
						role: "user",
						content: `Por favor, gere um devocional bíblico que inclua:
							1. Um versículo bíblico (com referência)
							2. Uma reflexão curta (máximo 3 parágrafos)
							3. Uma aplicação prática para o dia`
					}
				],
				temperature: 0.7,
				max_tokens: 1000
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('OpenAI API Error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorData
			});
			throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
		}

		const data = await response.json();

		if (!data.choices?.[0]?.message?.content) {
			throw new Error("Resposta inválida da API");
		}

		return NextResponse.json({ devotional: data.choices[0].message.content });
	} catch (error) {
		console.error('Error:', error);
		return NextResponse.json({
			error: error instanceof Error ? error.message : "Erro ao gerar devocional"
		}, { status: 500 });
	}
}
