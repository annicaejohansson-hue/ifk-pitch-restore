import { handleErbjudandenRequest } from "./_lib/orders.js";

export default async function handler(
  req: { method?: string; url?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void; end: () => void };
    json: (body: unknown) => void;
    statusCode?: number;
    setHeader?: (name: string, value: string) => void;
    end?: (body?: string) => void;
    headersSent?: boolean;
  },
) {
  req.url = req.url || "/api/erbjudanden-checkout";
  await handleErbjudandenRequest(req as never, res as never);
}
