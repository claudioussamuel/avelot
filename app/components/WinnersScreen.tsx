"use client";
import Avatar from "./Avatar";

const winners = [
  { name: "Amaka O.", amount: "$87,200", date: "Mar 25", avatar: "AO", location: "Lagos" },
  { name: "Kofi A.", amount: "$61,500", date: "Mar 18", avatar: "KA", location: "Accra" },
  { name: "Fatou D.", amount: "$74,800", date: "Mar 11", avatar: "FD", location: "Dakar" },
  { name: "Emeka N.", amount: "$52,300", date: "Mar 4", avatar: "EN", location: "Abuja" },
  { name: "Ama S.", amount: "$68,100", date: "Feb 25", avatar: "AS", location: "Kumasi" },
];

export default function WinnersScreen() {
  return (
    <div style={{ padding: "52px 20px 100px" }}>
      <h2 className="fade-up" style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>
        Past Winners
      </h2>
      <p className="fade-up fade-up-1" style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>
        Real people, real prizes — zero losses
      </p>

      {/* Stats banner */}
      <div
        className="fade-up fade-up-2"
        style={{
          background: "linear-gradient(135deg, #1A472A, #2D6A4F)",
          borderRadius: 20,
          padding: "24px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: -20, right: -20,
            width: 100, height: 100,
            borderRadius: "50%",
            background: "rgba(212,168,83,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -30, left: 60,
            width: 80, height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, letterSpacing: 1, marginBottom: 4 }}>TOTAL PAID OUT</p>
        <p style={{ color: "#fff", fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>$3,715,200</p>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{
            background: "#EEF7F1", color: "#1A472A",
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          }}>
            482 participants
          </span>
          <span style={{
            background: "rgba(212,168,83,0.2)", color: "#D4A853",
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
          }}>
            0 losses ever
          </span>
        </div>
      </div>

      {/* Winners list */}
      <div className="fade-up fade-up-3" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {winners.map((w, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "16px 18px",
              border: "1px solid #E5E4DF",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Avatar initials={w.avatar} size={44} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{w.name}</p>
              <p style={{ fontSize: 12, color: "#6B7280" }}>
                {w.location} · Week of {w.date}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontWeight: 800, fontSize: 16, color: "#1A472A", marginBottom: 2 }}>{w.amount}</p>
              <p style={{ fontSize: 11, color: "#22C55E" }}>Prize won ✓</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust footer */}
      <div
        className="fade-up fade-up-4"
        style={{
          marginTop: 20,
          background: "#F7F6F2",
          borderRadius: 16,
          padding: "16px 18px",
          border: "1px solid #E5E4DF",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          Every winner kept their original deposit.{" "}
          <strong style={{ color: "#1A472A" }}>Nobody ever lost money on SusuWin.</strong>
        </p>
      </div>
    </div>
  );
}
