import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { locale?: string } | null;
  const locale = body?.locale === "ar" ? "ar" : "en";

  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set("NEXT_LOCALE", locale, { path: "/" });
  return res;
}
