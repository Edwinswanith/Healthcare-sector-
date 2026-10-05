import { websites } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Eyebrow, Headline } from "@/components/ui/Headline";
import { SpecialtyPicker } from "./SpecialtyPicker";

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

      <div className="geo" id="geo">
        <div className="geo-head">
          <Eyebrow>{g.eyebrow}</Eyebrow>
          <p className="geo-lead">{g.lead}</p>
        </div>
        <figure className="geo-card">
          <div className="geo-q"><span className="mono">A patient asks</span><p>{g.question}</p></div>
          <div className="geo-a">
            <span className="mono">The assistant answers</span>
            <p>{g.answer}<sup className="geo-cite">1</sup></p>
            <p className="geo-source mono"><span className="geo-cite">1</span>{g.citation.site} · {g.citation.title}</p>
          </div>
          <figcaption className="mono geo-caption">{g.caption}</figcaption>
        </figure>
        <p className="geo-explainer">{g.explainer}</p>
        <ol className="geo-principles">
          {g.principles.map((p) => (
            <li key={p.index}><span className="mono">{p.index}</span><h3>{p.title}</h3><p>{p.body}</p></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
