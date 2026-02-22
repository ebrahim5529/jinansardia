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

  // --- If logged-in admin visits /admin-login, redirect to dashboard ---
  if (pathname === "/admin-login") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token) {
      const { accountType } = token as { accountType?: string };
      if (accountType === "ADMIN") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // --- Auth & Role Protection ---
  const protectedPrefixes = [
    "/dashboard",
    "/warehouses",
    "/users",
    "/settings",
    "/reports",
    "/factories",
    "/hospitals",
    "/blog/posts",
    "/blog/categories",
    "/blog/tags",
    "/factory",
    "/hospital",
  ];
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const url = request.nextUrl.clone();
      // Admin routes redirect to admin-login, others to signin
      const adminPrefixes = [
        "/dashboard",
        "/warehouses",
        "/users",
        "/settings",
        "/reports",
        "/factories",
        "/hospitals",
        "/blog/posts",
        "/blog/categories",
        "/blog/tags",
      ];
      const isAdminRoute = adminPrefixes.some((p) => pathname.startsWith(p));
      url.pathname = isAdminRoute ? "/admin-login" : "/signin";
      return NextResponse.redirect(url);
    }

    const { accountType } = token as { accountType?: string };

    // Admin routes - only ADMIN can access
    const adminPrefixes = [
      "/dashboard",
      "/warehouses",
      "/users",
      "/settings",
      "/reports",
      "/factories",
      "/hospitals",
      "/blog/posts",
      "/blog/categories",
      "/blog/tags",
    ];
    const isAdminRoute = adminPrefixes.some((p) => pathname.startsWith(p));

    if (isAdminRoute && accountType !== "ADMIN") {
      if (accountType === "FACTORY") {
        const url = request.nextUrl.clone();
        url.pathname = "/factory";
        return NextResponse.redirect(url);
      } else if (accountType === "HOSPITAL") {
        const url = request.nextUrl.clone();
        url.pathname = "/hospital";
        return NextResponse.redirect(url);
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }

    // Protect Factory Routes
    if (pathname.startsWith("/factory")) {
      if (accountType !== "FACTORY" && accountType !== "ADMIN") {
        const url = request.nextUrl.clone();
        url.pathname = accountType === "HOSPITAL" ? "/hospital" : "/dashboard";
        return NextResponse.redirect(url);
      }
      // Check if account is active (only for FACTORY accounts, not ADMIN)
      if (accountType === "FACTORY") {
        const { isActive } = token as { isActive?: boolean };
        if (!isActive) {
          const url = request.nextUrl.clone();
          url.pathname = "/account-pending";
          return NextResponse.redirect(url);
        }
      }
    }

    // Protect Hospital Routes
    if (pathname.startsWith("/hospital")) {
      if (accountType !== "HOSPITAL" && accountType !== "ADMIN") {
        const url = request.nextUrl.clone();
        url.pathname = accountType === "FACTORY" ? "/factory" : "/dashboard";
        return NextResponse.redirect(url);
      }
      // Check if account is active (only for HOSPITAL accounts, not ADMIN)
      if (accountType === "HOSPITAL") {
        const { isActive } = token as { isActive?: boolean };
        if (!isActive) {
          const url = request.nextUrl.clone();
          url.pathname = "/account-pending";
          return NextResponse.redirect(url);
        }
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
