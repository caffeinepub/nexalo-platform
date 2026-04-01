import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

void Shield;

const features = [
  {
    icon: MessageSquare,
    title: "SMS API",
    desc: "Send and receive SMS globally with 99.9% delivery rates across 190+ countries.",
    code: `const nexalo = new Nexalo(accountSID, authToken);
await nexalo.sms.send({
  to: "+1234567890",
  from: "+0987654321",
  body: "Hello from Nexalo!"
});`,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Phone,
    title: "Voice API",
    desc: "Crystal-clear voice calls with programmable IVR, recording, and transcription.",
    code: `await nexalo.voice.call({
  to: "+1234567890",
  from: "+0987654321",
  url: "https://app.nexalo.io/twiml"
});`,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Mail,
    title: "Email API",
    desc: "Transactional and marketing emails with analytics, templates, and deliverability.",
    code: `await nexalo.email.send({
  to: "user@example.com",
  subject: "Welcome!",
  html: "<h1>Hello World</h1>"
});`,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp API",
    desc: "Reach 2B+ users on WhatsApp with rich media, templates, and chatbot support.",
    code: `await nexalo.whatsapp.send({
  to: "+1234567890",
  type: "template",
  template: { name: "welcome" }
});`,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    desc: "Perfect for developers and small projects.",
    features: [
      "1,000 free SMS/month",
      "500 Voice minutes",
      "5,000 Emails/month",
      "1 Phone number",
      "Community support",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
    desc: "Scale your communications with more volume.",
    features: [
      "50,000 SMS/month",
      "10,000 Voice minutes",
      "100,000 Emails/month",
      "10 Phone numbers",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large-scale deployments with SLA.",
    features: [
      "Unlimited volume",
      "Dedicated infrastructure",
      "Custom SLA & uptime",
      "Unlimited numbers",
      "24/7 dedicated support",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

const trustBrands = [
  "Slack",
  "Stripe",
  "Shopify",
  "Notion",
  "Linear",
  "Vercel",
  "Supabase",
];

export default function Landing() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) navigate({ to: "/dashboard" });
  }, [identity, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/assets/generated/nexalo-icon-transparent.dim_80x80.png"
              alt="Nexalo"
              className="w-7 h-7"
            />
            <span className="font-bold text-lg tracking-tight">Nexalo</span>
          </div>
          <nav className="hidden lg:flex items-center gap-5 text-sm text-muted-foreground flex-1">
            {[
              "Products",
              "SMS",
              "Voice",
              "WhatsApp",
              "Developers",
              "Pricing",
              "Support",
            ].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="landing.login.button"
              className="text-sm"
            >
              Log In
            </Button>
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="landing.signup.button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            >
              {isLoggingIn ? "Connecting..." : "Sign Up Free"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs text-primary font-medium mb-8">
            <Zap size={12} />
            Now with 190+ country coverage — launch globally in minutes
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            The Future of
            <br />
            <span className="text-primary">Communication APIs.</span>
            <br />
            Scalable. Powerful. Flexible.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Build SMS, Voice, Email, and WhatsApp into your apps with one
            unified API. Developer-first, production-ready, globally
            distributed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="landing.hero_cta.button"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-semibold"
            >
              {isLoggingIn ? "Connecting..." : "Get Started Free"}
              <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              data-ocid="landing.docs_cta.button"
              className="border-border bg-secondary/50 hover:bg-secondary text-foreground px-8 h-12 text-base"
            >
              Explore Docs
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Trust Band */}
      <section
        id="products"
        className="py-12 px-6 border-y border-border bg-card/30"
      >
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8">
            Trusted by developers at
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {trustBrands.map((brand) => (
              <span
                key={brand}
                className="text-muted-foreground/50 font-semibold text-lg tracking-tight hover:text-muted-foreground transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="sms" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Developers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every API designed with developer experience first. Get from zero
              to production in under 10 minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card-surface p-5 flex flex-col gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${f.bg} ${f.color} flex items-center justify-center`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                  <pre className="text-xs font-mono bg-background/80 rounded-md p-3 border border-border text-green-400 overflow-x-auto whitespace-pre-wrap">
                    {f.code}
                  </pre>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-card/20 border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "190+", label: "Countries" },
            { val: "99.9%", label: "Uptime SLA" },
            { val: "50M+", label: "Messages/Day" },
            { val: "<100ms", label: "API Latency" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-primary">{s.val}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                data-ocid={`pricing.${tier.name.toLowerCase()}.card`}
                className={`card-surface p-7 flex flex-col gap-5 relative ${
                  tier.highlight ? "border-primary/50 shadow-glow" : ""
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{tier.name}</h3>
                  <div className="flex items-end gap-1 mt-2">
                    <span className="text-4xl font-extrabold">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground mb-1">
                      {tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {tier.desc}
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        size={14}
                        className="text-primary flex-shrink-0"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid={`pricing.${tier.name.toLowerCase()}.button`}
                  className={
                    tier.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                      : "w-full border border-border bg-secondary/50 text-foreground hover:bg-secondary"
                  }
                  variant={tier.highlight ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6 bg-primary/5 border-y border-primary/20">
        <div className="max-w-2xl mx-auto text-center">
          <Globe size={40} className="text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to build the future?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers already building with Nexalo.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="landing.footer_cta.button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-12 text-base font-semibold"
          >
            {isLoggingIn ? "Connecting..." : "Get Started Free"}
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/generated/nexalo-icon-transparent.dim_80x80.png"
                  alt="Nexalo"
                  className="w-6 h-6"
                />
                <span className="font-bold">Nexalo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Communication APIs for modern developers.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: [
                  "SMS API",
                  "Voice API",
                  "Email API",
                  "WhatsApp API",
                  "Verify API",
                ],
              },
              {
                title: "Site Map",
                links: [
                  "Dashboard",
                  "Analytics",
                  "Billing",
                  "Phone Numbers",
                  "Logs",
                ],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press", "Legal"],
              },
              {
                title: "Resources",
                links: [
                  "Documentation",
                  "API Reference",
                  "Status",
                  "Community",
                  "Support",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Nexalo. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
