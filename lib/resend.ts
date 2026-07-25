import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    "RESEND_API_KEY is not set. Email functionality will not work.\n" +
    "Get your API key from https://resend.com"
  );
}

export const resend = apiKey ? new Resend(apiKey) : null;
