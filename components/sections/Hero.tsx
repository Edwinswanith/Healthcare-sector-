import { hero } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Arrow } from "@/components/ui/Arrow";
import { Roll } from "@/components/ui/Roll";
import { Stroke } from "@/components/ui/Headline";
import { Script } from "@/components/ui/Script";
import { HeroPortraitGL } from "@/components/motion/HeroPortraitGL";

/**
 * Homepage-style hero: one sticky full-viewport stage. Giant type sits behind
 * the AI-generated presenter (matte alpha), the cursor reveals an X-ray
 * anatomy layer, scroll opens it fully before the Media Frame takeover.
 */
export function Hero() {
  const [l1, l2] = hero.headline.lead;
  return (
    <section id="hero" className="s s-hero" data-theme="paper" data-field="drift" aria-labelledby="hero-title">
      <div className="hero-wrap">
        <div className="hero-stage">
          <h1 id="hero-title" className="hl hl--hero" data-reveal>
            <span className="hl-line hl-line--a"><span className="hl-in">{l1}</span></span>{" "}
            <span className="hl-line hl-line--b"><span className="hl-in">{l2}</span></span>{" "}
            <em className="hl-accent hero-accent">{hero.headline.accent}<Stroke /></em>
          </h1>
          <HeroPortraitGL className="hero-portrait" />
          <p className="mono hero-ai" data-hero-fade>AI-generated presenter · not a real clinician</p>
          <p className="mono hero-hint" data-hero-fade aria-hidden="true"><span>Move to look inside</span></p>

          <div className="hero-card" data-hero-fade>
            <div className="hero-card__head mono">
              <span><i className="dot" aria-hidden="true" />Now showing</span>
              <span>{hero.frameLabels[0]}</span>
            </div>
            <div className="slot slot--hero" data-frame-slot="browser" data-frame-variant="procedure" data-frame-radius="10">
              <FrameStatic state="browser" variant="procedure" />
            </div>
          </div>

          <div className="hero-sign">
            <Script name="madeclear" className="script--hero" />
            <p className="lede" data-hero-fade>{hero.body}</p>
            <div className="ctas" data-hero-fade>
              <a className="btn btn--signal" href={hero.primary.href}><Roll>{hero.primary.label}</Roll><Arrow /></a>
              <a className="btn btn--ghost" href={hero.secondary.href}><Roll>{hero.secondary.label}</Roll><Arrow /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
