"use client";
import { useState } from "react";

const presets = ["2000", "5000", "10000", "20000"];

export default function DepositScreen() {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [deposited, setDeposited] = useState(false);
  const [depositType, setDepositType] = useState<"gamified" | "normal">("gamified");
  const [raffleDuration, setRaffleDuration] = useState("weekly");

  const num = Number(amount);
  const poolSizes = { weekly: 4820000, "1month": 18500000, "3month": 45000000, "6month": 120000000 };
  const currentPoolSize = poolSizes[raffleDuration as keyof typeof poolSizes];
  const odds = num > 0 ? Math.max(1, Math.round(currentPoolSize / num)) : null;

  function handleDeposit() {
    if (!num) return;
    setDeposited(true);
    setTimeout(() => setDeposited(false), 3000);
  }

  return (
    <div style={{ padding: "52px 20px 100px" }}>
      <h2 className="fade-up" style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>
        Select Vault
      </h2>
      <p className="fade-up fade-up-1" style={{ color: "#6B7280", fontSize: 14, marginBottom: 20 }}>
        Choose how you want to grow your savings
      </p>

      {/* Vault Type Toggle */}
      <div className="fade-up fade-up-1" style={{ display: "flex", background: "#E5E4DF", borderRadius: 12, padding: 4, marginBottom: 24 }}>
        <button
          onClick={() => setDepositType("gamified")}
          style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none",
            background: depositType === "gamified" ? "#fff" : "transparent",
            color: depositType === "gamified" ? "#1A472A" : "#6B7280",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          Gamified Pool
        </button>
        <button
          onClick={() => setDepositType("normal")}
          style={{
            flex: 1, padding: "10px", borderRadius: 10, border: "none",
            background: depositType === "normal" ? "#fff" : "transparent",
            color: depositType === "normal" ? "#1A472A" : "#6B7280",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
          }}
        >
          Normal Vault
        </button>
      </div>

      {depositType === "gamified" && (
        <div className="fade-up fade-up-1" style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 24, paddingBottom: 4 }}>
          {["weekly", "1month", "3month", "6month"].map((dur) => {
            const labels = { weekly: "Weekly", "1month": "1 Month", "3month": "3 Months", "6month": "6 Months" };
            const isSel = raffleDuration === dur;
            return (
              <button
                key={dur}
                onClick={() => setRaffleDuration(dur)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: `1px solid ${isSel ? "#1A472A" : "#E5E4DF"}`,
                  background: isSel ? "#EEF7F1" : "#fff",
                  color: isSel ? "#1A472A" : "#6B7280",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {labels[dur as keyof typeof labels]}
              </button>
            )
          })}
        </div>
      )}

      {/* Amount input */}
      <div
        className="fade-up fade-up-2"
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 20,
          border: "1px solid #E5E4DF",
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 12, color: "#6B7280", letterSpacing: 1, marginBottom: 12 }}>ENTER AMOUNT</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#6B7280" }}>$</span>
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setSelected(null); }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 36,
              fontWeight: 800,
              color: "#111",
              background: "transparent",
              fontFamily: "inherit",
              letterSpacing: -1,
            }}
          />
        </div>
        <div style={{ height: 2, background: "#E5E4DF", marginTop: 12 }} />
        <p style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, marginTop: 10 }}>
          ✓ Fully refundable — this is not a lottery fee
        </p>
      </div>

      {/* Presets */}
      <div
        className="fade-up fade-up-3"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}
      >
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => { setSelected(p); setAmount(p); }}
            style={{
              padding: "14px",
              borderRadius: 14,
              border: `2px solid ${selected === p ? "#1A472A" : "#E5E4DF"}`,
              background: selected === p ? "#EEF7F1" : "#fff",
              color: selected === p ? "#1A472A" : "#111",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            ${Number(p).toLocaleString()}
          </button>
        ))}
      </div>

      {/* Dynamic preview based on type */}
      {num > 0 && (
        <div
          className="fade-up"
          style={{
            background: "#EEF7F1",
            borderRadius: 16,
            padding: "14px 18px",
            marginBottom: 20,
            border: "1px solid rgba(26,71,42,0.15)",
          }}
        >
          {depositType === "gamified" ? (() => {
            const prizePools = { weekly: "$96,400", "1month": "$1,480,000", "3month": "$10,800,000", "6month": "$57,600,000" };
            const drawsIn = { weekly: "3d 14h 22m", "1month": "14d 2h", "3month": "64d 10h", "6month": "155d" };
            return (
              <>
                <p style={{ fontSize: 13, color: "#1A472A" }}>
                  <strong>Your estimated chances:</strong> 1 in {odds} this draw
                </p>
                <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                  Prize pool: {prizePools[raffleDuration as keyof typeof prizePools]} · Draw in {drawsIn[raffleDuration as keyof typeof drawsIn]}
                </p>
              </>
            );
          })() : (
            <>
              <p style={{ fontSize: 13, color: "#1A472A" }}>
                <strong>Estimated yearly yield:</strong> ${(num * 0.065).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                Earn 6.5% APY · Auto-compounds daily
              </p>
            </>
          )}
        </div>
      )}

      <button
        className="fade-up fade-up-4"
        onClick={handleDeposit}
        style={{
          width: "100%",
          background: num > 0 ? (deposited ? "#22C55E" : "#1A472A") : "#E5E4DF",
          color: num > 0 ? "#fff" : "#6B7280",
          border: "none",
          borderRadius: 16,
          padding: "16px",
          fontSize: 16,
          fontWeight: 700,
          cursor: num > 0 ? "pointer" : "default",
          fontFamily: "inherit",
          letterSpacing: 0.3,
          transition: "all 0.2s",
        }}
      >
        {deposited
          ? "✓ Deposited successfully!"
          : num > 0
          ? `Deposit $${num.toLocaleString()}`
          : "Enter an amount"}
      </button>

      <p style={{ textAlign: "center", fontSize: 12, color: "#6B7280", marginTop: 16 }}>
        🔒 Secured on-chain · No custody risk
      </p>
    </div>
  );
}
