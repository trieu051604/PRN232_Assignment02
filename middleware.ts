import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const session = await getSession();

    // Protect routes that require ADMIN role
    const adminRoutes = ["/products/create", "/products/[id]/edit"];
    const isAdminRoute = adminRoutes.some(route => {
        if (route.includes("[id]")) {
            return request.nextUrl.pathname.startsWith("/products/") && request.nextUrl.pathname.endsWith("/edit");
        }
        return request.nextUrl.pathname.startsWith(route);
    });

    if (isAdminRoute) {
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // General protected routes (any logged-in user)
    const userProtectedRoutes = ["/cart", "/checkout", "/orders"];
    const isUserProtectedRoute = userProtectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (isUserProtectedRoute) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        // Redirect ADMIN away from customer-only pages
        if (session.user.role === "ADMIN") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return await updateSession(request) || NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
