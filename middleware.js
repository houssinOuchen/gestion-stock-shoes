import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { de } from "zod/v4/locales/index.cjs";

const PUBLIC_ROUTES = ["/login", "/unauthorized"];

function getJwtSecretKey() {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret) throw new Error("JWT Secret is not defined");
  return new TextEncoder().encode(secret);
}

export async function middleware(req) {
    const { pathname } = req.nextUrl;


    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const { payload: decoded } = await jwtVerify(token, getJwtSecretKey());
        // const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;
        // const decoded = jwt.verify(token, SECRET);

        if (pathname.startsWith("/users") && decoded.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        const Acces = ["ADMIN", "COMMERCIALE", "STOCK_MANAGER", "OPERATOR"];
        if (pathname.startsWith("/") && !Acces.includes(decoded.role)) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        const AccesMatiere = ["ADMIN", "STOCK_MANAGER", "OPERATOR"];
        if (pathname.startsWith("/matieres_Premieres") && !AccesMatiere.includes(decoded.role)) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }


        return NextResponse.next();
    } catch (err) {
        console.error("Invalid token:", err.message);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login|unauthorized).*)",
    ],
};