"use client";
import Avatar from "./Avatar";

interface HomeScreenProps {
  setTab: (tab: "Home" | "Deposit" | "Winners") => void;
}

const raffles = [
  { id: "weekly", title: "THIS WEEK'S PRIZE", total: "$4,820,000", prize: "$96,400", myChance: "1 in 482", endsIn: "3d 14h" },
  { id: "1month", title: "MONTHLY MEGA DRAW", total: "$18,500,000", prize: "$1,480,000", myChance: "Not entered", endsIn: "14d 2h" },
  { id: "3month", title: "QUARTERLY JACKPOT", total: "$45,000,000", prize: "$10,800,000", myChance: "Not entered", endsIn: "64d 10h" },
  { id: "6month", title: "HALF-YEAR GRAND PRIZE", total: "$120,000,000", prize: "$57,600,000", myChance: "Not entered", endsIn: "155d" },
];

const userBalances = {
  total: "$35,000",
  gamified: "$10,000",
  normal: "$25,000",
  normalApy: "6.5%",
};

export default function HomeScreen({ setTab }: HomeScreenProps) {
  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="fade-up">
            <p style={{ color: "#6B7280", fontSize: 13, letterSpacing: 1, marginBottom: 2 }}>WELCOME BACK</p>
            <h2 style={{ color: "#111", fontSize: 24, fontWeight: 800 }}>Abby 👋</h2>
          </div>
          <Avatar initials="AB" size={48} />
        </div>

        {/* Total Balance Card */}
        <div
          className="fade-up fade-up-1"
          style={{
            background: "linear-gradient(135deg, #1A472A, #2D6A4F)",
            borderRadius: 24,
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 12px 24px rgba(26,71,42,0.15)",
          }}
        >
          <div
            style={{
              position: "absolute", top: -20, right: -20,
              width: 120, height: 120,
              borderRadius: "50%",
              background: "rgba(212,168,83,0.15)",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: -40, left: 60,
              width: 100, height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>TOTAL BALANCE</p>
            <p style={{ color: "#fff", fontSize: 38, fontWeight: 800, letterSpacing: -1, marginBottom: 24 }}>{userBalances.total}</p>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 4, letterSpacing: 0.5 }}>GAMIFIED POOL 🎯</p>
                <p style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>{userBalances.gamified}</p>
                <p style={{ color: "#D4A853", fontSize: 11, marginTop: 4, fontWeight: 600 }}>Win the yield</p>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 4, letterSpacing: 0.5 }}>NORMAL VAULT 🔒</p>
                <p style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>{userBalances.normal}</p>
                <p style={{ color: "#22C55E", fontSize: 11, marginTop: 4, fontWeight: 600 }}>Earn {userBalances.normalApy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {raffles.map((raffle, idx) => (
          <div
            key={raffle.id}
            className={`fade-up fade-up-${idx + 2}`}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              border: "1px solid #E5E4DF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, color: "#6B7280", letterSpacing: 1, marginBottom: 4 }}>{raffle.title}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#1A472A", letterSpacing: -1 }}>{raffle.prize}</p>
              </div>
              <div
                style={{
                  background: "#D4A853",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 10, opacity: 0.85, marginBottom: 2 }}>DRAW IN</div>
                <div>{raffle.endsIn}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, background: "#F7F6F2", borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Pool Total</p>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{raffle.total}</p>
              </div>
              <div style={{ flex: 1, background: "#F7F6F2", borderRadius: 12, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Your Odds</p>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{raffle.myChance}</p>
              </div>
            </div>

            <button
              onClick={() => setTab("Deposit")}
              style={{
                width: "100%",
                background: "#1A472A",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "14px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: 0.3,
              }}
            >
              Enter Draw →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
