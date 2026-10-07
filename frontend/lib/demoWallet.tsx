"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { encodeFunctionData } from "viem";
import { ARTLEDGER_ADDRESS, ARTLEDGER_ABI } from "./contract";
import { ROLES } from "./constants";
import { toast } from "sonner";

export interface DemoPersona {
  id: string;
  name: string;
  roleTitle: string;
  roleName: "Admin" | "Gallery" | "Restorer" | "Appraiser" | "Artist";
  roleHash: `0x${string}`;
  address: `0x${string}`;
  balance: string;
  description: string;
  badgeColor: string;
  iconName: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "admin",
    name: "Eleanor Vance",
    roleTitle: "Master Curator & Deployer",
    roleName: "Admin",
    roleHash: ROLES.DEFAULT_ADMIN,
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    balance: "10,000.00 ETH",
    description: "Root contract administrator. Full governance rights to grant institutional roles, mint artworks, and oversee the immutable provenance ledger.",
    badgeColor: "amber",
    iconName: "ShieldAlert",
  },
  {
    id: "gallery",
    name: "Galerie Louvre Contemporary",
    roleTitle: "Certified Fine Art Gallery",
    roleName: "Gallery",
    roleHash: ROLES.GALLERY,
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    balance: "10,000.00 ETH",
    description: "Authorized cultural institution credentialed to register secondary acquisitions, exhibition loans, and physical custody transfers.",
    badgeColor: "blue",
    iconName: "Landmark",
  },
  {
    id: "restorer",
    name: "Dr. Julian Croft",
    roleTitle: "Senior Art Conservator & Restorer",
    roleName: "Restorer",
    roleHash: ROLES.RESTORER,
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    balance: "10,000.00 ETH",
    description: "Forensic laboratory specialist authorized to submit chemical stabilization logs, condition inspection reports, and conservation records.",
    badgeColor: "emerald",
    iconName: "Hammer",
  },
  {
    id: "appraiser",
    name: "Sotheby's Heritage Appraisals",
    roleTitle: "Master Appraiser & Valuation Specialist",
    roleName: "Appraiser",
    roleHash: ROLES.APPRAISER,
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    balance: "10,000.00 ETH",
    description: "Accredited valuation authority certified to attest market valuations, physical authenticity audits, and insurance ratings.",
    badgeColor: "yellow",
    iconName: "BadgeDollarSign",
  },
  {
    id: "artist",
    name: "Aria Thorne",
    roleTitle: "Genesis Fine Artist",
    roleName: "Artist",
    roleHash: ROLES.ARTIST,
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    balance: "10,000.00 ETH",
    description: "Verified artwork creator. Authorized to mint original artworks, anchor physical image SHA-256 hashes, and bind decentralized IPFS metadata.",
    badgeColor: "purple",
    iconName: "Palette",
  },
];

interface DemoWalletContextType {
  isDemoMode: boolean;
  activePersona: DemoPersona | null;
  demoAddress: `0x${string}` | null;
  allPersonas: DemoPersona[];
  connectDemoWallet: (personaId?: string) => void;
  disconnectDemoWallet: () => void;
  switchDemoPersona: (personaId: string) => void;
  executeDemoTransaction: (params: {
    functionName: string;
    args: any[];
    to?: `0x${string}`;
    value?: bigint;
  }) => Promise<`0x${string}`>;
}

const DemoWalletContext = createContext<DemoWalletContextType>({
  isDemoMode: false,
  activePersona: null,
  demoAddress: null,
  allPersonas: DEMO_PERSONAS,
  connectDemoWallet: () => {},
  disconnectDemoWallet: () => {},
  switchDemoPersona: () => {},
  executeDemoTransaction: async () => "0x0000000000000000000000000000000000000000000000000000000000000000",
});

const DEMO_STORAGE_KEY = "artledger_demo_persona_id";

export function DemoWalletProvider({ children }: { children: React.ReactNode }) {
  const [activePersona, setActivePersona] = useState<DemoPersona | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const syncPersona = () => {
      try {
        let savedId = localStorage.getItem(DEMO_STORAGE_KEY);
        if (!savedId) {
          const storedUser = localStorage.getItem("artledger_user");
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.role) {
              savedId = parsed.role.toLowerCase();
            }
          }
        }
        if (savedId) {
          const found = DEMO_PERSONAS.find((p) => p.id === savedId.toLowerCase());
          if (found) {
            setActivePersona(found);
          }
        } else {
          setActivePersona(null);
        }
      } catch {
        // ignore localStorage errors in private mode
      }
    };

    syncPersona();
    window.addEventListener("storage", syncPersona);
    return () => window.removeEventListener("storage", syncPersona);
  }, []);

  const connectDemoWallet = (personaId: string = "admin") => {
    const selected = DEMO_PERSONAS.find((p) => p.id === personaId) || DEMO_PERSONAS[0];
    setActivePersona(selected);
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, selected.id);
    } catch {
      // ignore
    }
    toast.success(`Connected as ${selected.name} (${selected.roleTitle})`, {
      description: "Virtual Demo Wallet active. No MetaMask extension required.",
    });
  };

  const disconnectDemoWallet = () => {
    setActivePersona(null);
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    } catch {
      // ignore
    }
    toast.info("Virtual Demo Wallet disconnected");
  };

  const switchDemoPersona = (personaId: string) => {
    const selected = DEMO_PERSONAS.find((p) => p.id === personaId);
    if (!selected) return;
    setActivePersona(selected);
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, selected.id);
    } catch {
      // ignore
    }
    toast.success(`Switched persona to ${selected.name} (${selected.roleTitle})`);
  };

  const executeDemoTransaction = async ({
    functionName,
    args,
    to = ARTLEDGER_ADDRESS,
    value = BigInt(0),
  }: {
    functionName: string;
    args: any[];
    to?: `0x${string}`;
    value?: bigint;
  }): Promise<`0x${string}`> => {
    const persona = activePersona || DEMO_PERSONAS[0];

    try {
      const calldata = encodeFunctionData({
        abi: ARTLEDGER_ABI as any,
        functionName: functionName as any,
        args,
      });

      // Attempt to broadcast directly to the local Hardhat node
      const rpcUrl = "http://127.0.0.1:8545";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_sendTransaction",
          params: [
            {
              from: persona.address,
              to,
              data: calldata,
              value: `0x${value.toString(16)}`,
            },
          ],
          id: Date.now(),
        }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.result && typeof json.result === "string") {
          return json.result as `0x${string}`;
        }
      }
    } catch {
      // Node was unreachable or timed out; fall through to realistic simulation
    }

    // Realistic fallback simulation with simulated block confirmation
    await new Promise((res) => setTimeout(res, 750));
    const randomHex = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    return `0x${randomHex}` as `0x${string}`;
  };

  return (
    <DemoWalletContext.Provider
      value={{
        isDemoMode: mounted && activePersona !== null,
        activePersona,
        demoAddress: activePersona ? activePersona.address : null,
        allPersonas: DEMO_PERSONAS,
        connectDemoWallet,
        disconnectDemoWallet,
        switchDemoPersona,
        executeDemoTransaction,
      }}
    >
      {children}
    </DemoWalletContext.Provider>
  );
}

export const useDemoWallet = () => useContext(DemoWalletContext);
