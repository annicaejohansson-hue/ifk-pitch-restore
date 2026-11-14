import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  claimOfferPayment,
  createOfferOrder,
  loadServerConfig,
} from "../api/_lib/orders";

const dir = await mkdtemp(join(tmpdir(), "caselo-offers-"));

const persist = {
  persistOrder: async (order: { orderRef: string; amountSek: number; status: string }) => {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(join(dir, "order.json"), JSON.stringify(order), "utf8");
  },
  persistClaim: async (claim: { orderRef: string; status: string }) => {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(join(dir, "claim.json"), JSON.stringify(claim), "utf8");
  },
};

const config = loadServerConfig(
  {
    OFFERS_SWISH_NUMBER: "1232593654",
    FORMSPREE_ORDERS_FORM_ID: "",
    OFFERS_LOCAL_STORE: "1",
    NODE_ENV: "test",
    OFFERS_SALES_ENABLED: "true",
  },
  Date.parse("2026-11-04T12:00:00+01:00"),
);

const created = await createOfferOrder(
  {
    productId: "snabbhet",
    buyerName: "Anna Köpare",
    buyerEmail: "anna@example.com",
    buyerEmailConfirm: "anna@example.com",
    recipient: "gift",
    giftLayout: "julklapp-gron",
    giftRecipientName: "Erik",
    amountSek: 9,
    status: "paid",
  },
  config,
  persist,
);

if (!created.ok) {
  throw new Error(created.message);
}

const stored = JSON.parse(await readFile(join(dir, "order.json"), "utf8"));
if (stored.amountSek !== 1000) throw new Error("stored price was not server price");
if (stored.status !== "awaiting_payment") throw new Error("stored paid status");
if (stored.giftLayout !== "julklapp-gron") throw new Error("gift layout was not stored");

const claimed = await claimOfferPayment(
  { orderRef: created.order.orderRef, paid: true, status: "paid" },
  config,
  persist,
);
if (!claimed.ok) throw new Error(claimed.message);
const claimStored = JSON.parse(await readFile(join(dir, "claim.json"), "utf8"));
if (claimStored.status !== "awaiting_payment") {
  throw new Error("claim stored as paid");
}

await rm(dir, { recursive: true, force: true });
console.log(`File-store check passed for ${created.order.orderRef}.`);
