// =====================================================================
// Mock data — Phase 1. Clearly DEMO data. No real sources are claimed.
// Scenario: "Lone Star Legacy Insurance" — a Texas life insurance agency
// prospecting small-business owners for key-person, buy-sell, loan
// protection, owner life, and executive coverage.
// =====================================================================
import type { Lead, Project, ScoreBreakdown } from "./types";
import { labelForScore, scoreFromBreakdown } from "./scoring";

export const DEMO_ORG_ID = "org_demo";

// ---------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------
export const PROJECTS: Project[] = [
  {
    id: "proj_lonestar",
    orgId: DEMO_ORG_ID,
    name: "Austin SMB Owners — Key Person & Buy-Sell",
    status: "Ready",
    createdAt: "2026-05-28T15:12:00.000Z",
    updatedAt: "2026-06-11T18:40:00.000Z",
    business: {
      businessName: "Lone Star Legacy Insurance",
      website: "https://lonestarlegacy.example.com",
      industry: "Life & business insurance",
      location: "Austin, TX",
    },
    target: {
      description:
        "Owner-operated small businesses with real enterprise value, key employees, or partner structures that would be exposed if an owner or key person died or became disabled.",
      idealIndustries: [
        "Specialty trades & contractors",
        "Professional services",
        "Manufacturing & fabrication",
        "Multi-location retail & hospitality",
      ],
      companySize: "8–75 employees",
      geography: "Greater Austin & Central Texas (I-35 corridor)",
    },
    signals: {
      idealSignals: [
        "2+ owners / partnership structure (buy-sell exposure)",
        "Named key employee or specialized operator",
        "Recent SBA or commercial loan (loan-protection need)",
        "5+ years in business with steady headcount",
        "Family-held or succession language on site",
      ],
      badFitSignals: [
        "Solo gig with no employees or assets",
        "National franchise w/ corporate benefits",
        "Pre-revenue startup",
        "Already lists an in-house CFO / benefits team",
      ],
      services: [
        "Key person insurance",
        "Buy-sell funding",
        "Loan protection (SBA / commercial)",
        "Owner & executive life",
        "Disability & continuation planning",
      ],
    },
    report: {
      reportName: "Central Texas SMB Prospecting Report — Q2",
      goal: "Identify 10 high-fit owner-led businesses to approach for key-person and buy-sell coverage this quarter.",
      leadsDesired: 10,
    },
  },
  {
    id: "proj_houston",
    orgId: DEMO_ORG_ID,
    name: "Houston Medical & Dental Practices",
    status: "Researching",
    createdAt: "2026-06-06T14:00:00.000Z",
    updatedAt: "2026-06-12T16:20:00.000Z",
    business: {
      businessName: "Lone Star Legacy Insurance",
      website: "https://lonestarlegacy.example.com",
      industry: "Life & business insurance",
      location: "Austin, TX",
    },
    target: {
      description:
        "Independent medical, dental, and veterinary practices with partner ownership and high earner key staff.",
      idealIndustries: ["Dental practices", "Medical practices", "Veterinary clinics"],
      companySize: "5–40 employees",
      geography: "Greater Houston",
    },
    signals: {
      idealSignals: ["Multi-partner practice", "Recent build-out loan", "Associate buy-in path"],
      badFitSignals: ["Hospital-employed", "Single solo provider near retirement"],
      services: ["Buy-sell funding", "Key person insurance", "Disability planning"],
    },
    report: {
      reportName: "Houston Practice Owners — Buy-In Protection",
      goal: "Surface partner-owned practices with buy-in or build-out exposure.",
      leadsDesired: 12,
    },
  },
];

// ---------------------------------------------------------------------
// Lead authoring helper — keeps each entry compact and consistent.
// Score is DERIVED from the breakdown so the math always ties out.
// ---------------------------------------------------------------------
type RawLead = Omit<
  Lead,
  "id" | "projectId" | "score" | "scoreLabel" | "status" | "notes"
> & {
  breakdown: ScoreBreakdown;
};

