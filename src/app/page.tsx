'use client';
import { useState, useEffect } from "react";
import { Tabs } from "../components/Tabs";
import { Header } from "../components/Header";
import { UploadSecretsTab } from "../components/UploadSecretsTab";
import { ManageSecretsTab } from "../components/ManageSecretsTab";
import { UseSecretsTab } from "../components/UseSecretsTab";
import { ConnectWalletButton } from "../components/auth/connect-wallet-button";

const TABS = [
  { key: "upload", label: "Upload Secrets", component: <UploadSecretsTab /> },
  { key: "manage", label: "Manage Secrets", component: <ManageSecretsTab /> },
  { key: "use", label: "Use Secrets in Your Code", component: <UseSecretsTab /> },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [selectedTab, setSelectedTab] = useState(TABS[0].key);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentTab = TABS.find((tab) => tab.key === selectedTab);

  // Don't render anything until we're on the client
  if (!isClient) {
    return <div className="flex min-h-screen h-screen bg-gradient" />;
  }

  return (
    <div className="flex min-h-screen h-screen bg-gradient">
      <Header bottom={<ConnectWalletButton />}>
        <Tabs
          tabs={TABS}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </Header>
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 w-full h-full text-center text-lg text-foreground font-bold tracking-wider p-0 m-0 min-h-0">
          {currentTab?.component}
        </div>
      </main>
    </div>
  );
}
