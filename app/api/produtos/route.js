import { NextResponse } from "next/server";
import { produtos } from "@/lib/produtos";

// Exemplo de rota de backend: GET /api/produtos
export async function GET() {
  return NextResponse.json(produtos);
}
