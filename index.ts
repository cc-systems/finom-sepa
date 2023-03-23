import { program } from "commander";
import { XMLParser } from "fast-xml-parser";
import { readFile } from "fs/promises";

program
  .description(
    "CLI to convert SEPA XML files into a multi transfer CSV file that can be used with finom"
  )
  .argument("<sepa.xml>", "SEPA XML file to convert");

program.parse();

async function main() {
  const xml = await readFile(program.args[0]);

  const parser = new XMLParser();
  const sepa = parser.parse(xml);
  const payments = extractPayments(sepa);
  const csv = paymentsToCsv(payments);
  console.log(csv);
}

main();

interface Payment {
  readonly beneficiaryName: string;
  readonly iban: string;
  readonly bic: string;
  readonly amount: number;
  readonly currency: string;
  readonly reference: string;
}

function extractPayments(sepa: any): Payment[] {
  const paymentInfo = sepa.Document?.CstmrCdtTrfInitn?.PmtInf;
  if (!paymentInfo) {
    throw new Error("could not find payment info in sepa document");
  }
  const creditorTransactionInfo = paymentInfo.CdtTrfTxInf;
  if (!creditorTransactionInfo) {
    throw new Error("could not find creditor transaction info");
  }

  return (
    Array.isArray(creditorTransactionInfo)
      ? creditorTransactionInfo
      : [creditorTransactionInfo]
  ).map((it) => ({
    beneficiaryName: it.Cdtr?.Nm,
    iban: it.CdtrAcct?.Id?.IBAN,
    bic: it.CdtrAgt?.FinInstnId?.BIC,
    amount: it.Amt.InstdAmt,
    currency: "EUR",
    reference: it.RmtInf.Ustrd,
  }));
}
function paymentsToCsv(payments: Payment[]): string {
  const rows = [`beneficiary_name;iban;bic;amount;currency;reference`];
  for (const payment of payments) {
    const { beneficiaryName, iban, bic, amount, currency, reference } = payment;
    rows.push(
      [beneficiaryName, iban, bic, amount.toFixed(2), currency, reference].join(
        ";"
      )
    );
  }
  return rows.join("\n");
}
