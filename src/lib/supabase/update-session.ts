import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/imoveis", "/contratos"];
const authRoutes = ["/login", "/cadastro"];

function applyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
}

function redirectWithSessionCookies(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const redirectResponse = NextResponse.redirect(url);
  applyCookies(supabaseResponse, redirectResponse);
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Não inserir lógica entre createServerClient e getUser (Supabase SSR).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtectedRoute && !user) {
    return redirectWithSessionCookies(request, supabaseResponse, "/login");
  }

  if (isAuthRoute && user) {
    return redirectWithSessionCookies(request, supabaseResponse, "/dashboard");
  }

  if (user && pathname === "/") {
    return redirectWithSessionCookies(request, supabaseResponse, "/dashboard");
  }

  supabaseResponse.headers.set("Cache-Control", "private, no-store");

  return supabaseResponse;
}
