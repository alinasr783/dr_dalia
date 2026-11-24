import { NextRequest } from "next/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { timingSafeEqual } from "node:crypto";
import { createMcpServer, MCP_TOOLS_SUMMARY } from "@/lib/mcp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, X-API-Key, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID, X-Requested-With",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function createTransport() {
  return new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
    sessionIdGenerator: undefined,
  });
}

function withLenientAccept(req: NextRequest): Request {
  const headers = new Headers(req.headers);
  const accept = headers.get("accept") ?? "";

  if (req.method === "POST") {
    if (accept.includes("application/json") && accept.includes("text/event-stream")) {
      return req;
    }
    let next = accept;
    if (!next.includes("application/json")) {
      next = next ? `application/json, ${next}` : "application/json";
    }
    if (!next.includes("text/event-stream")) {
      next = next ? `${next}, text/event-stream` : "text/event-stream";
    }
    headers.set("accept", next);
    return new Request(req.url, {
      method: "POST",
      headers,
      body: req.body,
      duplex: "half",
    } as unknown as RequestInit);
  }

  if (accept.includes("text/event-stream")) {
    return req;
  }
  const next = accept ? `${accept}, text/event-stream` : "text/event-stream";
  headers.set("accept", next);
  return new Request(req.url, { method: req.method, headers });
}

// ---------------------------------------------------------------------------
// Authentication: every MCP call must carry the secret set in MCP_API_KEY,
// via "Authorization: Bearer <key>", "X-API-Key: <key>" or "?key=<key>".
// If MCP_API_KEY is not configured the endpoint stays closed.
// ---------------------------------------------------------------------------
function extractKey(req: NextRequest): string {
  const auth = req.headers.get("authorization") ?? "";
  if (/^bearer\s+/i.test(auth)) return auth.replace(/^bearer\s+/i, "").trim();
  const headerKey = req.headers.get("x-api-key");
  if (headerKey) return headerKey.trim();
  return new URL(req.url).searchParams.get("key")?.trim() ?? "";
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function authError(req: NextRequest): Response | null {
  const expected = process.env.MCP_API_KEY?.trim();
  if (!expected || expected.length < 16) {
    return withCors(
      Response.json(
        {
          jsonrpc: "2.0",
          error: { code: -32001, message: "MCP server is not configured (MCP_API_KEY missing)" },
          id: null,
        },
        { status: 503 }
      )
    );
  }
  if (!safeEqual(extractKey(req), expected)) {
    return withCors(
      Response.json(
        { jsonrpc: "2.0", error: { code: -32001, message: "Unauthorized" }, id: null },
        { status: 401, headers: { "WWW-Authenticate": 'Bearer realm="mcp"' } }
      )
    );
  }
  return null;
}

async function handleMcpRequest(req: NextRequest): Promise<Response> {
  const denied = authError(req);
  if (denied) return denied;
  const transport = createTransport();
  const server = createMcpServer();
  await server.connect(transport);
  try {
    return withCors(await transport.handleRequest(withLenientAccept(req)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return withCors(
      Response.json(
        { jsonrpc: "2.0", error: { code: -32603, message }, id: null },
        { status: 500 }
      )
    );
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const accept = req.headers.get("accept") ?? "";
  // If browser or dashboard status check requests info JSON (not SSE stream)
  if (
    url.searchParams.get("info") === "1" ||
    (!accept.includes("text/event-stream") &&
      (accept.includes("text/html") || url.searchParams.has("status")))
  ) {
    return withCors(
      Response.json({
        name: "dr-dalia-articles-mcp",
        version: "1.1.0",
        status: "online",
        protocol: "Model Context Protocol (Streamable HTTP / JSON-RPC 2.0)",
        endpoint: "/api/mcp",
        auth: "Authorization: Bearer <MCP_API_KEY>",
        configured: Boolean(process.env.MCP_API_KEY && process.env.MCP_API_KEY.trim().length >= 16),
        tools: MCP_TOOLS_SUMMARY,
      })
    );
  }
  return handleMcpRequest(req);
}

export async function POST(req: NextRequest) {
  return handleMcpRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleMcpRequest(req);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
