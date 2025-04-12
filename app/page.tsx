"use client";

import Hero1 from "@/components/heros/hero1/hero1";
import Hero2 from "@/components/heros/hero2/hero2";
import Hero3 from "@/components/heros/hero3/hero3";
import Hero4 from "@/components/heros/hero4/hero4";

export default function HomePage() {
  // State to control which image is in front

  
  return (
    <main className="flex flex-col items-center justify-center bg-[#030D21] text-white overflow-hidden">
      <Hero1 />
      <Hero2 />
      <Hero4 />
      <Hero3 />
    </main>
  );
}