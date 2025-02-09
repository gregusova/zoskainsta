import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = { title: "GDPR | ZoškaSnap" };

const GDPRClient = dynamic(() => import("../../../components/GDRPClient"), {
  ssr: false, // Ensures it's client-side only
});

export default function GDPR() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", textAlign: "center", padding: "20px" }}>
      <div>
        {/* GDPR Text */}
        <h1>Súhlas s ochranou osobných údajov (GDPR)</h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
          Tento dokument vysvetľuje, ako spracovávame a chránime vaše osobné údaje pri používaní našich služieb. Vaše osobné údaje, ako meno, e-mailová adresa a ďalšie informácie, budú spracovávané v súlade s požiadavkami GDPR (Nariadenie o ochrane osobných údajov). 
          Týmto súhlasíte so spracovaním týchto údajov na účely poskytovania našich služieb, zlepšovania používateľskej skúsenosti a zasielania relevantných informácií.
        </p>
        
        {/* Client-side back button */}
        <GDPRClient />
      </div>
    </div>
  );
}