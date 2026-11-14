import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { handleErbjudandenRequest } from "./api/_lib/orders";

const isOfferApi = (url = "") => {
  const path = url.split("?")[0] ?? "";
  return (
    path === "/api/erbjudanden-checkout" ||
    path === "/api/erbjudanden-order" ||
    path === "/api/erbjudanden-payment-claim"
  );
};

const attach = (server: {
  middlewares: {
    use: (
      fn: (
        req: IncomingMessage,
        res: ServerResponse,
        next: () => void,
      ) => void,
    ) => void;
  };
}) => {
  server.middlewares.use((req, res, next) => {
    if (!isOfferApi(req.url ?? "")) {
      next();
      return;
    }
    void handleErbjudandenRequest(req, res).catch(() => {
      if (res.headersSent) return;
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          ok: false,
          error: "server-error",
          message: "Ett tekniskt fel uppstod. Försök igen eller mejla oss.",
        }),
      );
    });
  });
};

export function erbjudandenApiPlugin(): Plugin {
  return {
    name: "erbjudanden-api",
    configureServer(server) {
      attach(server);
    },
    configurePreviewServer(server) {
      attach(server);
    },
  };
}
