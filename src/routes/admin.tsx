import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Hospital as HospitalIcon,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import {
  FACILITIES,
  SPECIALISTS,
  getHospitals,
  hasCustomHospitals,
  resetHospitals,
  saveHospitals,
  type Hospital,
} from "@/lib/emergency";
import { isAdminAuthed, loginAdmin, logoutAdmin } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — MediRoute AI" },
      {
        name: "description",
        content: "Edit the simulated hospital network: beds, specialists, facilities and location.",
      },
    ],
  }),
  component: AdminPage,
});

function emptyHospital(): Hospital {
  return {
    id: `hospital-${Date.now()}`,
    name: "",
    area: "",
    address: "",
    phone: "",
    distanceKm: 5,
    travelMin: 15,
    icuBeds: 0,
    generalBeds: 0,
    emergencyBeds: 0,
    hasEmergencyDept: true,
    specialists: [],
    facilities: [],
    rating: 4.0,
    trauma: false,
    lat: undefined,
    lng: undefined,
  };
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthed());
    setChecked(true);
  }, []);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {authed ? (
        <AdminDashboard onLogout={() => setAuthed(false)} />
      ) : (
        <AdminLogin onLogin={() => setAuthed(true)} />
      )}
      <SiteFooter />
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setError("");
      onLogin();
    } else {
      setError("Incorrect passcode. Try again.");
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-lift">
        <Lock className="h-7 w-7 text-primary-foreground" />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Admin Access</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the admin passcode to edit hospital details for the demo network.
      </p>
      <form onSubmit={submit} className="mt-8 w-full space-y-4 text-left">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Passcode
          </Label>
          <Input
            type="password"
            className="h-10 rounded-xl"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter admin passcode"
            autoFocus
          />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" variant="emergency" className="w-full">
          <ShieldCheck className="h-4 w-4" />
          Sign in
        </Button>
      </form>
      <p className="mt-6 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
        Demo passcode: <code className="font-mono font-semibold">admin123</code>. This prototype has
        no backend, so this login is a client-side demo gate only — don't reuse this pattern for
        real credentials.
      </p>
    </main>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Hospital | null>(null);
  const [customized, setCustomized] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setHospitals(getHospitals());
    setCustomized(hasCustomHospitals());
  }, []);

  const totalBeds = useMemo(
    () => hospitals.reduce((sum, h) => sum + h.icuBeds + h.generalBeds + h.emergencyBeds, 0),
    [hospitals],
  );

  function persist(next: Hospital[]) {
    setHospitals(next);
    saveHospitals(next);
    setCustomized(true);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  }

  function openEdit(h: Hospital) {
    setEditing({ ...h });
    setIsNew(false);
  }

  function openNew() {
    setEditing(emptyHospital());
    setIsNew(true);
  }

  function handleSave(h: Hospital) {
    if (isNew) {
      persist([...hospitals, h]);
    } else {
      persist(hospitals.map((x) => (x.id === h.id ? h : x)));
    }
    setEditing(null);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    persist(hospitals.filter((x) => x.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleReset() {
    resetHospitals();
    setHospitals(getHospitals());
    setCustomized(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Admin dashboard
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Hospital Details</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Edit beds, specialists, facilities and coordinates for the {hospitals.length} hospitals
            in the simulated network. Changes are saved to this browser and used immediately by
            search and matching.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!customized}
            title={customized ? "Restore built-in demo data" : "Already using default data"}
          >
            <RotateCcw className="h-4 w-4" />
            Reset to defaults
          </Button>
          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              logoutAdmin();
              onLogout();
            }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={HospitalIcon} label="Hospitals" value={String(hospitals.length)} />
        <StatCard icon={BedDouble} label="Total beds (all types)" value={String(totalBeds)} />
        <StatCard
          icon={Star}
          label="Avg. rating"
          value={
            hospitals.length
              ? (hospitals.reduce((s, h) => s + h.rating, 0) / hospitals.length).toFixed(1)
              : "—"
          }
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {customized ? "Showing your saved edits." : "Showing built-in demo data."}
          {savedFlash ? <span className="ml-2 font-semibold text-success">Saved ✓</span> : null}
        </p>
        <Button size="sm" variant="emergency" onClick={openNew}>
          <Plus className="h-4 w-4" />
          Add hospital
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead className="hidden md:table-cell">Area</TableHead>
              <TableHead className="text-center">ICU</TableHead>
              <TableHead className="text-center">General</TableHead>
              <TableHead className="text-center">Emergency</TableHead>
              <TableHead className="hidden text-center sm:table-cell">Rating</TableHead>
              <TableHead className="hidden text-center lg:table-cell">Live location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospitals.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">
                  {h.name || <span className="text-muted-foreground">Untitled hospital</span>}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {h.area}
                </TableCell>
                <TableCell className="text-center">{h.icuBeds}</TableCell>
                <TableCell className="text-center">{h.generalBeds}</TableCell>
                <TableCell className="text-center">{h.emergencyBeds}</TableCell>
                <TableCell className="hidden text-center sm:table-cell">
                  {h.rating.toFixed(1)}
                </TableCell>
                <TableCell className="hidden text-center lg:table-cell">
                  {typeof h.lat === "number" && typeof h.lng === "number" ? (
                    <span className="text-success">Set</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(h)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(h)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {hospitals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                  No hospitals yet. Add one to get started.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      {editing ? (
        <HospitalDialog
          hospital={editing}
          isNew={isNew}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      ) : null}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleteTarget?.name || "this hospital"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes it from the simulated network used for matching. You can add it back
              manually, or use "Reset to defaults" to restore the original demo data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HospitalIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Input
        type="number"
        className="h-10 rounded-xl"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        step={step}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </div>
  );
}

function HospitalDialog({
  hospital,
  isNew,
  onCancel,
  onSave,
}: {
  hospital: Hospital;
  isNew: boolean;
  onCancel: () => void;
  onSave: (h: Hospital) => void;
}) {
  const [form, setForm] = useState<Hospital>(hospital);
  const [formError, setFormError] = useState("");

  function toggleFromList(list: string[], value: string) {
    return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.area.trim()) {
      setFormError("Hospital name and area are required.");
      return;
    }
    setFormError("");
    onSave(form);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Add hospital" : `Edit ${hospital.name || "hospital"}`}
          </DialogTitle>
          <DialogDescription>
            Update the details used for hospital matching, bed availability and live distance
            calculation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Hospital name
              </Label>
              <Input
                className="h-10 rounded-xl"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. CityCare Medical Center"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Area
              </Label>
              <Input
                className="h-10 rounded-xl"
                value={form.area}
                onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                placeholder="e.g. Anna Nagar"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Phone
              </Label>
              <Input
                className="h-10 rounded-xl"
                value={form.phone ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91 ..."
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Address
              </Label>
              <Input
                className="h-10 rounded-xl"
                value={form.address ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Full address"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              label="ICU beds"
              value={form.icuBeds}
              onChange={(v) => setForm((f) => ({ ...f, icuBeds: v }))}
            />
            <NumberField
              label="General beds"
              value={form.generalBeds}
              onChange={(v) => setForm((f) => ({ ...f, generalBeds: v }))}
            />
            <NumberField
              label="Emergency beds"
              value={form.emergencyBeds}
              onChange={(v) => setForm((f) => ({ ...f, emergencyBeds: v }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField
              label="Fallback distance (km)"
              value={form.distanceKm}
              onChange={(v) => setForm((f) => ({ ...f, distanceKm: v }))}
              step={0.1}
            />
            <NumberField
              label="Fallback travel (min)"
              value={form.travelMin}
              onChange={(v) => setForm((f) => ({ ...f, travelMin: v }))}
            />
            <NumberField
              label="Rating (0-5)"
              value={form.rating}
              onChange={(v) => setForm((f) => ({ ...f, rating: Math.min(5, Math.max(0, v)) }))}
              step={0.1}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Latitude (optional, for live distance)"
              value={form.lat ?? Number.NaN}
              onChange={(v) => setForm((f) => ({ ...f, lat: Number.isFinite(v) ? v : undefined }))}
              step={0.0001}
            />
            <NumberField
              label="Longitude (optional, for live distance)"
              value={form.lng ?? Number.NaN}
              onChange={(v) => setForm((f) => ({ ...f, lng: Number.isFinite(v) ? v : undefined }))}
              step={0.0001}
            />
          </div>
          <p className="-mt-3 text-xs text-muted-foreground">
            When latitude and longitude are set here, and a patient uses "Use my current location"
            on the search page, distance and travel time are calculated live instead of using the
            fallback numbers above.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.hasEmergencyDept}
                onCheckedChange={(v) => setForm((f) => ({ ...f, hasEmergencyDept: v }))}
              />
              <Label className="text-sm">24x7 Emergency Department</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.trauma}
                onCheckedChange={(v) => setForm((f) => ({ ...f, trauma: v }))}
              />
              <Label className="text-sm">Trauma-ready</Label>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Facilities
            </Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {FACILITIES.map((facility) => (
                <label key={facility} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.facilities.includes(facility)}
                    onCheckedChange={() =>
                      setForm((f) => ({ ...f, facilities: toggleFromList(f.facilities, facility) }))
                    }
                  />
                  {facility}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Specialists on call
            </Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {SPECIALISTS.map((specialist) => (
                <label key={specialist} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.specialists.includes(specialist)}
                    onCheckedChange={() =>
                      setForm((f) => ({
                        ...f,
                        specialists: toggleFromList(f.specialists, specialist),
                      }))
                    }
                  />
                  {specialist}
                </label>
              ))}
            </div>
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="emergency">
              <Save className="h-4 w-4" />
              {isNew ? "Add hospital" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
