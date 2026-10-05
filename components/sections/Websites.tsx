import { websites } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Eyebrow, Headline } from "@/components/ui/Headline";
import { SpecialtyPicker } from "./SpecialtyPicker";
import { Interlude } from "./Interlude";
import { Script } from "@/components/ui/Script";

export function Websites() {
  const g = websites.geo;
  return (
    <section id="websites" className="s s-websites" data-theme="paper" data-field="drift" aria-labelledby="websites-title">
      <div className="stage-wrap">
      <div className="stage stage--web">
        <div className="web-copy">
          <Eyebrow>{websites.eyebrow}</Eyebrow>
          <div id="websites-title"><Headline h={websites.headline} /></div>
          <p className="body-l">{websites.body}</p>
          <SpecialtyPicker />
        </div>
        <div className="slot slot--web" data-frame-slot="browser" data-frame-variant="home" data-frame-radius="16">
          <FrameStatic state="browser" />
        </div>
      </div>
      </div>

      <Interlude id="g-phone" word="Asked." alt="Generated illustration: hands holding a phone at night, watching a medical explainer" />
      <div className="geo" id="geo">
        <div className="geo-head">
          <Eyebrow>{g.eyebrow}</Eyebrow>
          <p className="geo-lead">{g.lead}</p>
          <p className="mono geo-def">GEO: generative engine optimisation</p>
          <Script name="found" className="script--geo" />
        </div>
        <figure className="geo-card" data-tilt>
          <div className="geo-q"><span className="mono">A patient asks</span><p>{g.question}</p></div>
          <div className="geo-a">
            <span className="mono">The assistant answers</span>
            <p>{g.answer}<sup className="geo-cite">1</sup></p>
            <p className="geo-source mono"><span className="geo-cite">1</span>{g.citation.site} · {g.citation.title}</p>
          </div>
          <figcaption className="mono geo-caption">{g.caption}</figcaption>
        </figure>
        <ol className="geo-principles">
          {g.principles.map((p) => (
            <li key={p.index} data-geo-chip><span className="mono">{p.index}</span><h3>{p.title}</h3></li>
          ))}
        </ol>
      </div>
      <div className="marquee" aria-hidden="true" data-marquee>
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k}>Cardiology · Orthopaedics · Neurology · Ophthalmology · Respiratory · Upper GI · Urology · Colorectal · Spinal · ENT · Hand · Private GP ·&nbsp;</span>
          ))}
        </div>
      </div>
    </section>
  );
}
