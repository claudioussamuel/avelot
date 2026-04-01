"use client";
import { useState } from "react";
import TabBar from "./components/TabBar";
import HomeScreen from "./components/HomeScreen";
import DepositScreen from "./components/DepositScreen";
import WinnersScreen from "./components/WinnersScreen";
import ProfileScreen from "./components/ProfileScreen";
import RatesScreen from "./components/RatesScreen";

type Tab = "Home" | "Deposit" | "Winners" | "Profile" | "Rates";

export default function Page() {
  const [tab, setTab] = useState<Tab>("Home");

  return (
    <main
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#F7F6F2",
        minHeight: "100vh",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {tab === "Home" && <HomeScreen setTab={setTab} />}
      {tab === "Deposit" && <DepositScreen />}
      {tab === "Winners" && <WinnersScreen />}
      {tab === "Profile" && <ProfileScreen />}
      {tab === "Rates" && <RatesScreen />}
      <TabBar active={tab} setActive={setTab} />
    </main>
  );
}
