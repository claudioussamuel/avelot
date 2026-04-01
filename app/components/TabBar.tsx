"use client";

type Tab = "Home" | "Deposit" | "Winners" | "Profile" | "Rates";

interface TabBarProps {
  active: Tab;
  setActive: (tab: Tab) => void;
}

const tabs: Tab[] = ["Home", "Deposit", "Winners", "Profile", "Rates"];
const icons: Record<Tab, string> = { Home: "⬡", Deposit: "＋", Winners: "★", Profile: "👤", Rates: "📈" };

export default function TabBar({ active, setActive }: TabBarProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        background: "#fff",
        borderTop: "1px solid #E5E4DF",
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0 24px",
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => {
        const sel = active === tab;
        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: sel ? "#1A472A" : "#6B7280",
              fontFamily: "inherit",
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: 20 }}>{icons[tab]}</span>
            <span style={{ fontSize: 11, fontWeight: sel ? 700 : 400, letterSpacing: 0.5 }}>
              {tab.toUpperCase()}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
