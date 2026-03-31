import { useState, useRef, useEffect, useCallback } from "react";
import voiceraLogo from "@/assets/voicera-logo-new.png";
import Footer from "@/components/Footer";

/* ═══════════════════════════════════════════════════════════════════════
   VOICERA SINCERITY™ — API DOCUMENTATION LIBRARY v2.1.0
   Styled to match voicera.io brand: light theme, blue accent, clean type
   ═══════════════════════════════════════════════════════════════════════ */

const B = { name:"Voicera", product:"Sincerity™", ver:"2.1.0", url:"https://api.voicera.io" };

/* ─── Voicera brand palette (extracted from voicera.io) ─── */
const C = {
  /* backgrounds */
  bg:     "#FFFFFF",
  bgAlt:  "#F7F9FC",
  bgSide: "#FAFBFD",
  sf:     "#FFFFFF",
  sfAlt:  "#F1F5F9",
  /* borders */
  bd:     "#E2E8F0",
  bdL:    "#CBD5E1",
  /* text */
  tx:     "#0F172A",
  txS:    "#1E293B",
  txM:    "#475569",
  txD:    "#94A3B8",
  /* accent — voicera.io primary blue */
  ac:     "#2563EB",
  acH:    "#1D4ED8",
  acL:    "#3B82F6",
  acBg:   "#EFF6FF",
  acBg2:  "#DBEAFE",
  /* status */
  g:      "#059669",
  gBg:    "#ECFDF5",
  am:     "#D97706",
  amBg:   "#FFFBEB",
  rd:     "#DC2626",
  rdBg:   "#FEF2F2",
  pr:     "#7C3AED",
  prBg:   "#F5F3FF",
  /* code */
  cd:     "#0F172A",
  cdBg:   "#F8FAFC",
  w:      "#FFFFFF",
};

const F = {
  d: "'DM Sans', 'Inter', -apple-system, sans-serif",
  b: "'DM Sans', 'Inter', -apple-system, sans-serif",
  m: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
};

const MC = {
  GET:    { bg: C.gBg,  c: C.g,  bd: "#A7F3D0" },
  POST:   { bg: C.acBg, c: C.ac, bd: "#93C5FD" },
  PUT:    { bg: C.amBg, c: C.am, bd: "#FDE68A" },
  DELETE: { bg: C.rdBg, c: C.rd, bd: "#FECACA" },
};

/* ═══════════════ NAV ═══════════════ */
const NAV = [
  { id:"intro",      label:"Introduction",       g:"Get Started" },
  { id:"quickstart", label:"Quickstart",          g:"Get Started" },
  { id:"auth",       label:"Authentication",      g:"Get Started" },
  { id:"concepts",   label:"Core Concepts",       g:"Concepts" },
  { id:"modalities", label:"Modalities",          g:"Concepts" },
  { id:"arch",       label:"Architecture",        g:"Concepts" },
  { id:"ep-health",  label:"Health",              g:"API Reference" },
  { id:"ep-auth",    label:"Auth Tokens",         g:"API Reference" },
  { id:"ep-analyze", label:"Analyze",             g:"API Reference" },
  { id:"ep-jobs",    label:"Jobs",                g:"API Reference" },
  { id:"ep-batch",   label:"Batch",               g:"API Reference" },
  { id:"ep-upload",  label:"Pre-signed Upload",   g:"API Reference" },
  { id:"objects",    label:"Response Objects",     g:"Reference" },
  { id:"errors",     label:"Error Handling",       g:"Reference" },
];

/* ═══════ SEARCH INDEX ═══════ */
const SEARCH_ENTRIES: { id: string; label: string; group: string; keywords: string[] }[] = [
  { id: "intro", label: "Introduction", group: "Get Started", keywords: ["welcome", "overview", "base url", "capabilities", "audio analysis", "video analysis", "composite fusion", "request structure", "rest", "json"] },
  { id: "quickstart", label: "Quickstart", group: "Get Started", keywords: ["curl", "authenticate", "submit media", "poll", "job_id", "3 steps", "tutorial", "getting started"] },
  { id: "auth", label: "Authentication", group: "Get Started", keywords: ["x-api-key", "cognito", "jwt", "token", "session", "security", "header", "401", "token lifecycle"] },
  { id: "concepts", label: "Core Concepts", group: "Concepts", keywords: ["sincerity scoring", "truthfulness bands", "sincere", "uncertain", "deceptive", "diarization", "speaker", "prediction", "prosody", "voice quality", "emotional", "linguistic", "asynchronous"] },
  { id: "modalities", label: "Modalities", group: "Concepts", keywords: ["audio", "video", "composite", "media_type", "pipeline", "fusion", "mp3", "wav", "mp4", "webm", "mkv"] },
  { id: "arch", label: "Architecture", group: "Concepts", keywords: ["infrastructure", "aws", "gcp", "s3", "dynamodb", "cloud run", "data flow", "upload", "workers", "sqs", "supported formats"] },
  { id: "ep-health", label: "Health Endpoints", group: "API Reference", keywords: ["/health", "/health/ready", "liveness", "readiness", "GET", "status", "uptime"] },
  { id: "ep-auth", label: "Auth Token Endpoints", group: "API Reference", keywords: ["/api/v1/auth/token", "POST", "DELETE", "exchange", "revoke", "logout", "jwt_token", "api_key"] },
  { id: "ep-analyze", label: "Analyze Endpoint", group: "API Reference", keywords: ["/api/v1/analyze", "POST", "submit", "file", "media_type", "webhook_url", "202", "multipart"] },
  { id: "ep-jobs", label: "Jobs Endpoint", group: "API Reference", keywords: ["/api/v1/jobs", "GET", "job_id", "status", "pending", "processing", "completed", "failed", "result", "download"] },
  { id: "ep-batch", label: "Batch Endpoints", group: "API Reference", keywords: ["/api/v1/analyze/batch", "/api/v1/batches", "POST", "GET", "batch_id", "50 files", "bulk"] },
  { id: "ep-upload", label: "Pre-signed Upload", group: "API Reference", keywords: ["/api/v1/upload-urls", "/api/v1/jobs/submit", "pre-signed", "s3", "PUT", "large files", "parallel upload"] },
  { id: "objects", label: "Response Objects", group: "Reference", keywords: ["AnalysisResult", "SincerityAnalysis", "CompositeResult", "SpeakerSegment", "SincerityTimelineEntry", "Transcription", "schema", "overall_score", "model_scores", "fusion_weights"] },
  { id: "errors", label: "Error Handling", group: "Reference", keywords: ["error", "detail", "status codes", "400", "401", "403", "404", "413", "422", "429", "503", "validation", "retry", "exponential backoff"] },
];

/* ═══════ REUSABLE ATOMS ═══════ */

const Bdg = ({ m }) => {
  const s = MC[m] || MC.GET;
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 5,
      fontSize: 11, fontWeight: 700, fontFamily: F.m, letterSpacing: "0.04em",
      background: s.bg, color: s.c, border: `1px solid ${s.bd}`,
    }}>{m}</span>
  );
};

