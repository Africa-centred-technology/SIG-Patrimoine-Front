import { Outlet, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Package, KeyRound, CreditCard, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { THEMES } from "@/lib/theme";
import { useApp } from "@/contexts/AppContext";

const items = [
  { to: "/platform/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/platform/tenants", label: "Organisations", icon: Building2 },
  { to: "/platform/products", label: "Produits", icon: Package },
  { to: "/platform/licences", label: "Licences", icon: KeyRound },
  { to: "/platform/billing", label: "Facturation", icon: CreditCard },
  { to: "/platform/settings", label: "Paramètres", icon: Settings },
];

export function PlatformLayout() {
  const { role, hydrated } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    if (hydrated && role !== "SUPERADMIN") navigate({ to: "/" });
  }, [hydrated, role, navigate]);
  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen && (
        <Sidebar
          theme={THEMES.platform}
          items={items}
          brandTop="SIG Patrimoine"
          brandSub="Console plateforme"
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title="Console plateforme"
          subtitle="Administration multi-tenant"
          onMenuClick={sidebarOpen ? undefined : () => setSidebarOpen(true)}
        />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
