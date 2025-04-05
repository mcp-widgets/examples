import NextAuth from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
};