const Ep = ({ m, p, d }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 12,
    padding: "14px 18px", background: C.w, borderRadius: 10,
    border: `1px solid ${C.bd}`, marginBottom: 12,
    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
  }}>
    <Bdg m={m} />
    <div style={{ flex: 1 }}>
      <code style={{ fontFamily: F.m, fontSize: 13, color: C.tx, fontWeight: 600 }}>{p}</code>
      {d && <p style={{ margin: "5px 0 0", fontSize: 13.5, color: C.txM, lineHeight: 1.55 }}>{d}</p>}
    </div>
  </div>
);

const Code = ({ t, lang, children }) => (
  <div style={{ marginBottom: 20, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.bd}`, boxShadow: "0 1px 3px rgba(15,23,42,0.06)" }}>
    {t && (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "9px 16px", background: C.sfAlt,
        borderBottom: `1px solid ${C.bd}`,
        fontSize: 11, fontFamily: F.m, color: C.txD,
        textTransform: "uppercase", letterSpacing: "0.07em",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.ac, opacity: 0.5 }} />
        {t}
        {lang && <span style={{ marginLeft: "auto", opacity: 0.5, fontSize: 10 }}>{lang}</span>}
      </div>
    )}
    <pre style={{
      margin: 0, padding: "16px 18px",
      background: "#0F172A", color: "#E2E8F0",
      fontFamily: F.m, fontSize: 12.5, lineHeight: 1.7,
      overflowX: "auto", whiteSpace: "pre", tabSize: 2,
    }}>
      <code>{children}</code>
    </pre>
  </div>
);

const Pt = ({ params }) => (
  <div style={{ overflowX: "auto", marginBottom: 20, borderRadius: 10, border: `1px solid ${C.bd}`, boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
      <thead>
        <tr style={{ background: C.sfAlt, borderBottom: `1px solid ${C.bd}` }}>
          {["Field", "Type", "Req", "Description"].map(h => (
            <th key={h} style={{
              textAlign: "left", padding: "10px 14px",
              fontSize: 10.5, fontWeight: 700, color: C.txD,
              textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: F.m,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {params.map((p, i) => (
          <tr key={i} style={{ borderBottom: `1px solid ${C.bd}`, background: i % 2 === 0 ? C.w : C.bgAlt }}>
            <td style={{ padding: "10px 14px", fontFamily: F.m, fontSize: 12.5, color: C.ac, fontWeight: 600, whiteSpace: "nowrap" }}>{p.n}</td>
            <td style={{ padding: "10px 14px", fontFamily: F.m, fontSize: 12, color: C.txM, whiteSpace: "nowrap" }}>{p.t}</td>
            <td style={{ padding: "10px 14px" }}>
              <span style={{
                fontSize: 10.5, fontWeight: 700, fontFamily: F.m,
                padding: "2px 7px", borderRadius: 4,
                background: p.r ? C.amBg : C.sfAlt,
                color: p.r ? C.am : C.txD,
                border: `1px solid ${p.r ? "#FDE68A" : C.bd}`,
              }}>{p.r ? "Yes" : "No"}</span>
            </td>
            <td style={{ padding: "10px 14px", color: C.txM, lineHeight: 1.55 }}>{p.d}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Co = ({ type = "info", children }) => {
  const s = {
    info:    { b: C.ac, bg: C.acBg, i: "\u2139\uFE0F" },
    warning: { b: C.am, bg: C.amBg, i: "\u26A0\uFE0F" },
    success: { b: C.g,  bg: C.gBg,  i: "\u2705" },
    tip:     { b: C.pr, bg: C.prBg, i: "\uD83D\uDCA1" },
  }[type];
  return (
    <div style={{
      padding: "14px 18px", borderRadius: 10,
      borderLeft: `4px solid ${s.b}`, background: s.bg,
      marginBottom: 20, fontSize: 13.5, lineHeight: 1.65, color: C.txS,
    }}>
      <span style={{ marginRight: 8 }}>{s.i}</span>{children}
    </div>
  );
};

const H2 = ({ children, sub }: { children: any; sub?: boolean }) => (
  <div style={{ marginBottom: sub ? 16 : 24, marginTop: sub ? 36 : 0 }}>
    <h2 style={{
      fontFamily: F.d, fontSize: sub ? 19 : 28,
      fontWeight: sub ? 600 : 800, color: C.tx,
      margin: 0, lineHeight: 1.25, letterSpacing: "-0.02em",
    }}>{children}</h2>
    {!sub && <div style={{ width: 40, height: 3, background: C.ac, borderRadius: 2, marginTop: 10 }} />}
  </div>
);

const Sc = ({ code, d }) => {
  const c = code < 300 ? C.g : code < 400 ? C.am : C.rd;
  const bg = code < 300 ? C.gBg : code < 400 ? C.amBg : C.rdBg;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "5px 0" }}>
      <code style={{
        fontFamily: F.m, fontSize: 12, fontWeight: 700, color: c,
        background: bg, padding: "2px 8px", borderRadius: 4, minWidth: 36, textAlign: "center",
      }}>{code}</code>
      <span style={{ fontSize: 13.5, color: C.txM }}>{d}</span>
    </div>
  );
};

const P = ({ children }) => <p style={{ fontSize: 15, lineHeight: 1.75, color: C.txM, maxWidth: 660, marginBottom: 20 }}>{children}</p>;
const Cd = ({ children }) => <code style={{ fontFamily: F.m, color: C.ac, fontSize: 12.5, background: C.acBg, padding: "1px 5px", borderRadius: 3 }}>{children}</code>;
const CdD = ({ children }) => <code style={{ fontFamily: F.m, color: C.txD, fontSize: 12, background: C.sfAlt, padding: "1px 5px", borderRadius: 3 }}>{children}</code>;
const Pill = ({ children }) => <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 700, fontFamily: F.m, color: C.ac, background: C.acBg, border: `1px solid ${C.acBg2}`, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>{children}</span>;

/* ═══════════════════════════════════════════════════════════════════════
   SECTIONS
   ═══════════════════════════════════════════════════════════════════════ */

const Intro = () => (
  <div>
    <Pill>Welcome</Pill>
    <H2>Introduction</H2>
    <p style={{ fontSize: 16.5, lineHeight: 1.8, color: C.txS, maxWidth: 660, marginBottom: 24, fontWeight: 400 }}>
      The <strong style={{ color: C.tx, fontWeight: 700 }}>Voicera {B.product} API</strong> is a multimodal credibility intelligence platform that analyzes audio, video, and composite signals to produce sincerity assessments. It identifies patterns across vocal prosody, facial micro-expressions, linguistic consistency, and emotional congruence — then fuses them into a single confidence-weighted score.
    </p>
    <P>The API follows REST conventions and returns JSON responses. All analysis is asynchronous — submit media, receive a job ID, and poll for results. Files up to 500 MB, batch submissions up to 50 files.</P>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 36 }}>
      {[
        { l: "Base URL", v: B.url, m: 1 },
        { l: "Version", v: "v" + B.ver, m: 1 },
        { l: "Auth", v: "X-API-Key header" },
        { l: "Format", v: "JSON responses" },
        { l: "Max File", v: "500 MB" },
        { l: "Batch", v: "50 files" },
      ].map((x, i) => (
        <div key={i} style={{
          padding: "14px 16px", background: C.w, borderRadius: 10,
          border: `1px solid ${C.bd}`, boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
        }}>
          <div style={{ fontSize: 10, fontFamily: F.m, color: C.txD, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{x.l}</div>
          <div style={{ fontSize: 13, color: C.ac, fontFamily: x.m ? F.m : F.b, fontWeight: 600 }}>{x.v}</div>
        </div>
      ))}
    </div>

    <Pill>Capabilities</Pill>
    <H2 sub>Core Capabilities</H2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14 }}>
      {[
        { i: "\uD83C\uDF99", t: "Audio Analysis", d: "Vocal prosody, voice quality, emotional tone, and linguistic consistency — scored per-second with speaker diarization, full transcription, and sentiment analysis." },
        { i: "\uD83C\uDFA5", t: "Video Analysis", d: "Facial micro-expressions, body language signals, quality metrics — frame-by-frame truthfulness assessment with confidence bands." },
        { i: "\u25C8", t: "Composite Fusion", d: "Confidence-weighted fusion of both modalities into a single score. Per-modality breakdowns, fusion weights, quality flags, and review recommendations." },
      ].map((c, i) => (
        <div key={i} style={{
          padding: "22px", background: C.w, borderRadius: 12,
          border: `1px solid ${C.bd}`, boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
          transition: "box-shadow 0.2s",
        }}>
          <div style={{ fontSize: 26, marginBottom: 12 }}>{c.i}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.tx, marginBottom: 6 }}>{c.t}</div>
          <div style={{ fontSize: 13.5, color: C.txM, lineHeight: 1.65 }}>{c.d}</div>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 36 }}>
      <H2 sub>Request Structure</H2>
      <P>Every API call follows this structure:</P>
      <Code t="URL pattern" lang="http">{"{METHOD} " + B.url + "/api/v1/{resource}/{path_params}?{query_params}"}</Code>
      <P>Supports <Cd>GET</Cd> (read), <Cd>POST</Cd> (create/trigger), <Cd>PUT</Cd> (update), and <Cd>DELETE</Cd> (remove). POST and PUT require a body — JSON or multipart/form-data. Every request needs the <Cd>X-API-Key</Cd> header.</P>
    </div>
  </div>
);

const Quickstart = () => (
  <div>
    <Pill>Get Started</Pill>
    <H2>Quickstart</H2>
    <P>Three steps to your first sincerity analysis. Uses <Cd>curl</Cd>, but any HTTP client works.</P>

    <H2 sub>Step 1 — Authenticate</H2>
    <P>Exchange your Cognito JWT for a short-lived session token.</P>
    <Code t="Exchange token" lang="bash">{"curl -X POST " + B.url + "/api/v1/auth/token \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"jwt_token\": \"YOUR_COGNITO_JWT\"}'"}</Code>
    <Code t="Response" lang="json">{'{\n  "api_key":      "vra_sk_a1b2c3d4e5f6...",\n  "customer_id":  "cust_7f3a9b2e...",\n  "expires_at":   "2026-03-31T18:00:00Z",\n  "token_type":   "session",\n  "message":      "Use api_key as X-API-Key header for all API calls."\n}'}</Code>

    <H2 sub>Step 2 — Submit Media</H2>
    <P>Upload a file. Set <Cd>media_type</Cd> to <Cd>audio</Cd>, <Cd>video</Cd>, or <Cd>composite</Cd>. You get a <Cd>job_id</Cd> immediately.</P>
    <Code t="Submit composite analysis" lang="bash">{"curl -X POST " + B.url + "/api/v1/analyze \\\n  -H \"X-API-Key: vra_sk_a1b2c3d4e5f6...\" \\\n  -F \"file=@interview.mp4\" \\\n  -F \"media_type=composite\""}</Code>
    <Code t="Response · 202" lang="json">{'{\n  "job_id":              "job_9f2e4a71...",\n  "status":              "pending",\n  "media_type":          "composite",\n  "audio_child_job_id":  "job_a3c1d8f2...",\n  "video_child_job_id":  "job_b7d4e6a9...",\n  "message":             "Job queued. Poll GET /api/v1/jobs/{job_id} for results."\n}'}</Code>

    <H2 sub>Step 3 — Poll for Results</H2>
    <P>Poll until <Cd>status</Cd> is <code style={{ fontFamily: F.m, color: C.g, fontSize: 12.5, background: C.gBg, padding: "1px 5px", borderRadius: 3 }}>completed</code>.</P>
    <Code t="Poll job" lang="bash">{"curl " + B.url + "/api/v1/jobs/job_9f2e4a71... \\\n  -H \"X-API-Key: vra_sk_a1b2c3d4e5f6...\""}</Code>
    <Code t="Response · completed" lang="json">{'{\n  "job_id": "job_9f2e4a71...",\n  "status": "completed",\n  "media_type": "composite",\n  "result": {\n    "overall_sincerity": 0.73,\n    "prediction": "mostly_sincere",\n    "confidence": 0.88,\n    "fusion_method": "confidence_weighted",\n    "fusion_weights": { "audio": 0.62, "video": 0.38 },\n    "truthfulness_bands": {\n      "sincere": 0.65, "uncertain": 0.22, "deceptive": 0.13\n    },\n    "modalities": {\n      "audio": { "score": 0.71, "confidence": 0.91, "weight_applied": 0.62 },\n      "video": { "score": 0.76, "confidence": 0.82, "weight_applied": 0.38 }\n    }\n  },\n  "result_download_url": "https://s3.amazonaws.com/...?X-Amz-Expires=3600"\n}'}</Code>
    <Co type="tip"><strong>Webhook alternative:</strong> Pass a <Cd>webhook_url</Cd> when submitting — results POST to your endpoint on completion.</Co>
    <Co type="info"><strong>Download URL:</strong> Every completed job includes a <Cd>result_download_url</Cd> — a pre-signed S3 link valid for 1 hour.</Co>
  </div>
);

const Auth = () => (
  <div>
    <Pill>Security</Pill>
    <H2>Authentication</H2>
    <P>Every request needs a valid session token in the <Cd>X-API-Key</Cd> header. Tokens come from exchanging an AWS Cognito JWT.</P>
    <H2 sub>How It Works</H2>
    <P>Voicera uses AWS Cognito for identity. Your app authenticates through Cognito, then exchanges the JWT for a short-lived Voicera session token.</P>
    <Code t="Authenticated request" lang="bash">{"curl " + B.url + "/api/v1/jobs/job_abc123 \\\n  -H \"X-API-Key: vra_sk_a1b2c3d4e5f6...\""}</Code>
    <H2 sub>Token Lifecycle</H2>
    <P>Tokens expire after a fixed period. On expiry: <code style={{ fontFamily: F.m, color: C.rd, fontSize: 12.5, background: C.rdBg, padding: "1px 5px", borderRadius: 3 }}>401</code> with <CdD>detail: "token_expired"</CdD>. Redirect to re-authenticate.</P>
    <Co type="warning"><strong>Security:</strong> Never expose session tokens in client-side JS, URL params, or version control.</Co>
  </div>
);

const Concepts = () => (
  <div>
    <Pill>Concepts</Pill>
    <H2>Core Concepts</H2>
    <P>Foundational concepts for effective integration and accurate result interpretation.</P>

    <H2 sub>Asynchronous Processing</H2>
    <P>All analysis is async. Submit media → get <Cd>job_id</Cd> → poll <Cd>GET /api/v1/jobs/&#123;job_id&#125;</Cd>.</P>
    <P>Jobs: <CdD>pending</CdD> → <code style={{ fontFamily: F.m, color: C.am, fontSize: 12, background: C.amBg, padding: "1px 5px", borderRadius: 3 }}>processing</code> → <code style={{ fontFamily: F.m, color: C.g, fontSize: 12, background: C.gBg, padding: "1px 5px", borderRadius: 3 }}>completed</code> | <code style={{ fontFamily: F.m, color: C.rd, fontSize: 12, background: C.rdBg, padding: "1px 5px", borderRadius: 3 }}>failed</code>. Poll at 2–5 second intervals.</P>

    <H2 sub>Sincerity Scoring</H2>
    <P>Score range <Cd>0.0</Cd>–<Cd>1.0</Cd>, derived from four sub-models:</P>
    <Pt params={[
      { n: "prosody", t: "float", r: true, d: "Vocal rhythm, pitch variation, speech rate, pacing." },
      { n: "voice_quality", t: "float", r: true, d: "Tonal characteristics, micro-tremors, voice stability." },
      { n: "emotional", t: "float", r: true, d: "Emotional congruence — vocal emotion vs. spoken content." },
      { n: "linguistic", t: "float", r: true, d: "Word choice, hedging, repetition, consistency." },
    ]} />

    <H2 sub>Truthfulness Bands</H2>
    <P>Every analysis distributes probability across three bands (sum to 1.0):</P>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
      {[
        { l: "Sincere", c: C.g, bg: C.gBg, d: "High-confidence authentic speech" },
        { l: "Uncertain", c: C.am, bg: C.amBg, d: "Ambiguous or mixed signals" },
        { l: "Deceptive", c: C.rd, bg: C.rdBg, d: "Indicators of insincerity" },
      ].map((b, i) => (
        <div key={i} style={{
          padding: "16px", background: C.w, borderRadius: 10,
          borderTop: `3px solid ${b.c}`,
          border: `1px solid ${C.bd}`, borderTopColor: b.c, borderTopWidth: 3,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: b.c, fontFamily: F.m, marginBottom: 4 }}>{b.l}</div>
          <div style={{ fontSize: 12.5, color: C.txM, lineHeight: 1.5 }}>{b.d}</div>
        </div>
      ))}
    </div>

    <H2 sub>Speaker Diarization</H2>
    <P>Multi-speaker audio is auto-segmented. Each segment: per-speaker sincerity, transcription, voice emotion, text sentiment. Short segments flagged <CdD>scored: false</CdD> with a <Cd>reason</Cd>.</P>

    <H2 sub>Predictions</H2>
    <P>The <Cd>prediction</Cd> field: <CdD>sincere</CdD>, <CdD>mostly_sincere</CdD>, <CdD>uncertain</CdD>, <CdD>mostly_deceptive</CdD>, <CdD>deceptive</CdD>.</P>
  </div>
);

const Modalities = () => (
  <div>
    <Pill>Analysis Modes</Pill>
    <H2>Modalities</H2>
    <P>The <Cd>media_type</Cd> parameter selects the analysis pipeline.</P>

    {[
      { m: "audio", t: "Audio Analysis", def: true, d: "Voice sincerity from any audio/video file. Runs prosody, voice quality, emotional, and linguistic models. Returns per-second timeline, speaker diarization, transcription, sentiment.", f: "Any format — mp3, wav, m4a, mp4, webm, mkv, mov" },
      { m: "video", t: "Video Analysis", d: "Visual sincerity from facial expressions and body language. Frame-by-frame micro-expressions, quality metrics (lighting, occlusion, face detection), truthfulness bands.", f: "Video only — mp4, webm, mkv, mov" },
      { m: "composite", t: "Composite Fusion", d: "Full multimodal pipeline. Audio + video in parallel as child jobs, then confidence-weighted fusion. Returns parent result with per-modality breakdowns, fusion weights, quality flags.", f: "Video only — mp4, webm, mkv, mov" },
    ].map((x, i) => (
      <div key={i} style={{
        padding: "20px", background: C.w, borderRadius: 12,
        border: `1px solid ${C.bd}`, borderLeft: `4px solid ${C.ac}`,
        marginBottom: 14, boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
          <code style={{ fontFamily: F.m, fontSize: 13, color: C.ac, fontWeight: 700, background: C.acBg, padding: "2px 8px", borderRadius: 4 }}>{x.m}</code>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.tx }}>{x.t}</span>
          {x.def && <span style={{ fontSize: 10, fontFamily: F.m, color: C.txD, background: C.sfAlt, padding: "2px 8px", borderRadius: 4, border: `1px solid ${C.bd}` }}>DEFAULT</span>}
        </div>
        <p style={{ fontSize: 13.5, color: C.txM, lineHeight: 1.65, margin: "0 0 8px" }}>{x.d}</p>
        <div style={{ fontSize: 11.5, fontFamily: F.m, color: C.txD }}>{x.f}</div>
      </div>
    ))}
    <Co type="info"><strong>Composite architecture:</strong> Creates 3 jobs — 1 parent + 2 children. Parent completes after both children finish and fusion is applied.</Co>
  </div>
);

const Arch = () => (
  <div>
    <Pill>Infrastructure</Pill>
    <H2>Architecture Overview</H2>
    <P>Multi-cloud architecture (AWS + GCP) designed for security, scalability, and separation of concerns.</P>

    <H2 sub>Infrastructure Layers</H2>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 14, marginBottom: 28 }}>
      {[
        { t: "Frontend Layer", c: C.acL, items: ["React / TypeScript web app", "AWS Cognito authentication", "Direct browser-to-S3 via pre-signed URLs"] },
        { t: "API & Logic Layer", c: C.ac, items: ["REST API (FastAPI / Python)", "Job orchestration & queues", "Pre-signed URL generation", "Webhook & email notifications"] },
        { t: "Storage Layer", c: C.g, items: ["Amazon S3 — media & results", "DynamoDB — jobs, metadata, quotas", "Amazon SQS — completion signals"] },
        { t: "AI Processing", c: C.pr, items: ["GCP Cloud Run — Python workers", "Proprietary sincerity models", "Auto-scaling on queue depth", "Multi-model ensemble scoring"] },
      ].map((l, i) => (
        <div key={i} style={{
          padding: "18px", background: C.w, borderRadius: 12,
          border: `1px solid ${C.bd}`, borderTop: `3px solid ${l.c}`,
          boxShadow: "0 2px 6px rgba(15,23,42,0.05)",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: l.c, marginBottom: 10 }}>{l.t}</div>
          {l.items.map((it, j) => (
            <div key={j} style={{ fontSize: 13, color: C.txM, lineHeight: 1.75, paddingLeft: 14, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: C.txD }}>{"\u2022"}</span>{it}
            </div>
          ))}
        </div>
      ))}
    </div>

    <H2 sub>Data Flow</H2>
    {[
      { n: "1", t: "Authenticate", d: "Cognito login \u2192 JWT \u2192 exchange for Voicera session token." },
      { n: "2", t: "Upload Init", d: "Client requests pre-signed URL \u2192 receives time-limited S3 link." },
      { n: "3", t: "S3 Upload", d: "Browser uploads directly to S3, bypassing API servers." },
      { n: "4", t: "Job Registration", d: "S3 event \u2192 DynamoDB record with 'pending' status." },
      { n: "5", t: "AI Processing", d: "Workers poll pending jobs \u2192 download \u2192 analyze \u2192 save results." },
      { n: "6", t: "Delivery", d: "SQS signal \u2192 DynamoDB update \u2192 webhook \u2192 email notification." },
    ].map((s, i) => (
      <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: C.acBg, border: `2px solid ${C.ac}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: C.ac, fontFamily: F.m, flexShrink: 0,
        }}>{s.n}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.tx, marginBottom: 2 }}>{s.t}</div>
          <div style={{ fontSize: 13.5, color: C.txM, lineHeight: 1.6 }}>{s.d}</div>
        </div>
      </div>
    ))}

    <H2 sub>Supported Formats</H2>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {["MP4", "MOV", "M4V", "WEBM", "MKV", "MP3", "WAV", "M4A"].map(f => (
        <span key={f} style={{
          padding: "5px 14px", background: C.sfAlt, border: `1px solid ${C.bd}`,
          borderRadius: 6, fontFamily: F.m, fontSize: 11.5, color: C.txM, fontWeight: 500,
        }}>{f}</span>
      ))}
    </div>
  </div>
);

