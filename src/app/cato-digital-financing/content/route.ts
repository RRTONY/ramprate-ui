import { signInHandler } from "@/lib/cato-brief/routes";

export const runtime = "nodejs";
export const POST = signInHandler("original");
