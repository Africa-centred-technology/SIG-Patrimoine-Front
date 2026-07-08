import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Tenant, Licence, ProduitCle, Role, PlanLicence } from "@/lib/types";
import { INITIAL_TENANTS, INITIAL_LICENCES } from "@/lib/mockData";

interface AppState {
  role: Role | null;
  currentTenantId: string | null;
  impersonatedTenantId: string | null;
  activeProduct: ProduitCle | null;
  tenants: Tenant[];
  licences: Licence[];
  hydrated: boolean;
  loginAsSuperAdmin: () => void;
  loginAsTenant: (tenantId: string) => void;
  logout: () => void;
  impersonate: (tenantId: string, product: ProduitCle) => void;
  stopImpersonation: () => void;
  setActiveProduct: (p: ProduitCle) => void;
  createTenant: (data: Omit<Tenant, "id" | "dateCreation" | "nbUtilisateurs" | "nbSites">, produits: ProduitCle[], plan: PlanLicence) => Tenant;
  attribuerLicence: (tenantId: string, produit: ProduitCle, plan: PlanLicence, seats: number, dureeM: number) => void;
  suspendreLicence: (id: string) => void;
  reactiverLicence: (id: string) => void;
  revoquerLicence: (id: string) => void;
  changerPlan: (id: string, plan: PlanLicence) => void;
  effectiveTenantId: string | null;
}

const AppCtx = createContext<AppState | null>(null);

const PLAN_PRIX: Record<PlanLicence, { prix: number; seats: number }> = {
  STARTER: { prix: 0, seats: 5 },
  PRO: { prix: 4900, seats: 25 },
  ENTERPRISE: { prix: 12000, seats: 100 },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [impersonatedTenantId, setImpersonatedTenantId] = useState<string | null>(null);
  const [activeProduct, setActiveProductState] = useState<ProduitCle | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [licences, setLicences] = useState<Licence[]>(INITIAL_LICENCES);
  const [hydrated, setHydrated] = useState(false);

  // Hydratation depuis localStorage (client uniquement)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sig-patrimoine-state");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.role) setRole(s.role);
        if (s.currentTenantId) setCurrentTenantId(s.currentTenantId);
        if (s.impersonatedTenantId) setImpersonatedTenantId(s.impersonatedTenantId);
        if (s.activeProduct) setActiveProductState(s.activeProduct);
        if (Array.isArray(s.tenants) && s.tenants.length) setTenants(s.tenants);
        if (Array.isArray(s.licences) && s.licences.length) setLicences(s.licences);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        "sig-patrimoine-state",
        JSON.stringify({ role, currentTenantId, impersonatedTenantId, activeProduct, tenants, licences }),
      );
    } catch {}
  }, [hydrated, role, currentTenantId, impersonatedTenantId, activeProduct, tenants, licences]);

  const loginAsSuperAdmin = useCallback(() => {
    setRole("SUPERADMIN");
    setCurrentTenantId(null);
    setImpersonatedTenantId(null);
    setActiveProductState(null);
  }, []);

  const loginAsTenant = useCallback((tenantId: string) => {
    setRole("TENANT_ADMIN");
    setCurrentTenantId(tenantId);
    setImpersonatedTenantId(null);
    setActiveProductState(null);
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setCurrentTenantId(null);
    setImpersonatedTenantId(null);
    setActiveProductState(null);
  }, []);

  const impersonate = useCallback((tenantId: string, product: ProduitCle) => {
    setImpersonatedTenantId(tenantId);
    setActiveProductState(product);
  }, []);

  const stopImpersonation = useCallback(() => {
    setImpersonatedTenantId(null);
    setActiveProductState(null);
  }, []);

  const setActiveProduct = useCallback((p: ProduitCle) => setActiveProductState(p), []);

  const createTenant: AppState["createTenant"] = (data, produits, plan) => {
    const id = `t-${Date.now()}`;
    const t: Tenant = {
      ...data,
      id,
      dateCreation: new Date().toISOString().slice(0, 10),
      nbUtilisateurs: 1,
      nbSites: 0,
      produits,
    };
    setTenants((prev) => [t, ...prev]);
    const meta = PLAN_PRIX[plan];
    const newLic: Licence[] = produits.map((p, i) => ({
      id: `l-${Date.now()}-${i}`,
      tenantId: id,
      produit: p,
      plan,
      statut: plan === "STARTER" ? "ESSAI" : "ACTIVE",
      seats: meta.seats,
      seatsUtilises: 0,
      dateDebut: new Date().toISOString().slice(0, 10),
      dateFin: new Date(Date.now() + (plan === "STARTER" ? 30 : 365) * 86400000).toISOString().slice(0, 10),
      prixMensuelMAD: meta.prix,
      renouvellementAuto: plan !== "STARTER",
    }));
    setLicences((prev) => [...prev, ...newLic]);
    return t;
  };

  const attribuerLicence: AppState["attribuerLicence"] = (tenantId, produit, plan, seats, dureeM) => {
    const meta = PLAN_PRIX[plan];
    const lic: Licence = {
      id: `l-${Date.now()}`,
      tenantId,
      produit,
      plan,
      statut: plan === "STARTER" ? "ESSAI" : "ACTIVE",
      seats: seats || meta.seats,
      seatsUtilises: 0,
      dateDebut: new Date().toISOString().slice(0, 10),
      dateFin: new Date(Date.now() + dureeM * 30 * 86400000).toISOString().slice(0, 10),
      prixMensuelMAD: meta.prix,
      renouvellementAuto: true,
    };
    setLicences((prev) => [...prev, lic]);
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId && !t.produits.includes(produit)
          ? { ...t, produits: [...t.produits, produit] }
          : t,
      ),
    );
  };

  const suspendreLicence = (id: string) =>
    setLicences((prev) => prev.map((l) => (l.id === id ? { ...l, statut: "SUSPENDUE" as const } : l)));
  const reactiverLicence = (id: string) =>
    setLicences((prev) => prev.map((l) => (l.id === id ? { ...l, statut: "ACTIVE" as const } : l)));
  const revoquerLicence = (id: string) => {
    const lic = licences.find((l) => l.id === id);
    setLicences((prev) => prev.filter((l) => l.id !== id));
    if (lic) {
      setTenants((prev) => prev.map((t) => (t.id === lic.tenantId ? { ...t, produits: t.produits.filter((p) => p !== lic.produit) } : t)));
    }
  };
  const changerPlan = (id: string, plan: PlanLicence) =>
    setLicences((prev) => prev.map((l) => (l.id === id ? { ...l, plan, prixMensuelMAD: PLAN_PRIX[plan].prix, seats: PLAN_PRIX[plan].seats } : l)));

  const effectiveTenantId = impersonatedTenantId ?? currentTenantId;

  return (
    <AppCtx.Provider
      value={{
        role,
        currentTenantId,
        impersonatedTenantId,
        activeProduct,
        tenants,
        licences,
        hydrated,
        loginAsSuperAdmin,
        loginAsTenant,
        logout,
        impersonate,
        stopImpersonation,
        setActiveProduct,
        createTenant,
        attribuerLicence,
        suspendreLicence,
        reactiverLicence,
        revoquerLicence,
        changerPlan,
        effectiveTenantId,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp hors AppProvider");
  return c;
}

export function useTenant(id: string | null | undefined) {
  const { tenants } = useApp();
  return tenants.find((t) => t.id === id) ?? null;
}

export function useLicencesFor(tenantId: string | null | undefined) {
  const { licences } = useApp();
  return licences.filter((l) => l.tenantId === tenantId);
}