/* ═══════ API REFERENCE PAGES ═══════ */
const EpHealth = () => (<div>
  <Pill>API Reference</Pill><H2>Health Endpoints</H2>
  <P>Liveness and readiness probes. No authentication required.</P>
  <Ep m="GET" p="/health" d="Liveness \u2014 200 when running." /><Ep m="GET" p="/health/ready" d="Readiness \u2014 200 when ready." />
  <H2 sub>Response \u2014 HealthResponse</H2>
  <Pt params={[{ n: "status", t: "string", r: true, d: "\"healthy\" or \"ready\"." }, { n: "service", t: "string", r: false, d: "\"voicera-api\"." }, { n: "version", t: "string", r: false, d: "API version (" + B.ver + ")." }, { n: "environment", t: "string", r: true, d: "production, staging." }, { n: "model_loaded", t: "boolean", r: true, d: "Models loaded in container." }, { n: "uptime_seconds", t: "number", r: false, d: "Container uptime." }]} />
</div>);

const EpAuth = () => (<div>
  <Pill>API Reference</Pill><H2>Auth Token Endpoints</H2>
  <P>Create and revoke session tokens.</P>
  <Ep m="POST" p="/api/v1/auth/token" d="Exchange Cognito JWT for session token." />
  <H2 sub>Request</H2><Pt params={[{ n: "jwt_token", t: "string", r: true, d: "Valid AWS Cognito access token." }]} />
  <H2 sub>Response \u2014 TokenExchangeResponse</H2>
  <Pt params={[{ n: "api_key", t: "string", r: true, d: "Session token for X-API-Key." }, { n: "customer_id", t: "string", r: true, d: "Your customer ID." }, { n: "expires_at", t: "string", r: true, d: "ISO 8601 expiry." }, { n: "token_type", t: "string", r: false, d: "\"session\"." }, { n: "message", t: "string", r: false, d: "Usage instructions." }]} />
  <Sc code={200} d="Token issued." /><Sc code={401} d="JWT invalid/expired." /><Sc code={503} d="JWKS unavailable." />
  <div style={{ borderTop: "1px solid " + C.bd, paddingTop: 28, marginTop: 28 }}>
    <Ep m="DELETE" p="/api/v1/auth/token" d="Revoke session token (logout)." />
    <Pt params={[{ n: "api_key", t: "string", r: true, d: "Token to revoke." }]} /><Sc code={204} d="Revoked." />
  </div>
</div>);

