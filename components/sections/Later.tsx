import { footer, packages, presenter, process, social, work, brand, specialties } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { ShortLayer } from "@/components/frame/Layers";
import { Arrow } from "@/components/ui/Arrow";
import { Roll } from "@/components/ui/Roll";
import { Eyebrow, Headline, Stroke } from "@/components/ui/Headline";
import { Wordmark } from "@/components/ui/Wordmark";
import { ConceptCard } from "./ConceptCard";
import { Interlude, SceneImage } from "./Interlude";

export function Presenter() {
  return (
    <section id="presenter" className="s s-presenter" data-theme="ink" data-field="heart" aria-labelledby="presenter-title">
      <div className="stage-wrap">
        <div className="stage stage--presenter">
          <SceneImage id="g-studio" className="scene-img--presenter" />
          <div className="pres-copy">
            <Eyebrow>{presenter.eyebrow}</Eyebrow>
            <div id="presenter-title"><Headline h={presenter.headline} /></div>
            <p className="body-l">{presenter.body}</p>
            <ol className="chips-row">
              {presenter.steps.map((s) => (
                <li key={s.index} data-pres-step data-hover-img="g-studio"><span className="mono">{s.index}</span>{s.title}</li>
              ))}
            </ol>
            <p className="mono note-s">{presenter.disclosure}</p>
          </div>
          <div className="slot slot--presenter" data-frame-slot="presenter" data-frame-radius="14">
            <FrameStatic state="presenter" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Social() {
  return (
    <section id="social" className="s s-social" data-theme="ink" data-field="heart" aria-labelledby="social-title">
      <div className="stage-wrap">
        <div className="stage stage--social">
          <div className="social-copy">
            <Eyebrow>{social.eyebrow}</Eyebrow>
            <div id="social-title"><Headline h={social.headline} /></div>
            <p className="body-l">{social.body}</p>
          </div>
          <div className="fan" aria-hidden="true">
            <div className="fan-phone fan-phone--l" data-fan="l"><ShortLayer active={false} caption={["Inside", "a heart", "attack"]} organ="chest" meta="00:39" /></div>
            <div className="fan-phone fan-phone--r" data-fan="r"><ShortLayer active={false} caption={["Reopening", "the", "artery"]} organ="body" meta="00:44" /></div>
          </div>
          <div className="slot slot--short" data-frame-slot="short" data-frame-states="film,short" data-frame-radius="22">
            <FrameStatic state="short" />
          </div>
          <ul className="platforms-chips" aria-label="Where each film goes">
            {social.platforms.map((p) => (
              <li key={p.name} data-platform data-hover-img="g-phone"><b>{p.name}</b><span className="mono">{p.format}</span></li>
            ))}
          </ul>
          <ul className="sr-only">
            {social.shorts.map((s) => <li key={s.title}>{s.title}, {s.duration}, 9:16</li>)}
            {social.platforms.map((p) => <li key={p.name}>{p.name}: {p.use}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Work() {
  const cols = [0, 1, 2, 3].map((c) => specialties.filter((_, i) => i % 4 === c));
  return (
    <section id="work" className="s s-work" data-theme="paper" data-field="drift" aria-labelledby="work-title">
      <Interlude id="g-clinic" word="Launched." alt="Generated illustration: a modern clinic building at blue hour" />
      <div className="work-head">
        <Eyebrow>{work.eyebrow}</Eyebrow>
        <div id="work-title"><Headline h={work.headline} /></div>
        <p className="body-l">{work.body}</p>
      </div>
      <div className="cases">
        {work.cases.map((c, i) => (
          <article key={c.index} className="case" data-case>
            {i === 0 ? (
              <div className="slot slot--case" data-frame-slot="browser" data-frame-variant="home" data-frame-radius="12">
                <FrameStatic state="browser" />
              </div>
            ) : (
              <div className="case-ph" aria-hidden="true"><span>Example layout</span></div>
            )}
            <p className="mono case-meta"><span>{c.index}</span><span>{c.kind}</span><span className="tag">{c.status}</span></p>
          </article>
        ))}
      </div>
      <div className="wall-wrap">
        <p className="wall-title"><span className="mono">{work.concepts.label}</span> {work.concepts.title}</p>
        <div className="wall" aria-hidden="true" data-wall>
          {cols.map((col, c) => (
            <div key={c} className="wall-col" data-wall-col={c}>
              {[...col, ...col].map((s, k) => <ConceptCard key={`${s.slug}-${k}`} slug={s.slug} />)}
            </div>
          ))}
        </div>
        <a className="link wall-link" href={work.concepts.link.href}><Roll>{work.concepts.link.label}</Roll><Arrow /></a>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="s s-process" data-theme="paper" data-field="drift" aria-labelledby="process-title">
      <Interlude id="g-hands" word="Checked." alt="Generated illustration: gloved hands holding a tablet showing an anatomy render" />
      <div className="stage-wrap">
        <div className="stage stage--process">
          <div className="proc-head">
            <Eyebrow>{process.eyebrow}</Eyebrow>
            <div id="process-title"><Headline h={process.headline} /></div>
            <p className="body-l">{process.body}</p>
          </div>
          <div className="proc-line" aria-hidden="true">
            <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
              <path className="proc-base" d="M0 60 L1000 60" />
              <path className="proc-sign" d="M0 62 C 80 30, 150 92, 230 58 S 380 22, 460 64 S 610 96, 690 56 S 840 24, 1000 60" />
            </svg>
          </div>
          <ol className="proc-steps">
            {process.steps.map((s, i) => (
              <li key={s.index} data-proc-step={i} data-hover-img={["g-room", "g-hands", "g-phone", "g-studio", "g-clinic"][i]}>
                <span className="proc-num" aria-hidden="true">0{i + 1}</span>
                <span className="proc-dot" aria-hidden="true" />
                <h3>{s.title}</h3>
              </li>
            ))}
          </ol>
          <div className="proc-stamp" aria-hidden="true" data-stamp>
            <span>Approved</span>
            <Stroke className="stamp-stroke" />
          </div>
          <ul className="safeguards mono">{process.safeguards.map((s) => <li key={s} data-safe><Stroke className="tick" />{s}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

export function Packages() {
  return (
    <section id="packages" className="s s-packages" data-theme="paper" data-field="drift" aria-labelledby="packages-title">
      <div className="pack-head">
        <Eyebrow>{packages.eyebrow}</Eyebrow>
        <div id="packages-title"><Headline h={packages.headline} /></div>
        <p className="body-l">{packages.sub}</p>
      </div>
      <div className="options" data-deck>
        {packages.options.map((o, i) => (
          <article key={o.title} className={`option${o.featured ? " option--featured" : ""}`} data-card={i}>
            <p className="mono option-tag">{o.tag}</p>
            <h3>{o.title}</h3>
            <ul>{o.items.map((t) => <li key={t}>{t}</li>)}</ul>
            <a className="btn btn--ghost" href={packages.cta.href}><Roll>{packages.cta.label}</Roll><Arrow /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="s s-footer" data-theme="ink" data-field="heart">
      <SceneImage id="g-room" className="scene-img--footer" />
      <div className="footer-panel" data-footer-panel>
        <span className="mono footer-tab">03:00 / 03:00</span>
        <Eyebrow>{footer.eyebrow}</Eyebrow>
        <Headline h={footer.headline} className="hl--footer" />
        <div className="ctas">
          {footer.ctas.map((c, i) => (
            <a key={c.label} className={`btn ${i === 0 ? "btn--signal" : "btn--ghost"}`} href={c.href}><Roll>{c.label}</Roll><Arrow /></a>
          ))}
        </div>
      </div>
      <div className="footer-bar">
        <div className="footer-brand">
          <Wordmark />
          <p className="mono">{brand.descriptor}</p>
        </div>
        {footer.columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="mono">{c.title}</h2>
            <ul>{c.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
          </nav>
        ))}
        <p className="footer-legal">{footer.legal} {footer.disclaimer}</p>
      </div>
    </footer>
  );
}
