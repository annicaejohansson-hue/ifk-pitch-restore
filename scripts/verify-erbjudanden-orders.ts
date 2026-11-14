import { runOfferOrderChecks } from "../api/_lib/orders";

const result = await runOfferOrderChecks();
if (!result.ok) {
  console.error("Erbjudanden order checks failed:");
  for (const failure of result.failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Erbjudanden order checks passed (${result.recorded} orders persisted in-memory).`);
