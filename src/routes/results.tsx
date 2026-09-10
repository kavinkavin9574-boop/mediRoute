import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Check,
  ClipboardCopy,
  Clock,
  FileText,
  Hospital,
  MapPin,
  Siren,
  Star,
  Stethoscope,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { PriorityBadge } from "@/components/priority-badge";
import {
  buildReferral,
  demoCase,
  loadCase,
  rankHospitals,
  type EmergencyCase,
  type ScoredHospital,
} from "@/lib/emergency";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Matched Hospitals — MediRoute AI" },
      {
        name: "description",
        content:
          "Ranked demo hospitals with simulated bed availability, specialists, distance and estimated travel time.",
      },
      { property: "og:title", content: "Matched Hospitals — MediRoute AI" },
      {
        property: "og:description",
        content: "Compare hospital matches and generate an AI referral summary for handover.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const [data, setData] = useState<EmergencyCase | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setData(loadCase() ?? demoCase);
  }, []);

  const ranked = useMemo(() => (data ? rankHospitals(data) : []), [data]);
  const chosen = ranked.find((h) => h.id === selected) ?? ranked[0];

  if (!data || !chosen) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-24 text-center text-sm text-muted-foreground">
          Loading matched hospitals…
        </main>
        <SiteFooter />
      </div>
    );
  }

  const referral = buildReferral(data, chosen);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Matched Hospitals</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {ranked.length} simulated hospitals ranked for {data.emergencyType.toLowerCase()} ·{" "}
              {data.facility} · {data.specialist}
              {data.location ? ` · from ${data.location}` : ""}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PriorityBadge severity={data.severity} />
            <Button asChild variant="soft" size="sm">
              <Link to="/search">New search</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {ranked.map((h, i) => (
              <HospitalCard
                key={h.id}
                h={h}
                rank={i + 1}
                active={h.id === chosen.id}
                onSelect={() => {
                  setSelected(h.id);
                  setCopied(false);
                }}
              />
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-primary" /> AI Referral Summary
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Handover note for {chosen.name}. Select any hospital card to regenerate.
              </p>
              <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-secondary/50 p-4 text-[11px] leading-relaxed text-foreground">
                {referral}
              </pre>
              <Button
                className="mt-4 w-full"
                variant="emergency"
                onClick={() => {
                  navigator.clipboard?.writeText(referral);
                  setCopied(true);
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
                {copied ? "Copied to clipboard" : "Copy referral summary"}
              </Button>
              <p className="mt-3 text-[11px] text-muted-foreground">
                This prototype is for demonstration purposes and does not replace professional
                medical advice or emergency services.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Chip({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium " +
        (ok
          ? "border-success/30 bg-success/10 text-success"
          : "border-border bg-muted text-muted-foreground")
      }
    >
      {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

function HospitalCard({
  h,
  rank,
  active,
  onSelect,
}: {
  h: ScoredHospital;
  rank: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        "w-full rounded-2xl border bg-card p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift " +
        (active ? "border-primary ring-2 ring-primary/25" : "border-border")
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-sm font-bold text-primary-foreground">
            #{rank}
          </span>
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Hospital className="h-4 w-4 text-primary" />
              {h.name}
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {h.area} · {h.distanceKm} km away{h.liveDistance ? " (live)" : ""}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Est. travel {h.travelMin} min
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {h.rating.toFixed(1)}
              </span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-primary">{h.score}%</p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Match score</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <BedStat label="ICU" value={h.icuBeds} />
        <BedStat label="General" value={h.generalBeds} />
        <BedStat label="Emergency" value={h.emergencyBeds} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip ok={h.hasFacility}>
          <BedDouble className="hidden" />
          Required facility
        </Chip>
        <Chip ok={h.hasSpecialist}>
          <Stethoscope className="hidden" />
          Required specialist
        </Chip>
        <Chip ok={h.bedsForFacility > 0}>{h.bedsForFacility} bed(s) free</Chip>
        <Chip ok={h.hasEmergencyDept}>
          <Siren className="hidden" />
          Emergency Dept
        </Chip>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Specialists:</span>{" "}
        {h.specialists.join(", ")}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Facilities:</span> {h.facilities.join(", ")}
      </p>
    </button>
  );
}

function BedStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-3 py-2">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label} beds</p>
    </div>
  );
}
