import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const faqs = [
  {
    q: "How do I get started with the Nexalo API?",
    a: "Sign up for a free account, get your Account SID and Auth Token from the API Keys page, and follow the quickstart guide in the documentation.",
  },
  {
    q: "What programming languages are supported?",
    a: "We provide official SDKs for Node.js, Python, Ruby, PHP, Java, C#, and Go. You can also use any HTTP client with our REST API.",
  },
  {
    q: "How is billing calculated?",
    a: "Billing is per-use. SMS: $0.0075/msg, Voice: $0.013/min, Email: $0.001/email. Credits are deducted in real-time from your balance.",
  },
  {
    q: "What is the delivery rate for SMS?",
    a: "We maintain 99.9% delivery rates globally through carrier-grade routing with automatic failover across multiple providers.",
  },
  {
    q: "Can I use virtual numbers for 2FA/OTP?",
    a: "Yes! Our Verify API is purpose-built for 2FA. It handles code generation, delivery via SMS/Voice/Email, and verification with one API call.",
  },
  {
    q: "How do I port an existing number to Nexalo?",
    a: "Contact our support team with your number and current provider. Porting typically takes 5-10 business days and is free for most regions.",
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request submitted! We'll respond within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-8" data-ocid="support.page">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: BookOpen,
            title: "Documentation",
            desc: "Comprehensive API guides and references",
            cta: "Browse Docs",
            ocid: "support.docs.button",
          },
          {
            icon: MessageSquare,
            title: "Community",
            desc: "Ask questions in our developer community",
            cta: "Join Community",
            ocid: "support.community.button",
          },
          {
            icon: Mail,
            title: "Email Support",
            desc: "Direct support from our team",
            cta: "support@nexalo.io",
            ocid: "support.email.button",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card-surface p-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
              <Button size="sm" variant="outline" data-ocid={item.ocid}>
                {item.cta}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-surface p-6">
          <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3" data-ocid="support.faq.list">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="border border-border rounded-lg overflow-hidden"
                data-ocid={`support.faq.item.${i + 1}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-ocid={`support.faq.toggle.${i + 1}`}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/30 transition-colors text-left"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp
                      size={16}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h3 className="font-semibold mb-4">Contact Support</h3>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-ocid="support.contact.form"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="support-name"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Name
                </label>
                <Input
                  id="support-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  data-ocid="support.name.input"
                />
              </div>
              <div>
                <label
                  htmlFor="support-email"
                  className="text-xs text-muted-foreground block mb-1"
                >
                  Email
                </label>
                <Input
                  id="support-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  data-ocid="support.email.input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="support-subject"
                className="text-xs text-muted-foreground block mb-1"
              >
                Subject
              </label>
              <Input
                id="support-subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="How can we help?"
                data-ocid="support.subject.input"
              />
            </div>
            <div>
              <label
                htmlFor="support-message"
                className="text-xs text-muted-foreground block mb-1"
              >
                Message
              </label>
              <Textarea
                id="support-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={5}
                data-ocid="support.message.textarea"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
              data-ocid="support.contact.submit_button"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
