import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type Locale = "en" | "ar";

function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Legacy support: if the URL has /ar or /en prefix, strip it and set cookie.
  if (isLocale(first)) {
    const locale = first;
    const url = request.nextUrl.clone();
    url.pathname = "/" + segments.slice(1).join("/");
    if (url.pathname === "//" || url.pathname === "/") url.pathname = "/";

    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  // --- Auth & Role Protection ---
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    const { accountType } = token as { accountType?: string };

    // Redirect root /dashboard to specific dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const url = request.nextUrl.clone();
      if (accountType === "FACTORY") {
        url.pathname = "/dashboard/factory";
        return NextResponse.redirect(url);
      } else if (accountType === "HOSPITAL") {
        url.pathname = "/dashboard/hospital";
        return NextResponse.redirect(url);
      }
      // If no valid role, maybe stay here or 403? 
      // For now, let it fall through or redirect to signin if we want strictness
    }

    // Protect Factory Routes
    if (pathname.startsWith("/dashboard/factory")) {
      if (accountType !== "FACTORY") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard"; // Will re-evaluate and send to correct place
        return NextResponse.redirect(url);
      }
    }

    // Protect Hospital Routes
    if (pathname.startsWith("/dashboard/hospital")) {
      if (accountType !== "HOSPITAL") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }
  // ------------------------------

  // Cookie-based locale only (no URL prefix)
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(cookieLocale)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", "en", { path: "/" });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