function buildLead(projectId: string, index: number, raw: RawLead): Lead {
  const score = scoreFromBreakdown(raw.breakdown);
  return {
    ...raw,
    id: `lead_${projectId}_${String(index + 1).padStart(2, "0")}`,
    projectId,
    score,
    scoreLabel: labelForScore(score),
    // Default review state — overridden once the user interacts (persisted).
    status: raw.includedInReport ? "Approved" : "Open",
    notes: "",
  };
}

const LONESTAR_RAW: RawLead[] = [
  {
    company: "Hill Country Custom Millwork",
    website: "https://hccmillwork.example.com",
    publicProfileUrl: "https://maps.example.com/place/hcc-millwork",
    location: "11402 Ranch Rd 620, Austin, TX 78726",
    city: "Austin",
    state: "TX",
    industry: "Architectural millwork & cabinetry",
    phone: "(512) 555-0182",
    email: "owners@hccmillwork.example.com",
    breakdown: { icpFit: 24, needSignal: 23, verification: 18, decisionMaker: 10, outreachQuality: 14, contactability: 5, riskPenalty: 0 },
    whyItFits:
      "Two-partner shop with 31 employees and a master craftsman whose departure would stall production. Classic key-person plus buy-sell profile.",
    needReason:
      "Equal partnership with a single irreplaceable lead fabricator and a recent equipment expansion — significant continuity exposure.",
    decisionMaker: "Confirmed owner/principal",
    decisionMakerName: "Dale & Marcus Whitfield (co-owners)",
    businessAge: "Established (5+ yrs)",
    verification: "Verified",
    evidence: [
      { label: "Ownership", detail: "Two named co-owners listed on the company About page.", confidence: "Confirmed", sourceUrl: "https://hccmillwork.example.com/about", sourceLabel: "Company site — About (demo)" },
      { label: "Headcount", detail: "31 employees per public profile band (25–50).", confidence: "Estimated", sourceUrl: "https://maps.example.com/place/hcc-millwork", sourceLabel: "Business profile (demo)" },
      { label: "Expansion", detail: "Press mention of a 2025 CNC line expansion implies new debt.", confidence: "Inferred", sourceUrl: "https://news.example.com/atx-millwork-expands", sourceLabel: "Local press (demo)" },
    ],
    outreach: {
      hook: "Open on protecting the partnership and the lead fabricator after the CNC expansion.",
      rationale: "A two-owner shop with one irreplaceable operator and fresh equipment debt feels the gap immediately when it's named plainly.",
    },
    riskNotes: "Confirm whether existing buy-sell paperwork is funded; some shops have agreements without funding.",
    includedInReport: true,
  },
  {
    company: "Ridgeline Mechanical Services",
    website: "https://ridgelinemech.example.com",
    publicProfileUrl: "https://maps.example.com/place/ridgeline-mech",
    location: "905 E Braker Ln, Austin, TX 78753",
    city: "Austin",
    state: "TX",
    industry: "Commercial HVAC & mechanical contracting",
    phone: "(512) 555-0143",
    email: "info@ridgelinemech.example.com",
    breakdown: { icpFit: 24, needSignal: 24, verification: 16, decisionMaker: 9, outreachQuality: 14, contactability: 5, riskPenalty: 0 },
    whyItFits:
      "Family-held mechanical contractor, 48 employees, recent SBA 7(a) loan referenced in a bank press release — strong loan-protection and succession fit.",
    needReason:
      "Active SBA loan plus a son-of-founder succession path creates both loan-protection and buy-sell demand.",
    decisionMaker: "Confirmed owner/principal",
    decisionMakerName: "Robert Almanza (founder)",
    businessAge: "Established (5+ yrs)",
    verification: "Verified",
    evidence: [
      { label: "Loan", detail: "Named in a 2025 SBA 7(a) lender announcement.", confidence: "Confirmed", sourceUrl: "https://news.example.com/sba-ridgeline", sourceLabel: "Lender release (demo)" },
      { label: "Succession", detail: "Site bio references founder's son as operations lead.", confidence: "Estimated", sourceUrl: "https://ridgelinemech.example.com/team", sourceLabel: "Company site — Team (demo)" },
    ],
    outreach: {
      hook: "Lead with SBA loan protection — most owners personally guarantee and haven't covered it.",
      rationale: "A named, recent loan is the most concrete need a life agent can open on.",
    },
    riskNotes: "Verify loan is still outstanding; confirm personal guarantee structure before pricing.",
    includedInReport: true,
  },
  {
    company: "Barton Springs Dental Group",
    website: "https://bsdentalgroup.example.com",
    publicProfileUrl: "https://maps.example.com/place/barton-springs-dental",
    location: "1500 S Lamar Blvd, Austin, TX 78704",
    city: "Austin",
    state: "TX",
    industry: "Multi-partner dental practice",
    phone: "(512) 555-0117",
    email: null,
    breakdown: { icpFit: 23, needSignal: 22, verification: 17, decisionMaker: 8, outreachQuality: 13, contactability: 4, riskPenalty: 0 },
    whyItFits:
      "Three-dentist partnership with an associate buy-in path — textbook buy-sell funding and key-person need.",
    needReason:
      "Partner practice with an advertised associate-to-partner track; buy-in events require funded agreements.",
    decisionMaker: "Likely decision maker",
    decisionMakerName: "Dr. Priya Nair (managing partner)",
    businessAge: "Established (5+ yrs)",
    verification: "Estimated",
    evidence: [
      { label: "Partners", detail: "Three named dentists with 'partner' titles on the team page.", confidence: "Confirmed", sourceUrl: "https://bsdentalgroup.example.com/team", sourceLabel: "Company site — Team (demo)" },
      { label: "Buy-in path", detail: "Careers page mentions partnership track for associates.", confidence: "Inferred", sourceUrl: "https://bsdentalgroup.example.com/careers", sourceLabel: "Company site — Careers (demo)" },
    ],
    outreach: {
      hook: "Frame around funding the next associate buy-in cleanly without draining the practice.",
      rationale: "Managing partners think about buy-ins constantly; tying coverage to a known event lands.",
    },
    riskNotes: "No public email; outreach must route through the practice line or managing partner.",
    includedInReport: true,
  },
  {
    company: "Travis Steel Fabricators",
    website: "https://travissteel.example.com",
    publicProfileUrl: "https://maps.example.com/place/travis-steel",
    location: "7300 Cameron Rd, Austin, TX 78752",
    city: "Austin",
    state: "TX",
    industry: "Structural steel fabrication",
    phone: "(512) 555-0190",
    email: "shop@travissteel.example.com",
    breakdown: { icpFit: 22, needSignal: 21, verification: 15, decisionMaker: 9, outreachQuality: 13, contactability: 5, riskPenalty: 0 },
    whyItFits:
      "Owner-operated fabricator, 40+ staff, large project backlog implying commercial debt and a single point of failure at the top.",
    needReason:
      "Heavy equipment and project bonding suggest leverage; one owner controls bidding relationships.",
    decisionMaker: "Confirmed owner/principal",
    decisionMakerName: "Eduardo 'Eddie' Salas (owner)",
    businessAge: "Established (5+ yrs)",
    verification: "Estimated",
    evidence: [
      { label: "Owner", detail: "Single owner named across site and profile.", confidence: "Confirmed", sourceUrl: "https://travissteel.example.com/about", sourceLabel: "Company site — About (demo)" },
      { label: "Backlog", detail: "Projects page lists multiple active commercial builds.", confidence: "Estimated", sourceUrl: "https://travissteel.example.com/projects", sourceLabel: "Company site — Projects (demo)" },
    ],
    outreach: {
      hook: "Owner-dependent bidding relationships — what happens to the backlog if Eddie is out 6 months?",
      rationale: "Single-owner shops underrate how much enterprise value walks out with the founder.",
    },
    riskNotes: "Confirm whether a second family member already shares signing authority.",
    includedInReport: true,
  },
  {
    company: "Lakeway Premier Veterinary",
    website: "https://lakewayvet.example.com",
    publicProfileUrl: "https://maps.example.com/place/lakeway-vet",
    location: "2105 Lohmans Crossing Rd, Lakeway, TX 78734",
    city: "Lakeway",
    state: "TX",
    industry: "Veterinary clinic",
    phone: "(512) 555-0165",
    email: "frontdesk@lakewayvet.example.com",
    breakdown: { icpFit: 20, needSignal: 19, verification: 14, decisionMaker: 8, outreachQuality: 12, contactability: 4, riskPenalty: 0 },
    whyItFits:
      "Two-veterinarian practice that recently completed a build-out; partner structure plus new facility debt.",
    needReason:
      "New facility build-out implies a construction loan; two owning vets create buy-sell exposure.",
    decisionMaker: "Likely decision maker",
    decisionMakerName: "Dr. Hannah Okafor",
    businessAge: "Growing (2–5 yrs)",
    verification: "Estimated",
    evidence: [
      { label: "Owners", detail: "Two owning veterinarians listed.", confidence: "Confirmed", sourceUrl: "https://lakewayvet.example.com/about", sourceLabel: "Company site — About (demo)" },
      { label: "Build-out", detail: "Blog post about a 2025 facility expansion.", confidence: "Inferred", sourceUrl: "https://lakewayvet.example.com/blog/new-space", sourceLabel: "Company blog (demo)" },
    ],
    outreach: {
      hook: "New building, two owners — protect the loan and each other before it grows.",
      rationale: "Recent build-out makes the loan-protection conversation timely and concrete.",
    },
    riskNotes: "Younger practice; confirm revenue can support meaningful coverage.",
    includedInReport: true,
  },
  {
    company: "Capital City Print & Signage",
    website: "https://capcityprint.example.com",
    publicProfileUrl: "https://maps.example.com/place/capcity-print",
    location: "3400 Comsouth Dr, Austin, TX 78744",
    city: "Austin",
    state: "TX",
    industry: "Commercial printing & signage",
    phone: "(512) 555-0129",
    email: "hello@capcityprint.example.com",
    breakdown: { icpFit: 18, needSignal: 18, verification: 13, decisionMaker: 7, outreachQuality: 11, contactability: 5, riskPenalty: -2 },
    whyItFits:
      "Established owner-led shop with ~18 staff; moderate enterprise value and a long-tenured operations manager worth insuring.",
    needReason:
      "Owner plus one key operations manager who effectively runs production day-to-day.",
    decisionMaker: "Likely decision maker",
    decisionMakerName: "Janelle Carter (owner)",
    businessAge: "Established (5+ yrs)",
    verification: "Inferred",
    evidence: [
      { label: "Owner", detail: "Owner named in a chamber-of-commerce listing.", confidence: "Estimated", sourceUrl: "https://chamber.example.com/members/capcity", sourceLabel: "Chamber listing (demo)" },
      { label: "Key staff", detail: "LinkedIn-style profile suggests a long-tenured ops manager.", confidence: "Inferred", sourceUrl: "https://profiles.example.com/in/capcity-ops", sourceLabel: "Public profile (demo)" },
    ],
    outreach: {
      hook: "Insure the operations manager who quietly runs the floor.",
      rationale: "Owners often overlook the non-owner who is genuinely irreplaceable.",
    },
    riskNotes: "Print is a softening industry — confirm revenue stability before investing time.",
    includedInReport: true,
  },
  {
    company: "Onion Creek Landscape Co.",
    website: "https://onioncreeklandscape.example.com",
    publicProfileUrl: "https://maps.example.com/place/onion-creek-landscape",
    location: "9600 S IH-35, Austin, TX 78748",
    city: "Austin",
    state: "TX",
    industry: "Commercial landscaping",
    phone: "(512) 555-0151",
    email: "office@onioncreeklandscape.example.com",
    breakdown: { icpFit: 17, needSignal: 16, verification: 12, decisionMaker: 7, outreachQuality: 11, contactability: 4, riskPenalty: -3 },
    whyItFits:
      "Seasonal commercial landscaper with crews and equipment financing; owner-dependent client relationships.",
    needReason:
      "Equipment financing and owner-held municipal contracts create continuity and loan exposure.",
    decisionMaker: "Gatekeeper / unclear",
    decisionMakerName: null,
    businessAge: "Growing (2–5 yrs)",
    verification: "Inferred",
    evidence: [
      { label: "Equipment", detail: "Fleet imagery suggests financed equipment.", confidence: "Inferred", sourceUrl: "https://onioncreeklandscape.example.com/fleet", sourceLabel: "Company site (demo)" },
      { label: "Contracts", detail: "References municipal contracts on services page.", confidence: "Estimated", sourceUrl: "https://onioncreeklandscape.example.com/commercial", sourceLabel: "Company site (demo)" },
    ],
    outreach: {
      hook: "Owner-held contracts and financed equipment — what protects the crew's paychecks?",
      rationale: "Tying coverage to payroll continuity resonates with crew-based owners.",
    },
    riskNotes: "Seasonal cash flow and unclear decision maker; qualify reachability first.",
    includedInReport: true,
  },
  {
    company: "Pflugerville Family Pharmacy",
    website: "https://pvillepharmacy.example.com",
    publicProfileUrl: "https://maps.example.com/place/pville-pharmacy",
    location: "1535 Pecan St, Pflugerville, TX 78660",
    city: "Pflugerville",
    state: "TX",
    industry: "Independent pharmacy",
    phone: "(512) 555-0173",
    email: null,
    breakdown: { icpFit: 16, needSignal: 15, verification: 11, decisionMaker: 6, outreachQuality: 10, contactability: 3, riskPenalty: -4 },
    whyItFits:
      "Independent pharmacy with a single pharmacist-owner; meaningful key-person concentration but thin public data.",
    needReason:
      "One licensed pharmacist-owner is the entire business — extreme key-person concentration.",
    decisionMaker: "Likely decision maker",
    decisionMakerName: "Dr. Sam Reyes, PharmD",
    businessAge: "Established (5+ yrs)",
    verification: "Inferred",
    evidence: [
      { label: "Owner", detail: "Pharmacist-owner named in state license lookup pattern.", confidence: "Estimated", sourceUrl: "https://license.example.com/tx/pharmacy/reyes", sourceLabel: "License lookup (demo)" },
    ],
    outreach: {
      hook: "The business is the pharmacist — what happens to the doors if you can't open them?",
      rationale: "Single-licensee businesses have nowhere to hide from key-person risk.",
    },
    riskNotes: "Limited public contact data; no email; expect phone-only outreach.",
    includedInReport: true,
  },
  {
    company: "Round Rock Auto Collision",
    website: "https://rrcollision.example.com",
    publicProfileUrl: "https://maps.example.com/place/rr-collision",
    location: "2200 N Mays St, Round Rock, TX 78664",
    city: "Round Rock",
    state: "TX",
    industry: "Auto body & collision repair",
    phone: "(512) 555-0138",
    email: "service@rrcollision.example.com",
    breakdown: { icpFit: 14, needSignal: 13, verification: 10, decisionMaker: 6, outreachQuality: 9, contactability: 4, riskPenalty: -6 },
    whyItFits:
      "Owner-operated collision shop; some enterprise value but commoditized and price-sensitive.",
    needReason:
      "Owner-dependent insurer relationships, but the business is replaceable and margins are thin.",
    decisionMaker: "Gatekeeper / unclear",
    decisionMakerName: null,
    businessAge: "Growing (2–5 yrs)",
    verification: "Inferred",
    evidence: [
      { label: "Owner", detail: "Owner inferred from a single-name profile; unconfirmed.", confidence: "Inferred", sourceUrl: "https://maps.example.com/place/rr-collision", sourceLabel: "Business profile (demo)" },
    ],
    outreach: {
      hook: "Insurer DRP relationships often die with the owner — worth protecting.",
      rationale: "If a DRP relationship is owner-held it's a real (if narrow) angle.",
    },
    riskNotes: "Thin margins and unclear ownership; lower priority than partner-owned fits.",
    includedInReport: false,
  },
  {
    company: "South Congress Coffee Collective",
    website: "https://socoffee.example.com",
    publicProfileUrl: "https://maps.example.com/place/soco-coffee",
    location: "1600 S Congress Ave, Austin, TX 78704",
    city: "Austin",
    state: "TX",
    industry: "Independent cafe",
    phone: "(512) 555-0144",
    email: "hi@socoffee.example.com",
    breakdown: { icpFit: 9, needSignal: 8, verification: 8, decisionMaker: 5, outreachQuality: 7, contactability: 4, riskPenalty: -8 },
    whyItFits:
      "Single-location cafe; low enterprise value and minimal key-person concentration. Borderline fit at best.",
    needReason:
      "Limited assets and a replaceable owner role; weak need for business life coverage.",
    decisionMaker: "Gatekeeper / unclear",
    decisionMakerName: null,
    businessAge: "Early (<2 yrs)",
    verification: "Unknown",
    evidence: [
      { label: "Profile", detail: "Single-location profile, no ownership or loan signals found.", confidence: "Inferred", sourceUrl: "https://maps.example.com/place/soco-coffee", sourceLabel: "Business profile (demo)" },
    ],
    outreach: {
      hook: "Limited angle — possibly personal coverage rather than business.",
      rationale: "Weak business need; better suited to a personal-lines conversation if any.",
    },
    riskNotes: "Low enterprise value, early-stage, thin data. Recommend removing from report.",
    includedInReport: false,
  },
  {
    company: "QuickGig Handyman LLC",
    website: "https://quickgighandyman.example.com",
    publicProfileUrl: "https://maps.example.com/place/quickgig-handyman",
    location: "Mobile — Austin metro, TX",
    city: "Austin",
    state: "TX",
    industry: "Solo handyman service",
    phone: "(512) 555-0199",
    email: null,
    breakdown: { icpFit: 5, needSignal: 6, verification: 6, decisionMaker: 4, outreachQuality: 5, contactability: 3, riskPenalty: -10 },
    whyItFits:
      "Solo operator with no employees or partners — outside the ideal profile. Included only to show the scoring floor.",
    needReason:
      "No employees, no partners, no business debt signals. Minimal business-insurance need.",
    decisionMaker: "Unknown",
    decisionMakerName: null,
    businessAge: "Early (<2 yrs)",
    verification: "Unknown",
    evidence: [
      { label: "Structure", detail: "Solo LLC, no staff or partner signals found.", confidence: "Inferred", sourceUrl: "https://maps.example.com/place/quickgig-handyman", sourceLabel: "Business profile (demo)" },
    ],
    outreach: {
      hook: "Out of profile — no clear business angle.",
      rationale: "Bad-fit signal: solo gig with no assets or employees.",
    },
    riskNotes: "Matches a defined bad-fit signal. Remove from report.",
    includedInReport: false,
  },
  {
    company: "Cedar Park Orthodontics",
    website: "https://cedarparkortho.example.com",
    publicProfileUrl: "https://maps.example.com/place/cedar-park-ortho",
    location: "1335 E Whitestone Blvd, Cedar Park, TX 78613",
    city: "Cedar Park",
    state: "TX",
    industry: "Orthodontic practice",
    phone: "(512) 555-0156",
    email: "office@cedarparkortho.example.com",
    breakdown: { icpFit: 23, needSignal: 22, verification: 17, decisionMaker: 9, outreachQuality: 13, contactability: 5, riskPenalty: 0 },
    whyItFits:
      "Two-doctor orthodontic practice with high per-provider revenue and a recent second-location loan — strong key-person and loan-protection fit.",
    needReason:
      "High-earner providers plus expansion debt; losing one provider materially impacts loan servicing.",
    decisionMaker: "Confirmed owner/principal",
    decisionMakerName: "Dr. Allison Tran & Dr. Marcus Bell",
    businessAge: "Established (5+ yrs)",
    verification: "Verified",
    evidence: [
      { label: "Owners", detail: "Two owner-doctors named on the practice site.", confidence: "Confirmed", sourceUrl: "https://cedarparkortho.example.com/doctors", sourceLabel: "Company site — Doctors (demo)" },
      { label: "Expansion", detail: "Second-location announcement implies expansion financing.", confidence: "Estimated", sourceUrl: "https://cedarparkortho.example.com/news/second-location", sourceLabel: "Company site — News (demo)" },
    ],
    outreach: {
      hook: "Two providers carrying expansion debt — model what one provider's absence does to the loan.",
      rationale: "Provider income is the collateral; making that explicit creates urgency.",
    },
    riskNotes: "Confirm both providers are owners (vs. one owner, one associate) before pricing buy-sell.",
    includedInReport: true,
  },
];

export const LEADS: Lead[] = LONESTAR_RAW.map((raw, i) =>
  buildLead("proj_lonestar", i, raw)
);
