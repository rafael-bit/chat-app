import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
	try {
		await connectDB();
		const { name, whatsapp } = await req.json();

		if (!name || !whatsapp) {
			return NextResponse.json({ error: "Nome e WhatsApp são obrigatórios" }, { status: 400 });
		}

		const newUser = new User({ name, whatsapp });
		await newUser.save();

		return NextResponse.json({ message: "Usuário cadastrado com sucesso" }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Erro ao salvar usuário" }, { status: 500 });
	}
}
