import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Ambulance,
  BedDouble,
  BrainCircuit,
  Clock,
  FileText,
  Hospital,
  MapPin,
  ShieldAlert,
  Stethoscope,
  ArrowRight,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediRoute AI — Hospital Bed & Emergency Coordinator" },
      {
        name: "description",
        content:
          "MediRoute AI matches emergencies to suitable hospitals using facility needs, simulated bed availability, specialists and travel time.",
      },
      { property: "og:title", content: "MediRoute AI — Find the right emergency care, faster" },
      {
        property: "og:description",
        content:
          "Prototype emergency coordination dashboard: hospital matching, bed availability, specialist finder and referral summaries.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Hospital,
    title: "Smart Hospital Matching",
    text: "Ranks demo hospitals against the facility, specialist and urgency you entered.",
  },
  {
    icon: BedDouble,
    title: "Bed Availability",
    text: "Simulated ICU, general and emergency bed counts for every hospital in the network.",
  },
  {
    icon: Stethoscope,
    title: "Specialist Finder",
    text: "Check which on-call specialists each hospital lists before you move the patient.",
  },
  {
    icon: Clock,
    title: "Travel-Time Estimation",
    text: "Distance and estimated road time so minutes are part of the decision.",
  },
  {
    icon: ShieldAlert,
    title: "Emergency Priority",
    text: "Severity is converted into a clear priority level that drives ranking weight.",
  },
  {
    icon: FileText,
    title: "AI Referral Summary",
    text: "A copy-ready handover summary of the case and the recommended hospital.",
  },
];

const workflow = [
  { icon: FileText, label: "Patient Details" },
  { icon: BrainCircuit, label: "AI Analysis" },
  { icon: Hospital, label: "Hospital Matching" },
  { icon: ListOrdered, label: "Hospital Ranking" },
  { icon: Ambulance, label: "Referral Summary" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="bg-gradient-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="animate-rise mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Simulated hospital network · Demo prototype
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                <span className="text-gradient-primary">AI-Powered</span> Hospital &amp; Emergency
                Coordinator
              </h1>
              <p className="mt-5 text-base text-muted-foreground md:text-lg">
                Find suitable hospitals based on emergency requirements, facility availability,
                specialist availability and estimated travel time.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" variant="emergency">
                  <Link to="/search">
                    <Ambulance className="h-5 w-5" />
                    Start Emergency Search
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/search" search={{ demo: true }}>
                    View Demo
                  </Link>
                </Button>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                This prototype is for demonstration purposes and does not replace professional
                medical advice or emergency services.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            Built for fast, informed decisions
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
            Six coordination capabilities working from one emergency intake form.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
              How MediRoute AI works
            </h2>
            <ol className="mt-10 grid gap-4 md:grid-cols-5">
              {workflow.map((step, i) => (
                <li
                  key={step.label}
                  className="relative flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:flex-col md:text-center"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold">{step.label}</span>
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-muted-foreground md:block">
                    {i < workflow.length - 1 ? <ArrowRight className="h-4 w-4" /> : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to coordinate a case?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Enter patient and emergency details to see ranked hospital matches from the demo
            network.
          </p>
          <Button asChild size="lg" variant="emergency" className="mt-7">
            <Link to="/search">
              Start Emergency Search
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
