import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

function buildResponse(nonce: string) {
  const response = NextResponse.json({ nonce });
  response.cookies.set({
    name: "siwe-nonce",
    value: nonce,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST() {
  const nonce = randomBytes(16).toString("hex");
  return buildResponse(nonce);
}

export async function GET() {
  const nonce = randomBytes(16).toString("hex");
  return buildResponse(nonce);
}
