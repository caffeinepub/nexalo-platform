import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DocSection = {
  id: string;
  label: string;
  endpoint: string;
  method: string;
  desc: string;
  examples: Record<string, string>;
};

const docSections: DocSection[] = [
  {
    id: "sms",
    label: "SMS",
    endpoint: "/v1/sms/send",
    method: "POST",
    desc: "Send an SMS message to any phone number worldwide.",
    examples: {
      curl: `curl -X POST https://api.nexalo.io/v1/sms/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "from": "+0987654321",
    "body": "Hello from Nexalo!"
  }'`,
      nodejs: `const Nexalo = require('@nexalo/node');
const client = new Nexalo(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const message = await client.sms.send({
  to: '+1234567890',
  from: '+0987654321',
  body: 'Hello from Nexalo!'
});
console.log('Message SID:', message.sid);`,
      python: `import nexalo

client = nexalo.Client(account_sid, auth_token)

message = client.sms.send(
    to="+1234567890",
    from_="+0987654321",
    body="Hello from Nexalo!"
)
print(f"Message SID: {message.sid}")`,
    },
  },
  {
    id: "voice",
    label: "Voice",
    endpoint: "/v1/voice/call",
    method: "POST",
    desc: "Initiate a voice call with programmable call flows.",
    examples: {
      curl: `curl -X POST https://api.nexalo.io/v1/voice/call \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "to": "+1234567890",
    "from": "+0987654321",
    "url": "https://yourapp.com/twiml"
  }'`,
      nodejs: `const call = await client.voice.call({
  to: '+1234567890',
  from: '+0987654321',
  url: 'https://yourapp.com/twiml'
});
console.log('Call SID:', call.sid);`,
      python: `call = client.voice.call(
    to="+1234567890",
    from_="+0987654321",
    url="https://yourapp.com/twiml"
)
print(f"Call SID: {call.sid}")`,
    },
  },
  {
    id: "email",
    label: "Email",
    endpoint: "/v1/email/send",
    method: "POST",
    desc: "Send transactional or marketing emails with rich templates.",
    examples: {
      curl: `curl -X POST https://api.nexalo.io/v1/email/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "to": "user@example.com",
    "from": "noreply@yourapp.com",
    "subject": "Welcome!",
    "html": "<h1>Hello!</h1>"
  }'`,
      nodejs: `await client.email.send({
  to: 'user@example.com',
  from: 'noreply@yourapp.com',
  subject: 'Welcome!',
  html: '<h1>Hello!</h1>'
});`,
      python: `client.email.send(
    to="user@example.com",
    from_="noreply@yourapp.com",
    subject="Welcome!",
    html="<h1>Hello!</h1>"
)`,
    },
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    endpoint: "/v1/whatsapp/send",
    method: "POST",
    desc: "Send WhatsApp messages including templates and rich media.",
    examples: {
      curl: `curl -X POST https://api.nexalo.io/v1/whatsapp/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "to": "whatsapp:+1234567890",
    "from": "whatsapp:+0987654321",
    "body": "Hello via WhatsApp!"
  }'`,
      nodejs: `await client.whatsapp.send({
  to: 'whatsapp:+1234567890',
  from: 'whatsapp:+0987654321',
  body: 'Hello via WhatsApp!'
});`,
      python: `client.whatsapp.send(
    to="whatsapp:+1234567890",
    from_="whatsapp:+0987654321",
    body="Hello via WhatsApp!"
)`,
    },
  },
  {
    id: "verify",
    label: "Verify",
    endpoint: "/v1/verify/send",
    method: "POST",
    desc: "Send OTP verification codes via SMS, Voice, or Email.",
    examples: {
      curl: `curl -X POST https://api.nexalo.io/v1/verify/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "to": "+1234567890",
    "channel": "sms"
  }'

# Verify the code:
curl -X POST https://api.nexalo.io/v1/verify/check \\
  -d '{"to": "+1234567890", "code": "123456"}'`,
      nodejs: `// Send OTP
await client.verify.send({
  to: '+1234567890',
  channel: 'sms'
});

// Check OTP
const result = await client.verify.check({
  to: '+1234567890',
  code: '123456'
});
console.log(result.status); // 'approved'`,
      python: `# Send OTP
client.verify.send(to="+1234567890", channel="sms")

# Check OTP
result = client.verify.check(
    to="+1234567890",
    code="123456"
)
print(result.status)  # 'approved'`,
    },
  },
];

const langLabels: Record<string, string> = {
  curl: "cURL",
  nodejs: "Node.js",
  python: "Python",
};

export default function ApiDocs() {
  const [activeSection, setActiveSection] = useState("sms");
  const section =
    docSections.find((s) => s.id === activeSection) ?? docSections[0];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <div className="flex gap-6 h-full" data-ocid="docs.page">
      <aside className="w-48 flex-shrink-0">
        <div className="card-surface p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">
            APIs
          </p>
          <nav className="space-y-1">
            {docSections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                data-ocid={`docs.${s.id}.link`}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="card-surface p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded">
                {section.method}
              </span>
              <code className="text-sm font-mono text-muted-foreground">
                {section.endpoint}
              </code>
            </div>
            <h2 className="text-xl font-bold">{section.label} API</h2>
            <p className="text-muted-foreground mt-1">{section.desc}</p>
          </div>

          <Tabs defaultValue="curl" className="w-full">
            <TabsList className="mb-4 bg-background/60">
              {Object.keys(section.examples).map((lang) => (
                <TabsTrigger
                  key={lang}
                  value={lang}
                  data-ocid={`docs.${lang}.tab`}
                >
                  {langLabels[lang] || lang}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(section.examples).map(([lang, code]) => (
              <TabsContent key={lang} value={lang}>
                <div className="relative">
                  <pre className="bg-background border border-border rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto whitespace-pre">
                    {code}
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyCode(code)}
                    data-ocid="docs.copy.button"
                    className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  >
                    <Copy size={13} />
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6">
            <h4 className="font-semibold text-sm mb-3">Example Response</h4>
            <pre className="bg-background border border-border rounded-lg p-4 text-xs font-mono text-blue-400 overflow-x-auto">{`{
  "sid": "SM1234567890abcdef",
  "status": "queued",
  "to": "+1234567890",
  "from": "+0987654321",
  "created_at": "2026-04-01T10:00:00Z",
  "price": "-0.0075",
  "price_unit": "USD"
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
