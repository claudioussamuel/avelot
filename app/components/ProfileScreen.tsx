"use client";
import Avatar from "./Avatar";

export default function ProfileScreen() {
  return (
    <div style={{ padding: "52px 20px 100px" }}>
      {/* Header Profile Info */}
      <div className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <Avatar initials="CK" size={80} />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: -4,
              background: "#22C55E",
              color: "#fff",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #F7F6F2",
              fontSize: 14,
            }}
          >
            ✓
          </div>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", letterSpacing: -0.5, marginBottom: 4 }}>
          Abby Boamah
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ color: "#6B7280", fontSize: 15, fontWeight: 500 }}>$abbyboamah</p>
          <button
            style={{
              background: "#E5E4DF",
              border: "none",
              borderRadius: 12,
              padding: "4px 10px",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ⚏
          </button>
        </div>
      </div>

      {/* Account Limits / Verification */}
      <div
        className="fade-up fade-up-1"
        style={{
          background: "#EEF7F1",
          borderRadius: 20,
          padding: 18,
          border: "1px solid rgba(26,71,42,0.15)",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: "#1A472A", fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
            TIER 2 VERIFIED
          </p>
          <p style={{ fontSize: 13, color: "#4B5563" }}>
            Daily deposit limit: $5,000,000
          </p>
        </div>
        <div style={{ fontSize: 24 }}>🛡️</div>
      </div>

      {/* Settings Sections */}
      <div className="fade-up fade-up-2" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Payment Methods */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            PAYMENT METHODS
          </h3>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E4DF", overflow: "hidden" }}>
            <SettingRow icon="🏦" title="Linked Banks" subtitle="GTBank **** 4092" />
            <div style={{ height: 1, background: "#E5E4DF", marginLeft: 50 }} />
            <SettingRow icon="💳" title="Debit Cards" subtitle="Add a new card" />
          </div>
        </div>

        {/* Security */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            SECURITY
          </h3>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E4DF", overflow: "hidden" }}>
            <SettingRow icon="🔐" title="Biometrics & PIN" subtitle="Face ID enabled" />
            <div style={{ height: 1, background: "#E5E4DF", marginLeft: 50 }} />
            <SettingRow icon="📱" title="Two-Factor Auth" subtitle="Via Authenticator App" />
            <div style={{ height: 1, background: "#E5E4DF", marginLeft: 50 }} />
            <SettingRow icon="⚖️" title="Transaction Limits" />
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            SUPPORT
          </h3>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E5E4DF", overflow: "hidden" }}>
            <SettingRow icon="🎧" title="Help Center" subtitle="FAQs and guides" />
            <div style={{ height: 1, background: "#E5E4DF", marginLeft: 50 }} />
            <SettingRow icon="💬" title="Chat with Us" subtitle="Typically replies in 5m" />
          </div>
        </div>

        <button
          style={{
            background: "transparent",
            border: "1px solid #FCA5A5",
            color: "#EF4444",
            padding: 16,
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Log Out
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 24 }}>
        SusuWin v1.0.4 (Build 42)
      </p>
    </div>
  );
}

function SettingRow({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        cursor: "pointer",
        background: "#fff",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#F9FAFB")}
      onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ fontSize: 22, width: 24, textAlign: "center" }}>{icon}</div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>{title}</p>
          {subtitle && <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ color: "#D1D5DB", fontSize: 16, fontWeight: 700 }}>›</div>
    </div>
  );
}
