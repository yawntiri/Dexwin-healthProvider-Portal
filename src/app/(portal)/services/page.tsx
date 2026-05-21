"use client";

import { useState, useMemo } from "react";
import { mockServices, currentUser } from "@/lib/mock-data";
import { formatGHS, cn } from "@/lib/utils";
import type { Service, ServiceCategory, ServiceStatus } from "@/lib/types";
import {
  Search, Plus, Upload, Edit2, Power, PowerOff, X, Check,
  ChevronDown, Grid3X3, AlertCircle, Download, Filter,
  Package, Loader2, FileSpreadsheet
} from "lucide-react";

const CATEGORIES: ServiceCategory[] = ["Consultation", "Pharmacy", "Diagnostic", "Procedure", "Emergency"];

const categoryColors: Record<ServiceCategory, string> = {
  Consultation: "bg-blue-100 text-blue-700",
  Pharmacy: "bg-violet-100 text-violet-700",
  Diagnostic: "bg-teal-100 text-teal-700",
  Procedure: "bg-orange-100 text-orange-700",
  Emergency: "bg-red-100 text-red-700",
};

const canManage = currentUser.role === "Owner" || currentUser.role === "Manager";

interface ServiceFormData {
  code: string;
  name: string;
  category: ServiceCategory;
  defaultPrice: string;
  description: string;
}

function ServiceModal({
  open,
  onClose,
  editService,
}: {
  open: boolean;
  onClose: () => void;
  editService?: Service;
}) {
  const [form, setForm] = useState<ServiceFormData>({
    code: editService?.code ?? "",
    name: editService?.name ?? "",
    category: editService?.category ?? "Consultation",
    defaultPrice: editService?.defaultPrice?.toString() ?? "",
    description: editService?.description ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ServiceFormData>>({});

  if (!open) return null;

  const validate = () => {
    const e: Partial<ServiceFormData> = {};
    if (!form.code.trim()) e.code = "Service code is required";
    if (!form.name.trim()) e.name = "Service name is required";
    if (!form.defaultPrice || isNaN(parseFloat(form.defaultPrice)) || parseFloat(form.defaultPrice) <= 0)
      e.defaultPrice = "Enter a valid price";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    onClose();
  };

  const field = (key: keyof ServiceFormData) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{editService ? "Edit Service" : "Add Service"}</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Code <span className="text-red-500">*</span></label>
              <input
                {...field("code")}
                placeholder="e.g. CONS-001"
                className={cn("w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono", errors.code ? "border-red-300" : "border-slate-200")}
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select
                {...field("category")}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Name <span className="text-red-500">*</span></label>
            <input
              {...field("name")}
              placeholder="e.g. General Consultation"
              className={cn("w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500", errors.name ? "border-red-300" : "border-slate-200")}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Default Price (GH₵) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">GH₵</span>
              <input
                type="number"
                {...field("defaultPrice")}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={cn("w-full pl-12 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 tabular-nums", errors.defaultPrice ? "border-red-300" : "border-slate-200")}
              />
            </div>
            {errors.defaultPrice && <p className="text-xs text-red-500 mt-1">{errors.defaultPrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              {...field("description")}
              placeholder="Brief description of this service…"
              rows={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>
          {editService && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <span className="font-semibold">Note:</span> Editing this service will not retroactively change historical bills. The change will be logged in the Audit Trail.
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            {saving ? "Saving…" : editService ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | "">("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | undefined>();
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const filtered = useMemo(() => {
    return services.filter(s => {
      if (categoryFilter && s.category !== categoryFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
      }
      return true;
    });
  }, [services, search, categoryFilter, statusFilter]);

  const activeCount = services.filter(s => s.status === "Active").length;
  const inactiveCount = services.filter(s => s.status === "Inactive").length;

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
  };

  const handleEdit = (service: Service) => {
    setEditService(service);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditService(undefined);
    setModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Services Catalog</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {activeCount} active · {inactiveCount} inactive
            {!canManage && <span className="ml-2 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">View only</span>}
          </p>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkUpload(v => !v)}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm"
            >
              <Upload size={15} /> Bulk Upload
            </button>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
            >
              <Plus size={15} /> Add Service
            </button>
          </div>
        )}
      </div>

      {/* Bulk upload */}
      {showBulkUpload && canManage && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bulk Upload Services</h3>
              <p className="text-xs text-slate-500 mt-0.5">Upload a CSV file with service details. The system will validate row-by-row before committing.</p>
            </div>
            <button onClick={() => setShowBulkUpload(false)} className="p-1 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <FileSpreadsheet size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Drop CSV file here</p>
              <p className="text-xs text-slate-400 mt-0.5">or click to browse</p>
            </div>
            <div className="flex flex-col gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                <Download size={14} /> Download Template
              </button>
              <p className="text-xs text-slate-500 max-w-[160px]">Template includes: code, name, category, price, description</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const count = services.filter(s => s.category === cat && s.status === "Active").length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat === categoryFilter ? "" : cat)}
              className={cn(
                "bg-white rounded-xl border p-3 text-left transition-all hover:shadow-sm",
                categoryFilter === cat ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200"
              )}
            >
              <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full", categoryColors[cat])}>{cat}</span>
              <div className="text-xl font-bold text-slate-900 mt-2">{count}</div>
              <div className="text-xs text-slate-500">active</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or code…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as ServiceCategory | "")}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none min-w-[160px]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ServiceStatus | "")}
          className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none min-w-[130px]"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Services table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Grid3X3 size={22} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No services found</h3>
            <p className="text-sm text-slate-500">{canManage ? "Add your first service to get started." : "No services match your search."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50/50">
                <tr>
                  {["Code", "Service Name", "Category", "Default Price", "Status", ...(canManage ? ["Actions"] : [])].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(svc => (
                  <tr key={svc.id} className={cn("transition-colors", svc.status === "Inactive" && "opacity-60", "hover:bg-slate-50/60")}>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{svc.code}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm font-semibold text-slate-800">{svc.name}</div>
                      {svc.description && <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{svc.description}</div>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", categoryColors[svc.category])}>{svc.category}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900 tabular-nums">{formatGHS(svc.defaultPrice)}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold", svc.status === "Active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500")}>
                        {svc.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(svc)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => toggleStatus(svc.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              svc.status === "Active"
                                ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            )}
                            title={svc.status === "Active" ? "Deactivate" : "Activate"}
                          >
                            {svc.status === "Active" ? <PowerOff size={14} /> : <Power size={14} />}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <ServiceModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditService(undefined); }}
        editService={editService}
      />
    </div>
  );
}
