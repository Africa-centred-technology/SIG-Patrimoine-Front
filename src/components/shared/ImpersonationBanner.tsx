import { useNavigate } from "@tanstack/react-router";
import { Eye, ArrowLeft } from "lucide-react";
import { useApp, useTenant } from "@/contexts/AppContext";

export function ImpersonationBanner() {
  const { impersonatedTenantId, stopImpersonation } = useApp();
  const tenant = useTenant(impersonatedTenantId);
  const navigate = useNavigate();
  if (!impersonatedTenantId || !tenant) return null;
  return (
    <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between text-sm shadow-md">
      <div className="flex items-center gap-2">
        <Eye size={16} />
        <span>
          <strong>Mode admin</strong> — vous consultez l'espace de{" "}
          <strong>{tenant.nom}</strong>
        </span>
      </div>
      <button
        onClick={() => {
          stopImpersonation();
          navigate({ to: "/platform/tenants/$id", params: { id: tenant.id } });
        }}
        className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-md px-3 py-1 text-xs font-medium transition"
      >
        <ArrowLeft size={14} /> Revenir à la console
      </button>
    </div>
  );
}