const EpAnalyze = () => (<div>
  <Pill>API Reference</Pill><H2>Analyze Endpoints</H2>
  <P>Submit media for sincerity analysis. Returns job ID immediately.</P>
  <Ep m="POST" p="/api/v1/analyze" d="Submit audio, video, or composite media." />
  <H2 sub>Request \u2014 multipart/form-data</H2>
  <Pt params={[{ n: "file", t: "binary", r: true, d: "Audio/video file, up to 500 MB." }, { n: "media_type", t: "string", r: false, d: "\"audio\" (default), \"video\", or \"composite\"." }, { n: "webhook_url", t: "string", r: false, d: "HTTPS URL for completion POST." }]} />
  <H2 sub>Response \u2014 202</H2>
  <Pt params={[{ n: "job_id", t: "string", r: true, d: "UUID. Poll GET /api/v1/jobs/{job_id}." }, { n: "status", t: "string", r: false, d: "\"pending\"." }, { n: "media_type", t: "string", r: false, d: "Modality." }, { n: "audio_child_job_id", t: "string|null", r: false, d: "Composite: audio child UUID." }, { n: "video_child_job_id", t: "string|null", r: false, d: "Composite: video child UUID." }, { n: "message", t: "string", r: false, d: "Status message." }]} />
  <Sc code={202} d="Queued." /><Sc code={400} d="Invalid request." /><Sc code={401} d="Unauthorized." /><Sc code={413} d="File > 500 MB." />
  <Co type="info"><Cd>POST /api/v1/analyze/async</Cd> is an identical alias endpoint.</Co>
</div>);

