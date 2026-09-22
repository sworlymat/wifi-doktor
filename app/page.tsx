import Home from "./Home";
import { SITE_ORIGIN } from "../lib/site";
export async function generateMetadata() {
  return {
    alternates: { canonical: SITE_ORIGIN + "/" },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    openGraph: { url: SITE_ORIGIN + "/", locale: "cs_CZ", type: "website" },
  };
}
export default async function Page({searchParams}:{searchParams:Promise<{checkout?:string}>}) {
  const {checkout} = await searchParams;
  return <Home checkout={checkout} prediagnosticEnabled={process.env.PREDIAGNOSTIC_ENABLED !== "false"}/>;
}
