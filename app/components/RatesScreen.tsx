"use client";

export default function RatesScreen() {
  return (
    <div style={{ padding: "52px 20px 100px" }}>
      <h2 className="fade-up" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
        Current Rates
      </h2>
      <p className="fade-up fade-up-1" style={{ color: "#6B7280", fontSize: 15, marginBottom: 32 }}>
        Check today's exchange rates and see how much your savings are earning.
      </p>

      {/* Exchange Rates */}
      <div className="fade-up fade-up-1" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
          EXCHANGE RATES (USD / GHS)
        </h3>
        <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #E5E4DF", display: "flex", gap: 16 }}>
          <div style={{ flex: 1, background: "#F7F6F2", borderRadius: 16, padding: "16px", textAlign: "center" }}>
            <p style={{ color: "#6B7280", fontSize: 12, letterSpacing: 0.5, marginBottom: 4 }}>WE BUY AT</p>
            <p style={{ color: "#111", fontSize: 24, fontWeight: 800 }}>₵9.50</p>
            <p style={{ color: "#1A472A", fontSize: 11, fontWeight: 600, marginTop: 4 }}>Per $1.00</p>
          </div>
          <div style={{ flex: 1, background: "#EEF7F1", borderRadius: 16, padding: "16px", border: "1px solid rgba(26,71,42,0.15)", textAlign: "center" }}>
            <p style={{ color: "#1A472A", fontSize: 12, letterSpacing: 0.5, marginBottom: 4 }}>WE SELL AT</p>
            <p style={{ color: "#1A472A", fontSize: 24, fontWeight: 800 }}>₵10.00</p>
            <p style={{ color: "#1A472A", fontSize: 11, fontWeight: 600, marginTop: 4 }}>Per $1.00</p>
          </div>
        </div>
      </div>

      {/* Normal Vaults */}
      <div className="fade-up fade-up-2" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
          NORMAL VAULTS
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { title: "Flexible Savings", apy: "6.5%", description: "Withdraw anytime, zero penalties." },
            // { title: "3-Month Lock", apy: "9.2%", description: "Higher yield for committed capital." },
            // { title: "6-Month Lock", apy: "12.0%", description: "Maximum stable returns." },
          ].map((rate, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #E5E4DF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", marginBottom: 2 }}>{rate.title}</p>
                <p style={{ fontSize: 13, color: "#6B7280" }}>{rate.description}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 24, fontWeight: 800, color: "#22C55E", letterSpacing: -1 }}>{rate.apy}</p>
                <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700 }}>APY</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gamified Pools Historical ROI */}
      <div className="fade-up fade-up-3">
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
          GAMIFIED POOLS
        </h3>
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #E5E4DF" }}>
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20, lineHeight: 1.5 }}>
            Gamified pools have variable returns since a single winner takes the collective yield. Here is the <strong>projected ROI</strong> for winners:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E5E4DF", paddingBottom: 16 }}>
              <span style={{ fontWeight: 600, color: "#111", fontSize: 15 }}>Weekly Prize</span>
              <span style={{ fontWeight: 800, color: "#1A472A", fontSize: 15 }}>~480% ROI</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #E5E4DF", paddingBottom: 16 }}>
              <span style={{ fontWeight: 600, color: "#111", fontSize: 15 }}>Monthly Mega Draw</span>
              <span style={{ fontWeight: 800, color: "#1A472A", fontSize: 15 }}>~1,200% ROI</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, color: "#111", fontSize: 15 }}>Quarterly Jackpot</span>
              <span style={{ fontWeight: 800, color: "#1A472A", fontSize: 15 }}>~3,500% ROI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
