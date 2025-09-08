
import "server-only"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function POST(req: Request) {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN
  if (!token) {
    console.error("KIWIFY_WEBHOOK_TOKEN ausente")
    return new Response("Server misconfig", { status: 500 })
  }

  // Kiwify manda o token como query param ?token=...
  const url = new URL(req.url)
  const provided = url.searchParams.get("token")

  if (provided !== token) {
    console.warn("Token inválido", { provided })
    return new Response("Unauthorized", { status: 401 })
  }

  // Se o token confere, processa o evento
  let event: any
  try {
    event = await req.json()
  } catch (e) {
    console.error("Body inválido", e)
    return new Response("Bad Request", { status: 400 })
  }

  // Exemplo de roteamento
  if (event.type === "compra_aprovada") {
    // TODO: atualizar usuário, liberar curso, etc.
    console.log("Compra aprovada:", event)
  }

  return new Response("OK", { status: 200 })
}
