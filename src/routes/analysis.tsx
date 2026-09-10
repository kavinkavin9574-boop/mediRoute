import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  BrainCircuit,
  Clock,
  Hospital,
  Loader2,
  MapPin,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { loadCase, priorityOf, type EmergencyCase } from "@/lib/emergency";
import { PriorityBadge } from "@/components/priority-badge";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "AI Emergency Analysis — MediRoute AI" },
      {
        name: "description",
        content:
          "Simulated AI classification of the entered emergency: priority level, required facility, specialist and matching factors.",
      },
      { property: "og:title", content: "AI Emergency Analysis — MediRoute AI" },
      {
        property: "og:description",
        content: "See how MediRoute AI classifies an emergency request before hospital matching.",
      },
    ],
  }),
  component: AnalysisPage,
});

const factors = [
  { icon: Hospital, label: "Facility requirement", text: "Does the hospital list the facility?" },
  { icon: Stethoscope, label: "Specialist availability", text: "Is the specialist on call now?" },
  { icon: BedDouble, label: "Bed availability", text: "Free beds in the required unit." },
  { icon: MapPin, label: "Distance", text: "Road distance from the patient location." },
  { icon: Clock, label: "Estimated travel time", text: "Typical drive time at this hour." },
  { icon: ShieldAlert, label: "Emergency capability", text: "24x7 emergency and trauma readiness." },
];

function AnalysisPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<EmergencyCase | null>(null);

  useEffect(() => {
    setData(loadCase());
    const t = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(t);
  }, []);

  if (data === null && ready) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">No emergency details found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Start an emergency search to generate an analysis.
          </p>
          <Button asChild variant="emergency" className="mt-6">
            <Link to="/search">Start Emergency Search</Link>
          </Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        {!ready || !data ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-24 text-center shadow-soft">
            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-lift">
              <BrainCircuit className="h-8 w-8 text-primary-foreground" />
            </span>
            <p className="mt-6 flex items-center gap-2 text-lg font-semibold">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              AI is analyzing emergency requirements…
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Classifying the request and preparing hospital matching factors.
            </p>
          </div>
        ) : (
          <div className="animate-rise space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Emergency Assessment</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                MediRoute AI classifies the information you entered for hospital matching. It does
                not diagnose diseases or provide medical advice.
              </p>
            </div>

            <section className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Emergency Type" value={data.emergencyType} />
              <Stat label="Required Specialist" value={data.specialist} />
              <Stat label="Required Facility" value={data.facility} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Priority
                </p>
                <div className="mt-2">
                  <PriorityBadge severity={data.severity} />
                </div>
              </div>
            </section>

            {data.symptoms ? (
              <section className="rounded-2xl border border-border bg-secondary/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Reported information
                </p>
                <p className="mt-2 text-sm">{data.symptoms}</p>
              </section>
            ) : null}

            <section>
              <h2 className="text-xl font-bold tracking-tight">AI Matching Factors</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {factors.map((f) => (
                  <div
                    key={f.label}
                    className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-semibold">{f.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Priority {priorityOf(data.severity)} · matching against 9 simulated hospitals.
              </p>
              <Button
                size="lg"
                variant="emergency"
                onClick={() => navigate({ to: "/results" })}
              >
                Find Suitable Hospitals
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-semibold">{value || "—"}</p>
    </div>
  );
}
