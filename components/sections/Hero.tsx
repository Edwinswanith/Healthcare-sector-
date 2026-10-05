import { hero } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Arrow } from "@/components/ui/Arrow";
import { Headline } from "@/components/ui/Headline";

export function Hero() {
  return (
    <section id="hero" className="s s-hero" data-theme="paper" data-field="body" aria-labelledby="hero-title">
      <div className="hero-top">
        <p className="eyebrow hero-eyebrow" data-hero-fade>
          {hero.eyebrow.map((e, i) => (
            <span key={e}>{i > 0 ? <i aria-hidden="true">·</i> : null}{e}</span>
          ))}
        </p>
        <div id="hero-title">
          <Headline h={hero.headline} as="h1" className="hl--hero" />
        </div>
      </div>
      <div className="hero-bottom">
        <div className="hero-copy">
          <p className="lede" data-hero-fade>{hero.body}</p>
          <div className="ctas" data-hero-fade>
            <a className="btn btn--signal" href={hero.primary.href}>{hero.primary.label}<Arrow /></a>
            <a className="btn btn--ghost" href={hero.secondary.href}>{hero.secondary.label}<Arrow /></a>
          </div>

        </div>
        <div className="hero-media">
          <div className="slot slot--hero" data-frame-slot="browser" data-frame-variant="procedure" data-frame-radius="14">
            <FrameStatic state="browser" variant="procedure" />
          </div>
          <ul className="hero-labels mono" data-hero-fade>
            {hero.frameLabels.map((l, i) => (
              <li key={l}><span>0{i + 1}</span>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
