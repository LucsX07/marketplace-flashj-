import { NextResponse } from "next/server";
import { estabelecimentos } from "@/lib/estabelecimentos";

// Exemplo de rota de backend: GET /api/estabelecimentos
export async function GET() {
  return NextResponse.json(estabelecimentos);
}
