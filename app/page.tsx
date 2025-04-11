"use client";

import Hero1 from "@/components/heros/hero1/hero1";
import Hero2 from "@/components/heros/hero2/hero2";

export default function HomePage() {
  // State to control which image is in front

  
  return (
    <main className="flex flex-col items-center justify-center bg-[#030D21] text-white overflow-hidden">
      <Hero1 />
      <Hero2 />
    </main>
  );
}