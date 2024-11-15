"use client";
import { WelcomeContent } from "./components/WelcomeContent";
import { Login } from "./components/Login";
import { MedicalResearch } from "./components/MedicalResearch";
import { ComputeOutput } from "./components/ComputeOutput";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full flex flex-col items-center font-mono text-sm">
        <WelcomeContent />
        <Login />
        <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 gap-4 justify-items-center">
            <MedicalResearch />
            <ComputeOutput />
          </div>
        </div>
      </div>
    </main>
  );
}
