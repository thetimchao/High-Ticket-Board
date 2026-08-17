// Parses data/noreply-raw.txt (title|monthlyOTE|revenue|age) into data/noreply-jobs.js
// Re-run with: node scripts/parse-noreply.js  (after updating the raw file)
const fs = require("fs");
const path = require("path");

const raw = fs.readFileSync(
  path.join(__dirname, "../data/noreply-raw.txt"),
  "utf8"
);

const ROLE_MAP = {
  closers: "Closer",
  setters: "Phone Setter",
  "dm setters": "DM Setter",
  "full-cycle reps": "Full-Cycle Rep",
  managers: "Sales Manager",
  csms: "CSM",
};

// First matching rule wins. [regex, niche, subNiche]
const NICHE_RULES = [
  [/holistic/i, "Health & Wellness", "Holistic Health"],
  [/peptide|supplement/i, "Health & Wellness", "Supplements & Peptides"],
  [/testosterone|men's health|bloodwork|health optimization/i, "Health & Wellness", "Men's Health / TRT"],
  [/women's (weight|fitness|functional|health)|weight loss|menopausal/i, "Health & Wellness", "Women's Health & Weight Loss"],
  [/telehealth|medspa|med spa|cryo|skincare|aesthetic/i, "Health & Wellness", "Med Spas / Aesthetics"],
  [/insurance|medicare/i, "Financial Services", "Medicare & Insurance"],
  [/scoliosis|dental|ophthalmology|nemt|healthcare|health care|health system|health products|rehab/i, "Health & Wellness", "Clinics & Medical"],
  [/b2b.*health/i, "B2B & SaaS", "B2B SaaS"],
  [/fitness|athlete|baseball|football|pitching|mobility|looksmaxx|body sculpt|martial arts|gym/i, "Coaching & Consulting", "Fitness & Health Coaching"],
  [/health/i, "Health & Wellness", "Clinics & Medical"],
  [/dating|relationship|marriage|social lives|emotional healing|parenting|family/i, "Coaching & Consulting", "Dating & Relationship Coaching"],
  [/insurance/i, "Financial Services", "Medicare & Insurance"],
  [/credit/i, "Financial Services", "Business Funding / Credit"],
  [/biz acquisition|business acquisition|m&a|buy-side|business investment|biz funding|funding/i, "Financial Services", "Business Funding / Credit"],
  [/tax/i, "Financial Services", "Tax & Wealth Strategy"],
  [/trading|futures|options|stock|crypto|forex|algo|invest|gemalgo|atm|prediction market/i, "Info Products & Education", "Trading & Investing Education"],
  [/financ|wealth|cfo|payroll|veterans benefits|private equity|finance/i, "Financial Services", "Financial Planning & Education"],
  [/airbnb|air bnb|\bstr\b|rental|cohost/i, "Info Products & Education", "Airbnb / STR Education"],
  [/wholesal|real estate|\bre\b|realtors|property|acquisitions|luxury wholesale/i, "Info Products & Education", "Real Estate Investing Education"],
  [/reselling|arbitrage|ebay|vending|emoney|flipping/i, "Info Products & Education", "Reselling & Arbitrage"],
  [/amazon|fba|ecom|e-com|dropship|clothing brand|shopify|bicycle|dtc/i, "Info Products & Education", "E-commerce Education"],
  [/tiktok|affiliate/i, "Info Products & Education", "TikTok Shop & Affiliate"],
  [/ugc|creator|yt automation|youtube|clipping|publishing|podcast|faceless|street interview|voice acting|music|jazz|media|content|personal brand|book/i, "Info Products & Education", "Creator Economy (UGC / YT / Content)"],
  [/hts|high ticket sales|high ticket closing|sales coaching|sales training|appointment setting coaching|pitch|public speaking|speaking/i, "Info Products & Education", "Sales Training Programs"],
  [/career|placement|job search|interview|recruit|visa|team placement/i, "Info Products & Education", "Career & Job Placement"],
  [/language|tutoring|act\/sat|admissions|english|chinese|education|enrolment|enrollment|medical education/i, "Coaching & Consulting", "Language & Education Coaching"],
  [/solar|roof|remodel|water filtration|home improvement|hvac|electrician|contractor|kitchen|home service|car detailing|barbershop|nightlife/i, "Home Services", "HVAC / Home Improvement"],
  [/ai automation|ai agency|agentic|ai implementation|ai infra|automation|ai automation agency/i, "Agency Services", "AI Automation Agency"],
  [/dfy|meta ads|leadgen|lead gen|smma|paid advertising|ads|advertis|ppc|pay-per-lead/i, "Agency Services", "DFY LeadGen / Meta Ads"],
  [/local seo|seo/i, "Agency Services", "SEO / AI SaaS Agency"],
  [/marketing|agency|outreach|appointment setting|client acquisition|branding|testimonial|review management|upsell|call center|webinar|funnel|gtm|oaas|social proof/i, "Agency Services", "Marketing / Ads Agency"],
  [/saas|software|tech|platform|crm|data engineering|cyber|coding|fleet|imessage|b2b|scheduling|website builder|operating system|digital products|start-up|startup/i, "B2B & SaaS", "AI & Software"],
  [/mindset|discipline|men's|muslim men|men /i, "Coaching & Consulting", "Life / Mindset Coaching"],
  [/women/i, "Coaching & Consulting", "Business Coaching"],
  [/biz|business|coaching|mentorship|consult|mastermind|entrepreneur|coach scaling|high-touch|high ticket/i, "Coaching & Consulting", "Business Coaching"],
];

function mapNiche(title) {
  for (const [re, niche, sub] of NICHE_RULES) {
    if (re.test(title)) return [niche, sub];
  }
  return ["Other", "Miscellaneous"];
}

function parseAge(tok) {
  if (!tok) return { days: 999, note: "Recently posted" };
  const m = tok.match(/^(\d+)(h|d|mo)$/);
  if (!m) return { days: 999, note: "Recently posted" };
  const n = Number(m[1]);
  if (m[2] === "h") return { days: 0, note: `Posted ~${n}h ago` };
  if (m[2] === "d") return { days: n, note: `Posted ~${n} day${n === 1 ? "" : "s"} ago` };
  return { days: n * 30, note: `Posted ~${n} month${n === 1 ? "" : "s"} ago` };
}

const fmtMo = (n) => `$${n.toLocaleString("en-US")}/mo`;

const jobs = [];
raw.split("\n").forEach((line, i) => {
  line = line.trim();
  if (!line) return;
  const [title, oteStr, revenue, age] = line.split("|");
  const rolesPart = title.split(" for ")[0].toLowerCase();
  const roleTypes = rolesPart
    .split("&")
    .map((s) => ROLE_MAP[s.trim()])
    .filter(Boolean);
  if (!roleTypes.length) roleTypes.push("Closer");
  const offerPart = title.includes(" for ")
    ? title.slice(title.indexOf(" for ") + 5)
    : title;
  const [niche, subNiche] = mapNiche(offerPart);
  const oteMo = oteStr ? Number(oteStr) : 0;
  const { days, note } = parseAge(age);
  const tags = [];
  if (revenue) tags.push(`Doing ${revenue} revenue`);
  if (oteMo >= 20000) tags.push("Top 5% OTE");
  if (days <= 3) tags.push("New");

  const roleWord = roleTypes.join(" / ");
  jobs.push({
    id: `nrj-${i + 1}`,
    title,
    company: "Confidential — via NoReplyJobs",
    roleTypes,
    niche,
    subNiche,
    oteMin: oteMo * 12,
    oteMax: oteMo * 12,
    oteDisplay: oteMo ? fmtMo(oteMo) : null,
    oteLabel: oteMo ? "posted OTE / mo" : null,
    payStructure: null,
    commission: null,
    pricePoint: null,
    leadFlow: null,
    location: "Remote",
    remote: true,
    experience: null,
    description: `${roleWord} seat on a high-ticket ${offerPart.replace(/ Offer$/, "")} offer${revenue ? `, currently doing ${revenue} in revenue` : ""}. Listed on the NoReplyJobs board — open the listing there for full offer details, commission structure, and to apply.`,
    requirements: [],
    tags,
    applyUrl: "https://noreplyjobs.com/jobs",
    source: "NoReplyJobs",
    postedNote: note,
    postedDaysAgo: days,
  });
});

const out = `// AUTO-GENERATED from data/noreply-raw.txt by scripts/parse-noreply.js
// Do not edit by hand — edit the raw file and re-run the script.
export const NOREPLY_JOBS = ${JSON.stringify(jobs, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, "../data/noreply-jobs.js"), out);
console.log(`Wrote ${jobs.length} jobs`);

// Niche distribution sanity check
const dist = {};
jobs.forEach((j) => {
  dist[`${j.niche} > ${j.subNiche}`] = (dist[`${j.niche} > ${j.subNiche}`] || 0) + 1;
});
console.log(Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v}\t${k}`).join("\n"));
