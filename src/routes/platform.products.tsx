import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Trees,
  Lightbulb,
  Package,
  Droplets,
  Zap,
  Building2,
  Leaf,
  Sun,
  Wrench,
  Boxes,
  Plus,
  Pencil,
  Copy,
  Trash2,
  X,
  Check,
  GripVertical,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { ProduitDef, ModuleProduit } from "@/lib/types";

export const Route = createFileRoute("/platform/products")({ component: ProductsAdmin });

// Icônes disponibles pour un produit
const ICONS: Record<string, LucideIcon> = {
  Trees,
  Lightbulb,
  Package,
  Droplets,
  Zap,
  Building2,
  Leaf,
  Sun,
  Wrench,
  Boxes,
};
const ICON_NAMES = Object.keys(ICONS);
const iconOf = (name: string): LucideIcon => ICONS[name] ?? Package;

// Palettes d'accent (dégradés) proposées
const ACCENTS: { label: string; from: string; to: string }[] = [
  { label: "Emerald", from: "from-emerald-700", to: "to-emerald-950" },
  { label: "Ambre & Nuit", from: "from-amber-500", to: "to-stone-900" },
  { label: "Sky", from: "from-sky-600", to: "to-slate-900" },
  { label: "Violet", from: "from-violet-600", to: "to-slate-900" },
  { label: "Rose", from: "from-rose-600", to: "to-slate-900" },
  { label: "Slate", from: "from-slate-600", to: "to-slate-900" },
];

const blankProduit = (): ProduitDef => ({
  cle: "",
  nom: "",
  description: "",
  icone: "Package",
  accentFrom: "from-slate-600",
  accentTo: "to-slate-900",
  actif: true,
  modules: [],
});

