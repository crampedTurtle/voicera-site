const streamContent = `POST /v1/analyze_stream { "stream_id": "call_8x92" }  →  Analyzing Audio (400Hz–2kHz)  →  Analyzing Micro-Expressions (FACS)  →  Fusion Layer  →  { "credibility_score": 0.98, "risk_flag": false, "intent": "sincere" }  →  Response 200 OK`;

const ApiStreamBar = () => (
  <div className="w-full overflow-hidden bg-[hsl(var(--foreground))] py-2.5 select-none">
    <div className="animate-marquee whitespace-nowrap font-mono text-[11px] tracking-wide text-[hsl(var(--muted-foreground))]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="inline-block">
          {streamContent.split("→").map((segment, j, arr) => {
            const trimmed = segment.trim();
            const isResult = trimmed.startsWith("{") && trimmed.includes("credibility_score");
            const isStatus = trimmed.startsWith("Response 200");
            return (
              <span key={j}>
                {isResult ? (
                  <span className="text-emerald-400/80">{trimmed}</span>
                ) : isStatus ? (
                  <span className="text-emerald-400/60">{trimmed}</span>
                ) : (
                  <span className="text-white/30">{trimmed}</span>
                )}
                {j < arr.length - 1 && (
                  <span className="text-white/15 mx-3">→</span>
                )}
              </span>
            );
          })}
          <span className="text-white/10 mx-6">|</span>
        </span>
      ))}
    </div>
  </div>
);

export default ApiStreamBar;
