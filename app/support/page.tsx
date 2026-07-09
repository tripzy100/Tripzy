import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, HelpCircle, ExternalLink } from "lucide-react";

const supportOptions = [
  {
    icon: MessageCircle,
    label: "Live Chat",
    description: "Chat with our support team instantly",
    action: "Start Chat",
    href: "https://wa.me/919234273063",
  },
  {
    icon: Phone,
    label: "Call Us",
    description: "Speak directly to a representative",
    action: "+91 92342 73063",
    href: "tel:+919234273063",
  },
  {
    icon: Mail,
    label: "Email Support",
    description: "Get a response within 4 hours",
    action: "tripzy100@gmail.com",
    href: "mailto:tripzy100@gmail.com",
  },
  {
    icon: HelpCircle,
    label: "FAQs",
    description: "Find answers to common questions",
    action: "View FAQs",
    href: "/#faqs",
  },
];

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-2 font-display text-3xl font-bold tracking-tight">Get Support</h1>
        <p className="mb-10 max-w-lg text-sm text-muted-foreground">
          We are here to help. Choose the option that works best for you.
        </p>
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          {supportOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.label}
                className="rounded-xl border border-border bg-card/40 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{opt.label}</h3>
                </div>
                <p className="mb-4 text-xs text-muted-foreground">{opt.description}</p>
                <a
                  href={opt.href}
                  target={opt.href.startsWith("http") ? "_blank" : undefined}
                  rel={opt.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <Button variant="outline" size="sm">
                    {opt.action}{" "}
                    {opt.href.startsWith("http") && <ExternalLink className="ml-1.5 h-3 w-3" />}
                  </Button>
                </a>
              </div>
            );
          })}
        </div>
        <div className="mt-12 max-w-3xl rounded-xl border border-border bg-card/30 p-6">
          <h3 className="mb-2 font-display font-semibold text-foreground">Self-Serve Resources</h3>
          <p className="mb-4 text-xs text-muted-foreground">
            Manage your bookings, check KYC status, or view your wallet from the dashboard.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button variant="default" size="sm">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm">
                My Bookings
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="ghost" size="sm">
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
