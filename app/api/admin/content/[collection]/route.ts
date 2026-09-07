import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { isValidCollection, readCollection, writeCollection } from "@/lib/contentStore";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { collection: string } }) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!isValidCollection(params.collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  }

  const data = await readCollection(params.collection);
  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: { params: { collection: string } }) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!isValidCollection(params.collection)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  }

  try {
    const body = await req.json();
    if (body === undefined || body === null) {
      return NextResponse.json({ error: "Missing body." }, { status: 400 });
    }
    await writeCollection(params.collection, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