const EpJobs = () => (<div>
  <Pill>API Reference</Pill><H2>Jobs Endpoint</H2>
  <P>Retrieve status and results for analysis jobs.</P>
  <Ep m="GET" p="/api/v1/jobs/{job_id}" d="Get job status and analysis result." />
  <Pt params={[{ n: "job_id", t: "string (path)", r: true, d: "Job UUID." }]} />
  <H2 sub>Response \u2014 JobStatusResponse</H2>
  <Pt params={[{ n: "job_id", t: "string", r: true, d: "Job identifier." }, { n: "status", t: "string", r: true, d: "pending | processing | completed | failed." }, { n: "customer_id", t: "string", r: true, d: "Owning customer." }, { n: "media_type", t: "string", r: false, d: "audio | video | composite." }, { n: "result", t: "object|null", r: false, d: "Full analysis when completed." }, { n: "result_download_url", t: "string|null", r: false, d: "Pre-signed S3 URL (1 hr TTL)." }, { n: "error", t: "string|null", r: false, d: "Error when failed." }, { n: "batch_id", t: "string|null", r: false, d: "Batch ID if batched." }, { n: "parent_job_id", t: "string|null", r: false, d: "Child jobs: parent composite UUID." }, { n: "audio_child_job_id", t: "string|null", r: false, d: "Composite: audio child." }, { n: "video_child_job_id", t: "string|null", r: false, d: "Composite: video child." }, { n: "webhook_url", t: "string|null", r: false, d: "Webhook if configured." }, { n: "original_filename", t: "string|null", r: false, d: "Uploaded filename." }, { n: "created_at", t: "string", r: true, d: "ISO 8601." }, { n: "updated_at", t: "string", r: true, d: "ISO 8601." }, { n: "completed_at", t: "string|null", r: false, d: "ISO 8601." }]} />
  <Sc code={200} d="Found." /><Sc code={401} d="Unauthorized." /><Sc code={403} d="Wrong customer." /><Sc code={404} d="Not found." />
</div>);

