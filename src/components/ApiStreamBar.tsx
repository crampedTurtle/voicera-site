const streamContent = `POST /v1/analyze_stream { "stream_id": "call_8x92" }  →  Analyzing Audio (400Hz–2kHz)  →  Analyzing Micro-Expressions (FACS)  →  Fusion Layer  →  { "credibility_score": 0.98, "risk_flag": false, "intent": "sincere" }  →  Response 200 OK`;

const ApiStreamBar = () => (
  <div className="w-full overflow-hidden py-2.5 select-none bg-alt">
    <div className="animate-marquee whitespace-nowrap font-mono text-[13px] tracking-wide">
      {[0, 1, 2].map((i) => (
        <span key={i} className="inline-block">
          {streamContent.split("→").map((segment, j, arr) => {
            const trimmed = segment.trim();
            const isResult = trimmed.startsWith("{") && trimmed.includes("credibility_score");
            const isStatus = trimmed.startsWith("Response 200");
            return (
              <span key={j}>
                {isResult ? (
                  <span className="text-[hsl(270,68%,70%)]">{trimmed}</span>
                ) : isStatus ? (
                  <span className="text-[hsl(228,89%,73%)]">{trimmed}</span>
                ) : (
                  <span className="text-[hsl(var(--muted-foreground))/0.5]" style={{ color: "hsla(240,5%,46%,0.5)" }}>{trimmed}</span>
                )}
                {j < arr.length - 1 && (
                  <span style={{ color: "hsla(240,5%,46%,0.25)" }} className="mx-3">→</span>
                )}
              </span>
            );
          })}
          <span style={{ color: "hsla(240,5%,46%,0.2)" }} className="mx-6">|</span>
        </span>
      ))}
    </div>
  </div>
);

export default ApiStreamBar;
