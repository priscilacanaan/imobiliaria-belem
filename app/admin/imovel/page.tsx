"use client";

import { Suspense } from "react";
import { PropertyEditor } from "@/components/admin/PropertyEditor";

// /admin/imovel        → novo imóvel
// /admin/imovel?id=p1  → editar imóvel
export default function PropertyEditorPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-sm text-ink-500">Carregando…</div>}>
      <PropertyEditor />
    </Suspense>
  );
}