const EpBatch = () => (<div>
  <Pill>API Reference</Pill><H2>Batch Endpoints</H2>
  <P>Submit up to 50 files at once under one batch ID.</P>
  <Ep m="POST" p="/api/v1/analyze/batch" d="Submit batch of files." />
  <Pt params={[{ n: "files", t: "binary[]", r: true, d: "Audio/video files. Max 50." }]} />
  <H2 sub>Response \u2014 202</H2>
  <Pt params={[{ n: "batch_id", t: "string", r: true, d: "Batch UUID." }, { n: "total_jobs", t: "integer", r: true, d: "Jobs created." }, { n: "job_ids", t: "string[]", r: true, d: "Per-file UUIDs." }, { n: "status", t: "string", r: false, d: "\"pending\"." }]} />
  <div style={{ borderTop: "1px solid " + C.bd, paddingTop: 28, marginTop: 28 }}>
    <Ep m="GET" p="/api/v1/batches/{batch_id}" d="Batch status and per-job summaries." />
    <Pt params={[{ n: "batch_id", t: "string", r: true, d: "Batch ID." }, { n: "status", t: "string", r: true, d: "pending | processing | completed | partial_failure." }, { n: "total_jobs", t: "integer", r: true, d: "Total." }, { n: "completed_jobs", t: "integer", r: true, d: "Succeeded." }, { n: "failed_jobs", t: "integer", r: true, d: "Failed." }, { n: "pending_jobs", t: "integer", r: true, d: "Remaining." }, { n: "jobs", t: "array", r: false, d: "Per-job: job_id, status, filename, error." }]} />
  </div>
</div>);

const EpUpload = () => (<div>
  <Pill>API Reference</Pill><H2>Pre-signed Upload</H2>
  <P>Two-step workflow for large/bulk uploads: generate S3 URLs, upload directly, then trigger analysis.</P>
  <Co type="tip"><strong>When to use:</strong> Bypasses 500 MB body limit, enables parallel uploads. URLs expire in 15 min.</Co>
  <H2 sub>Step 1 \u2014 Generate URLs</H2>
  <Ep m="POST" p="/api/v1/upload-urls" d="Pre-signed S3 PUT URLs. One per item." />
  <Pt params={[{ n: "items", t: "UploadItem[]", r: true, d: "File metadata. Max 50. Fields: id, kind, fileType, fileMetadata, extra." }, { n: "features", t: "string[]", r: true, d: "Analysis features." }]} />
  <Code t="UploadItem" lang="json">{'{\n  "id": "interview-001.mp4",\n  "kind": "video",\n  "fileType": "video/mp4",\n  "fileMetadata": "Category:HR",\n  "extra": { "department": "engineering" }\n}'}</Code>
  <Pt params={[{ n: "items", t: "array", r: true, d: "Per-item: id, url, job_id." }, { n: "batch_id", t: "string", r: true, d: "Batch ID." }, { n: "expires_in_seconds", t: "integer", r: false, d: "URL TTL. Default 900." }]} />
  <H2 sub>Step 2 \u2014 Upload to S3</H2>
  <P>PUT each file. No auth headers \u2014 credentials embedded in URL.</P>
  <Code t="Upload" lang="bash">{"curl -X PUT \"https://s3.amazonaws.com/voicera-uploads/...\" \\\n  -H \"Content-Type: video/mp4\" \\\n  --upload-file interview-001.mp4"}</Code>
  <H2 sub>Step 3 \u2014 Trigger Analysis</H2>
  <Ep m="POST" p="/api/v1/jobs/submit" d="Enqueue uploaded files." />
  <Pt params={[{ n: "job_ids", t: "string[]", r: true, d: "From upload-urls response. 1\u201350." }]} />
  <Pt params={[{ n: "batch_id", t: "string|null", r: false, d: "Batch ID." }, { n: "job_ids", t: "string[]", r: true, d: "Enqueued." }, { n: "queued", t: "integer", r: true, d: "Count." }, { n: "skipped", t: "integer", r: true, d: "Not yet in S3." }, { n: "message", t: "string", r: true, d: "Summary." }]} />
  <Co type="warning"><strong>Timing:</strong> Ensure all S3 PUTs finish before calling <Cd>/jobs/submit</Cd>.</Co>
</div>);

