import { handleErbjudandenRequest } from "./_lib/orders.js";

export default async function handler(
  req: { method?: string; url?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void; end: () => void };
    json: (body: unknown) => void;
  },
) {
  req.url = "/api/erbjudanden-prepaid";
  await handleErbjudandenRequest(req as never, res as never);
}
