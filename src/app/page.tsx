import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Ecosystem } from "@/components/home/Ecosystem";
import { Capabilities } from "@/components/home/Capabilities";
import { Industries } from "@/components/home/Industries";
import { Approach } from "@/components/home/Approach";
import { Portfolio } from "@/components/home/Portfolio";
import { VentureBuilding } from "@/components/home/VentureBuilding";
import { Partnerships } from "@/components/home/Partnerships";
import { Insights } from "@/components/home/Insights";
import { Newsletter } from "@/components/home/Newsletter";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Ecosystem />
      <Capabilities />
      <Industries />
      <Approach />
      <Portfolio />
      <VentureBuilding />
      <Partnerships />
      <Insights />
      <Newsletter />
      <FinalCta />
    </>
  );
}