const Objects = () => (<div>
  <Pill>Reference</Pill><H2>Response Objects</H2>
  <P>Analysis result schemas. The <Cd>result</Cd> shape depends on <Cd>media_type</Cd>.</P>
  <H2 sub>AnalysisResult \u2014 Audio & Video</H2>
  <Pt params={[{ n: "job_id", t: "string", r: true, d: "Job UUID." }, { n: "sincerity_analysis", t: "SincerityAnalysis", r: true, d: "Score, prediction, confidence, model_agreement, model_scores." }, { n: "transcription", t: "Transcription", r: true, d: "text, language, language_name, word_count." }, { n: "speaker_diarization", t: "SpeakerDiarization", r: true, d: "num_speakers, speaker_labels, segments[]." }, { n: "linguistic_analysis", t: "LinguisticAnalysis", r: true, d: "consistency_score, content_sincerity_indicators." }, { n: "metadata", t: "object", r: false, d: "sample_rate, speech_engine, voice_emotion_analysis." }, { n: "timestamp", t: "string", r: true, d: "ISO 8601." }]} />
  <H2 sub>SincerityAnalysis</H2>
  <Pt params={[{ n: "overall_score", t: "float", r: true, d: "0.0\u20131.0." }, { n: "prediction", t: "string", r: true, d: "sincere | mostly_sincere | uncertain | mostly_deceptive | deceptive." }, { n: "confidence", t: "string", r: true, d: "high | medium | low." }, { n: "model_agreement", t: "float", r: true, d: "Ensemble agreement (0.0\u20131.0)." }, { n: "model_scores", t: "object", r: true, d: "prosody, voice_quality, emotional, linguistic." }]} />
  <H2 sub>Transcription</H2>
  <Pt params={[{ n: "text", t: "string", r: true, d: "Full transcription." }, { n: "language", t: "string", r: true, d: "ISO code." }, { n: "language_name", t: "string", r: true, d: "Human-readable." }, { n: "word_count", t: "integer", r: true, d: "Total words." }]} />
  <H2 sub>SpeakerSegment</H2>
  <Pt params={[{ n: "start / end", t: "float", r: true, d: "Time (seconds)." }, { n: "speaker", t: "string", r: true, d: "Label." }, { n: "text", t: "string", r: true, d: "Segment text." }, { n: "sincerity_score", t: "float|null", r: false, d: "Segment score." }, { n: "prediction", t: "string|null", r: false, d: "Segment prediction." }, { n: "scored", t: "boolean", r: false, d: "Whether scored." }, { n: "reason", t: "string|null", r: false, d: "Why not scored." }, { n: "voice_emotion", t: "string|null", r: false, d: "Vocal emotion." }, { n: "text_sentiment", t: "string|null", r: false, d: "Text sentiment." }, { n: "voice_emotions", t: "array", r: false, d: "Emotion scores." }, { n: "text_emotions", t: "array", r: false, d: "Text emotion scores." }]} />
  <H2 sub>CompositeResult</H2>
  <P>Returned for <CdD>composite</CdD> jobs.</P>
  <Pt params={[{ n: "overall_sincerity", t: "float", r: true, d: "Fused score (0.0\u20131.0)." }, { n: "prediction", t: "string", r: true, d: "Fused prediction." }, { n: "confidence", t: "float", r: true, d: "Fused confidence." }, { n: "review_recommended", t: "boolean", r: false, d: "Quality flags suggest review." }, { n: "fusion_method", t: "string", r: false, d: "\"confidence_weighted\"." }, { n: "fusion_weights", t: "object", r: false, d: "{audio: 0.62, video: 0.38}." }, { n: "truthfulness_bands", t: "object", r: false, d: "sincere + uncertain + deceptive = 1.0." }, { n: "video_discrimination", t: "float", r: false, d: "Video signal impact." }, { n: "quality_flags", t: "string[]", r: false, d: "Warnings." }, { n: "modalities", t: "object", r: false, d: "Full audio + video payloads." }, { n: "fused_at", t: "string", r: false, d: "ISO 8601." }]} />
  <H2 sub>SincerityTimelineEntry</H2>
  <P>Per-second audio sincerity (in <Cd>modalities.audio.sincerity_timeline</Cd>):</P>
  <Pt params={[{ n: "second", t: "integer", r: true, d: "Offset from start." }, { n: "score", t: "float|null", r: false, d: "Score (null if silent)." }, { n: "prediction", t: "string|null", r: false, d: "Label." }, { n: "speaker", t: "string|null", r: false, d: "Active speaker." }]} />
</div>);

const Errors = () => (<div>
  <Pill>Reference</Pill><H2>Error Handling</H2>
  <P>4xx errors return a consistent envelope. 5xx errors indicate server-side issues.</P>
  <H2 sub>Error Format</H2>
  <Pt params={[{ n: "error", t: "string", r: true, d: "Machine-readable code." }, { n: "detail", t: "string|null", r: false, d: "Human-readable description." }, { n: "job_id", t: "string|null", r: false, d: "Associated job." }]} />
  <Code t="Example" lang="json">{'{\n  "error":  "file_too_large",\n  "detail": "File size exceeds the 500 MB limit.",\n  "job_id":  null\n}'}</Code>
  <H2 sub>Status Codes</H2>
  <Sc code={200} d="Success." /><Sc code={202} d="Accepted \u2014 queued." /><Sc code={204} d="No content." />
  <Sc code={400} d="Bad request." /><Sc code={401} d="Unauthorized." /><Sc code={403} d="Forbidden." /><Sc code={404} d="Not found." />
  <Sc code={413} d="Too large." /><Sc code={422} d="Validation error." /><Sc code={429} d="Rate limited." /><Sc code={503} d="Unavailable." />
  <H2 sub>Validation Errors (422)</H2>
  <Code t="Shape" lang="json">{'{\n  "detail": [{\n    "loc":   ["body", "media_type"],\n    "msg":   "value is not a valid enumeration member",\n    "type":  "type_error.enum",\n    "input": "stereo"\n  }]\n}'}</Code>
  <Pt params={[{ n: "loc", t: "array", r: true, d: "Path to invalid field." }, { n: "msg", t: "string", r: true, d: "Validation message." }, { n: "type", t: "string", r: true, d: "Error type." }, { n: "input", t: "any", r: false, d: "Invalid value." }, { n: "ctx", t: "object", r: false, d: "Constraint context." }]} />
  <Co type="tip"><strong>Retry:</strong> For 429/503, exponential backoff from 1s. For 401 + token_expired, re-auth and retry.</Co>
</div>);

/* ═══════ PAGE MAP ═══════ */
const PAGES = { intro: Intro, quickstart: Quickstart, auth: Auth, concepts: Concepts, modalities: Modalities, arch: Arch, "ep-health": EpHealth, "ep-auth": EpAuth, "ep-analyze": EpAnalyze, "ep-jobs": EpJobs, "ep-batch": EpBatch, "ep-upload": EpUpload, objects: Objects, errors: Errors };

/* ═══════════════════════════════════════════════════════════════════════
   MAIN LAYOUT — Light theme matching voicera.io
   ═══════════════════════════════════════════════════════════════════════ */
