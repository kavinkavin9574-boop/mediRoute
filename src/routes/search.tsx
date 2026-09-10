import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, ArrowRight, ClipboardList, Loader2, LocateFixed, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import {
  EMERGENCY_TYPES,
  FACILITIES,
  SEVERITIES,
  SPECIALISTS,
  demoCase,
  emptyCase,
  saveCase,
  type EmergencyCase,
  type Severity,
} from "@/lib/emergency";
import { getCurrentLocation } from "@/lib/geolocation";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { demo?: boolean } =>
    search["demo"] === true || search["demo"] === "true" ? { demo: true } : {},
  head: () => ({
    meta: [
      { title: "Emergency Search — MediRoute AI" },
      {
        name: "description",
        content:
          "Enter patient and emergency details to match against simulated hospital facilities, beds and specialists.",
      },
      { property: "og:title", content: "Emergency Search — MediRoute AI" },
      {
        property: "og:description",
        content: "Capture patient, emergency, facility and specialist requirements in one form.",
      },
    ],
  }),
  component: SearchPage,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Picker({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Select {...(value ? { value } : {})} onValueChange={onChange}>
      <SelectTrigger className="h-10 rounded-xl">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SearchPage() {
  const { demo } = Route.useSearch();
  const navigate = useNavigate();
  const [form, setForm] = useState<EmergencyCase>(demo ? demoCase : emptyCase);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const set = (k: keyof EmergencyCase) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }) as EmergencyCase);

  async function useCurrentLocation() {
    setLocating(true);
    setLocationError("");
    try {
      const { lat, lng, label } = await getCurrentLocation();
      setForm((f) => ({ ...f, location: label, lat, lng }));
    } catch (err) {
      setLocationError(err instanceof Error ? err.message : "Couldn't get your location.");
    } finally {
      setLocating(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.emergencyType || !form.facility || !form.specialist) {
      setError("Select emergency type, required facility and required specialist to continue.");
      return;
    }
    setError("");
    saveCase(form);
    navigate({ to: "/analysis" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="animate-rise">
          <h1 className="text-3xl font-extrabold tracking-tight">Emergency Search</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Provide patient and emergency details. MediRoute AI classifies the request and matches
            it against the simulated hospital network — it does not diagnose conditions.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-primary" /> Patient Information
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Patient name">
                <Input
                  className="h-10 rounded-xl"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Age">
                <Input
                  className="h-10 rounded-xl"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={(e) => set("age")(e.target.value)}
                  placeholder="Years"
                />
              </Field>
              <Field label="Gender">
                <Picker
                  value={form.gender}
                  onChange={set("gender")}
                  options={["Male", "Female", "Other"]}
                  placeholder="Select gender"
                />
              </Field>
              <Field label="Contact number">
                <Input
                  className="h-10 rounded-xl"
                  value={form.contact}
                  onChange={(e) => set("contact")(e.target.value)}
                  placeholder="Phone number"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Current location">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      className="h-10 rounded-xl"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          location: e.target.value,
                          lat: undefined,
                          lng: undefined,
                        }))
                      }
                      placeholder="Area, city or landmark"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 shrink-0 rounded-xl"
                      onClick={useCurrentLocation}
                      disabled={locating}
                    >
                      {locating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LocateFixed className="h-4 w-4" />
                      )}
                      {locating ? "Locating…" : "Use my current location"}
                    </Button>
                  </div>
                  {form.lat !== undefined && form.lng !== undefined ? (
                    <p className="text-xs text-success">
                      Location captured — hospital distances will use your live position.
                    </p>
                  ) : null}
                  {locationError ? (
                    <p className="text-xs text-destructive">{locationError}</p>
                  ) : null}
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ClipboardList className="h-5 w-5 text-primary" /> Emergency Information
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Emergency type">
                <Picker
                  value={form.emergencyType}
                  onChange={set("emergencyType")}
                  options={EMERGENCY_TYPES}
                  placeholder="Select emergency type"
                />
              </Field>
              <Field label="Severity">
                <Picker
                  value={form.severity}
                  onChange={(v) => set("severity")(v as Severity)}
                  options={SEVERITIES}
                  placeholder="Select severity"
                />
              </Field>
              <Field label="Required facility">
                <Picker
                  value={form.facility}
                  onChange={set("facility")}
                  options={FACILITIES}
                  placeholder="Select facility"
                />
              </Field>
              <Field label="Required specialist">
                <Picker
                  value={form.specialist}
                  onChange={set("specialist")}
                  options={SPECIALISTS}
                  placeholder="Select specialist"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Symptoms / additional information">
                  <Textarea
                    className="min-h-28 rounded-xl"
                    value={form.symptoms}
                    onChange={(e) => set("symptoms")(e.target.value)}
                    placeholder="Describe what is happening, when it started and any known conditions."
                  />
                </Field>
              </div>
            </div>
          </section>

          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Demo data only — not a substitute for emergency services.
            </p>
            <Button type="submit" size="lg" variant="emergency">
              <Activity className="h-5 w-5" />
              Analyze Emergency
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
