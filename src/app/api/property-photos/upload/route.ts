import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/session";
import { uploadPropertyPhotoStaging } from "@/services/property-photos/operations";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ success: false, message: "Não autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const operationId = formData.get("operation_id");
  const file = formData.get("file");

  if (typeof operationId !== "string" || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "Dados inválidos" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadPropertyPhotoStaging({
    operationId,
    fileName: file.name,
    buffer,
  });

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