export default function VoiceraDocs() {
  const [page, setPage] = useState("intro");
  const [sb, setSb] = useState(typeof window !== "undefined" && window.innerWidth > 768);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const Pg = PAGES[page] || Intro;
  const groups = [...new Set(NAV.map(n => n.g))];
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_ENTRIES.filter(e => {
        const q = searchQuery.toLowerCase();
        return e.label.toLowerCase().includes(q)
          || e.group.toLowerCase().includes(q)
          || e.keywords.some(k => k.toLowerCase().includes(q));
      })
    : [];

  const handleSearchSelect = (id: string) => {
    setPage(id);
    setSearchQuery("");
    setSearchFocused(false);
    if (isMobile) setSb(false);
  };

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavSelect = (id: string) => {
    setPage(id);
    if (isMobile) setSb(false);
  };

  return (
    <div style={{ fontFamily: F.b, color: C.tx, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: ${C.bd}; border-radius: 3px; }
        *::-webkit-scrollbar-thumb:hover { background: ${C.bdL}; }
      `}</style>

      {/* Docs header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.bd}`,
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
      }}>
        {/* Top row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 12px", height: 56,
        }}>
          <button onClick={() => setSb(!sb)} style={{
            background: "none", border: `1px solid ${C.bd}`, color: C.txM,
            cursor: "pointer", fontSize: 16, padding: "5px 9px", borderRadius: 6,
            display: "flex", alignItems: "center", flexShrink: 0,
          }}>
            ☰
          </button>

          <a href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <img src={voiceraLogo} alt="Voicera" style={{ height: isMobile ? 40 : 50, width: "auto" }} />
          </a>

          <div style={{
            fontSize: 10, fontWeight: 700, fontFamily: F.m,
            color: C.ac, background: C.acBg, border: `1px solid ${C.acBg2}`,
            padding: "3px 10px", borderRadius: 20, letterSpacing: "0.02em",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>Sincerity™ V1.1</div>

          {/* Search bar — desktop only inline */}
          {!isMobile && (
            <div ref={searchRef} style={{ position: "relative", flex: "0 1 280px", minWidth: 0 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 8,
                border: `1px solid ${searchFocused ? C.ac : C.bd}`,
                background: C.bgAlt,
                transition: "border-color 0.15s",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.txD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  style={{
                    border: "none", outline: "none", background: "transparent",
                    fontSize: 13, fontFamily: F.b, color: C.tx, width: "100%",
                  }}
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); }} style={{
                    background: "none", border: "none", cursor: "pointer", color: C.txD,
                    fontSize: 14, padding: 0, lineHeight: 1, flexShrink: 0,
                  }}>✕</button>
                )}
              </div>

              {searchFocused && searchQuery.trim().length > 0 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                  background: C.w, border: `1px solid ${C.bd}`, borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(15,23,42,0.12)", maxHeight: 320,
                  overflowY: "auto", zIndex: 200,
                }}>
                  {searchResults.length === 0 ? (
                    <div style={{ padding: "16px 14px", fontSize: 13, color: C.txD, textAlign: "center" }}>
                      No results for "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSearchSelect(r.id)}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "10px 14px", border: "none", background: "transparent",
                          cursor: "pointer", borderBottom: `1px solid ${C.bd}`,
                          fontSize: 13, fontFamily: F.b, color: C.tx,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = C.acBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ fontWeight: 600 }}>{r.label}</div>
                        <div style={{ fontSize: 11, color: C.txD, marginTop: 2, fontFamily: F.m }}>{r.group}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <div style={{ marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href="https://calendly.com/voicera/demo"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center",
                padding: isMobile ? "6px 10px" : "7px 14px", borderRadius: 8,
                background: C.ac, color: "#fff",
                fontSize: isMobile ? 11.5 : 12.5, fontWeight: 600, fontFamily: F.b,
                textDecoration: "none", border: "none",
                boxShadow: "0 1px 3px rgba(37,99,235,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              Book a Demo
            </a>
            {!isMobile && (
              <a
                href="/#pricing"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 8,
                  background: C.w, color: C.txM,
                  fontSize: 12.5, fontWeight: 500, fontFamily: F.b,
                  textDecoration: "none",
                  border: `1px solid ${C.bd}`,
                  whiteSpace: "nowrap",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.txM; e.currentTarget.style.color = C.tx; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.bd; e.currentTarget.style.color = C.txM; }}
              >
                Play in the Sandbox
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* Mobile search row */}
        {isMobile && (
          <div ref={searchRef} style={{ position: "relative", padding: "0 12px 8px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 12px", borderRadius: 8,
              border: `1px solid ${searchFocused ? C.ac : C.bd}`,
              background: C.bgAlt,
              transition: "border-color 0.15s",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.txD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                style={{
                  border: "none", outline: "none", background: "transparent",
                  fontSize: 13, fontFamily: F.b, color: C.tx, width: "100%",
                }}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); }} style={{
                  background: "none", border: "none", cursor: "pointer", color: C.txD,
                  fontSize: 14, padding: 0, lineHeight: 1, flexShrink: 0,
                }}>✕</button>
              )}
            </div>

            {searchFocused && searchQuery.trim().length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 2px)", left: 12, right: 12,
                background: C.w, border: `1px solid ${C.bd}`, borderRadius: 10,
                boxShadow: "0 8px 24px rgba(15,23,42,0.12)", maxHeight: 280,
                overflowY: "auto", zIndex: 200,
              }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: "16px 14px", fontSize: 13, color: C.txD, textAlign: "center" }}>
                    No results for "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSearchSelect(r.id)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "10px 14px", border: "none", background: "transparent",
                        cursor: "pointer", borderBottom: `1px solid ${C.bd}`,
                        fontSize: 13, fontFamily: F.b, color: C.tx,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.acBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ fontWeight: 600 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: C.txD, marginTop: 2, fontFamily: F.m }}>{r.group}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* ── SIDEBAR ── */}
        {sb && (
          <>
            {/* Mobile overlay backdrop */}
            {isMobile && (
              <div
                onClick={() => setSb(false)}
                style={{
                  position: "fixed", inset: 0, top: 94,
                  background: "rgba(0,0,0,0.3)", zIndex: 49,
                }}
              />
            )}
            <nav style={{
              width: 250, minWidth: 250, flexShrink: 0,
              borderRight: `1px solid ${C.bd}`,
              background: C.w,
              overflowY: "auto", padding: "20px 0",
              ...(isMobile ? { position: "fixed", top: 94, left: 0, bottom: 0, zIndex: 50, boxShadow: "4px 0 12px rgba(0,0,0,0.1)" } : {}),
            }}>
              {groups.map(g => (
                <div key={g} style={{ marginBottom: 22 }}>
                  <div style={{
                    padding: "0 20px", marginBottom: 8,
                    fontSize: 16, fontWeight: 800, fontFamily: F.b,
                    color: "#000000", textTransform: "uppercase", letterSpacing: "0.04em",
                  }}>{g}</div>
                  {NAV.filter(n => n.g === g).map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleNavSelect(n.id)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "8px 20px",
                        background: page === n.id ? C.acBg : "transparent",
                        border: "none",
                        borderLeft: page === n.id ? `3px solid ${C.ac}` : "3px solid transparent",
                        color: page === n.id ? C.ac : C.txM,
                        fontSize: 13.5, fontFamily: F.b,
                        fontWeight: page === n.id ? 600 : 400,
                        cursor: "pointer",
                        borderRadius: 0,
                      }}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </>
        )}

        {/* ── CONTENT ── */}
        <main style={{
          flex: 1, overflowY: "auto",
          padding: isMobile ? "20px 12px 60px" : "40px 52px 80px",
          maxWidth: 880,
          background: C.bgAlt,
        }}>
          <div style={{
            background: C.w,
            borderRadius: 14,
            border: `1px solid ${C.bd}`,
            padding: isMobile ? "20px 16px" : "40px 44px",
            boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
          }}>
            <Pg />
          </div>

          {/* ── PAGINATION ── */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 20, padding: "16px 0",
          }}>
            {(() => {
              const idx = NAV.findIndex(n => n.id === page);
              const prev = idx > 0 ? NAV[idx - 1] : null;
              const next = idx < NAV.length - 1 ? NAV[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <button onClick={() => setPage(prev.id)} style={{
                      background: C.w, border: `1px solid ${C.bd}`,
                      color: C.txM, cursor: "pointer", fontSize: 13, fontFamily: F.b,
                      padding: "8px 16px", borderRadius: 8,
                    }}>{"\u2190 " + prev.label}</button>
                  ) : <div />}
                  {next ? (
                    <button onClick={() => setPage(next.id)} style={{
                      background: C.ac, border: "none",
                      color: C.w, cursor: "pointer", fontSize: 13, fontFamily: F.b,
                      fontWeight: 600, padding: "8px 16px", borderRadius: 8,
                    }}>{next.label + " \u2192"}</button>
                  ) : <div />}
                </>
              );
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}