function ProductsAdmin() {
  const { produits, upsertProduit, deleteProduit } = useApp();
  const [draft, setDraft] = useState<ProduitDef | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ProduitDef | null>(null);

  const openNew = () => {
    setDraft(blankProduit());
    setIsNew(true);
  };
  const openEdit = (p: ProduitDef) => {
    setDraft(JSON.parse(JSON.stringify(p)));
    setIsNew(false);
  };
  const duplicate = (p: ProduitDef) => {
    const copy: ProduitDef = JSON.parse(JSON.stringify(p));
    copy.cle = `${p.cle}_COPIE`;
    copy.nom = `${p.nom} (copie)`;
    setDraft(copy);
    setIsNew(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Produits</h2>
          <p className="text-sm text-slate-500">
            Catalogue 100 % paramétrable. Chaque produit et ses modules sont configurables ; selon
            le tenant, on n'active que ce dont il a besoin.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition"
        >
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {produits.map((p) => {
          const Icon = iconOf(p.icone);
          const nbActifs = p.modules.filter((m) => m.actif).length;
          return (
            <div
              key={p.cle}
              className="group rounded-2xl overflow-hidden border shadow-sm bg-white flex flex-col"
            >
              <div className={`bg-gradient-to-br ${p.accentFrom} ${p.accentTo} text-white p-6 relative`}>
                <Icon className="h-10 w-10 mb-3" />
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{p.nom || "Sans nom"}</h3>
                  {!p.actif && (
                    <span className="text-[10px] uppercase tracking-wide bg-black/30 rounded px-1.5 py-0.5">
                      Inactif
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/80 mt-1">{p.description}</p>
                <code className="absolute top-4 right-4 text-[10px] bg-black/20 rounded px-1.5 py-0.5">
                  {p.cle}
                </code>
              </div>
              <div className="p-5 text-sm text-slate-700 space-y-3 flex-1">
                <div className="flex flex-wrap gap-1.5">
                  {p.modules.slice(0, 8).map((m) => (
                    <span
                      key={m.cle}
                      className={`text-xs rounded-full px-2 py-0.5 ${
                        m.actif ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400 line-through"
                      }`}
                    >
                      {m.nom}
                    </span>
                  ))}
                  {p.modules.length > 8 && (
                    <span className="text-xs text-slate-400">+{p.modules.length - 8}</span>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {nbActifs}/{p.modules.length} modules actifs
                </div>
              </div>
              <div className="flex items-center gap-2 border-t px-4 py-3">
                <button
                  onClick={() => openEdit(p)}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-indigo-700 font-medium"
                >
                  <Pencil size={14} /> Éditer
                </button>
                <button
                  onClick={() => duplicate(p)}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
                >
                  <Copy size={14} /> Dupliquer
                </button>
                <button
                  onClick={() => setConfirmDelete(p)}
                  className="ml-auto inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {draft && (
        <ProduitEditor
          draft={draft}
          isNew={isNew}
          onChange={setDraft}
          onCancel={() => setDraft(null)}
          onSave={() => {
            const cle =
              draft.cle.trim() ||
              draft.nom.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_") ||
              `PRODUIT_${Date.now()}`;
            upsertProduit({ ...draft, cle });
            setDraft(null);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title={`Supprimer « ${confirmDelete.nom} » ?`}
          message="Le produit sera retiré du catalogue. Les licences existantes ne sont pas affectées."
          onConfirm={() => {
            deleteProduit(confirmDelete.cle);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ── Éditeur de produit (modale) ──────────────────────────────────────────────
function ProduitEditor({
  draft,
  isNew,
  onChange,
  onCancel,
  onSave,
}: {
  draft: ProduitDef;
  isNew: boolean;
  onChange: (p: ProduitDef) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const set = (patch: Partial<ProduitDef>) => onChange({ ...draft, ...patch });
  const Icon = iconOf(draft.icone);

  const setModule = (i: number, patch: Partial<ModuleProduit>) =>
    set({ modules: draft.modules.map((m, idx) => (idx === i ? { ...m, ...patch } : m)) });
  const addModule = () =>
    set({
      modules: [
        ...draft.modules,
        { cle: `module-${draft.modules.length + 1}`, nom: "Nouveau module", actif: true },
      ],
    });
  const removeModule = (i: number) => set({ modules: draft.modules.filter((_, idx) => idx !== i) });

  return (
    <div className="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-bold text-slate-900">
            {isNew ? "Nouveau produit" : `Éditer — ${draft.nom}`}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-auto">
          {/* Identité */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom">
              <input
                value={draft.nom}
                onChange={(e) => set({ nom: e.target.value })}
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex. Green Éclairage"
              />
            </Field>
            <Field label="Clé (identifiant)">
              <input
                value={draft.cle}
                onChange={(e) => set({ cle: e.target.value.toUpperCase() })}
                disabled={!isNew}
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="Auto depuis le nom"
              />
            </Field>
          </div>
          <Field label="Description">
            <input
              value={draft.description}
              onChange={(e) => set({ description: e.target.value })}
              className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Courte description du produit"
            />
          </Field>

          {/* Icône + couleurs */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Icône">
              <div className="flex flex-wrap gap-1.5">
                {ICON_NAMES.map((name) => {
                  const I = iconOf(name);
                  const active = draft.icone === name;
                  return (
                    <button
                      key={name}
                      onClick={() => set({ icone: name })}
                      className={`p-2 rounded-lg border ${active ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                      title={name}
                    >
                      <I size={18} />
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Couleur (accent)">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {ACCENTS.map((a) => {
                    const active = draft.accentFrom === a.from && draft.accentTo === a.to;
                    return (
                      <button
                        key={a.label}
                        onClick={() => set({ accentFrom: a.from, accentTo: a.to })}
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${a.from} ${a.to} ${active ? "ring-2 ring-offset-1 ring-indigo-500" : ""}`}
                        title={a.label}
                      />
                    );
                  })}
                </div>
                <div className={`h-12 rounded-lg bg-gradient-to-br ${draft.accentFrom} ${draft.accentTo} flex items-center gap-2 px-3 text-white`}>
                  <Icon size={18} />
                  <span className="text-sm font-semibold">{draft.nom || "Aperçu"}</span>
                </div>
              </div>
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.actif}
              onChange={(e) => set({ actif: e.target.checked })}
              className="rounded"
            />
            Produit actif (disponible à l'attribution)
          </label>

          {/* Modules */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-800">Modules</span>
              <button
                onClick={addModule}
                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
              >
                <Plus size={14} /> Ajouter un module
              </button>
            </div>
            <div className="space-y-1.5">
              {draft.modules.length === 0 && (
                <p className="text-sm text-slate-400">
                  Aucun module. Ajoutez-en pour composer le produit.
                </p>
              )}
              {draft.modules.map((m, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-2 py-1.5">
                  <GripVertical size={14} className="text-slate-300 shrink-0" />
                  <input
                    value={m.nom}
                    onChange={(e) => setModule(i, { nom: e.target.value })}
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  <button
                    onClick={() => setModule(i, { actif: !m.actif })}
                    className={`text-xs rounded-full px-2 py-0.5 ${m.actif ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}
                  >
                    {m.actif ? "Actif" : "Inactif"}
                  </button>
                  <button onClick={() => removeModule(i)} className="text-slate-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-slate-50">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={!draft.nom.trim()}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Check size={16} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-500 mb-1">{label}</span>
      {children}
    </label>
  );
}

function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9998] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-2">{message}</p>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
