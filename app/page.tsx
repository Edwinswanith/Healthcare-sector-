import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import { Websites } from "@/components/sections/Websites";
import { Films } from "@/components/sections/Films";
import { Footer, Packages, Presenter, Process, Social, Work } from "@/components/sections/Later";
import { Preloader } from "@/components/sections/Preloader";
import { MediaFrame } from "@/components/frame/MediaFrame";
import { Choreography } from "@/components/motion/Choreography";
import { HeaderTheme } from "@/components/motion/HeaderTheme";
import { CursorFX } from "@/components/motion/CursorFX";

// Runs before the hero is parsed: hides hero type only when motion will run,
// marks first visits for the loader, and restores everything after 4 s if the
// motion bundle never takes over.
const bootScript = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('js-anim');var s=null;try{s=sessionStorage.getItem('tc-intro')}catch(e){}if(!s)d.classList.add('intro');setTimeout(function(){if(!window.__tcIntroHandled){d.classList.remove('intro','js-anim')}},4000)}catch(e){}})();`;

export default function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      <div className="backdrop" aria-hidden="true" />
      <canvas className="field-canvas" aria-hidden="true" />
      <Preloader />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Offer />
        <Websites />
        <Films />
        <Presenter />
        <Social />
        <Work />
        <Process />
        <Packages />
      </main>
      <Footer />
      <MediaFrame />
      <Choreography />
      <HeaderTheme />
      <CursorFX />
      <div className="scroll-line" aria-hidden="true"><span data-scroll-line /></div>
    </>
  );
}
