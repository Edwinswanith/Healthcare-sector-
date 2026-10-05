import { footer, packages, presenter, process, social, work, brand } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow, Headline, Stroke } from "@/components/ui/Headline";
import { Wordmark } from "@/components/ui/Wordmark";

export function Presenter() {
  return (
    <section id="presenter" className="s s-presenter" data-theme="ink" data-field="heart" aria-labelledby="presenter-title">
      <div className="split">
        <div className="slot slot--presenter" data-frame-slot="presenter" data-frame-radius="12">
          <FrameStatic state="presenter" />
        </div>
        <div>
          <Eyebrow>{presenter.eyebrow}</Eyebrow>
          <div id="presenter-title"><Headline h={presenter.headline} /></div>
          <p className="body-l">{presenter.body}</p>
          <ol className="ticks">
            {presenter.steps.map((s) => (
              <li key={s.index}><span className="mono">{s.index}</span><h3>{s.title}</h3><p>{s.body}</p></li>
            ))}
          </ol>
          <p className="note">{presenter.disclosure}</p>
          <p className="mono caption">{presenter.caption}</p>
        </div>
      </div>
    </section>
  );
}

export function Social() {
  return (
    <section id="social" className="s s-social" data-theme="ink" data-field="heart" aria-labelledby="social-title">
      <div className="split split--rev">
        <div>
          <Eyebrow>{social.eyebrow}</Eyebrow>
          <div id="social-title"><Headline h={social.headline} /></div>
          <p className="body-l">{social.body}</p>
          <ul className="shorts mono">
            {social.shorts.map((s) => (<li key={s.title}><span>{s.duration} · 9:16</span>{s.title}</li>))}
          </ul>
          <p className="mono caption">{social.caption}</p>
        </div>
        <div className="slot slot--short" data-frame-slot="short" data-frame-radius="22">
          <FrameStatic state="short" />
        </div>
      </div>
      <div className="platforms">
        <h3 className="mono">Where each film goes</h3>
        <table>
          <tbody>
            {social.platforms.map((p) => (
              <tr key={p.name}><th scope="row">{p.name}</th><td>{p.use}</td><td className="mono">{p.format}</td></tr>
            ))}
          </tbody>
        </table>
        <ul className="included">{social.included.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section id="work" className="s s-work" data-theme="paper" data-field="drift" aria-labelledby="work-title">
      <Eyebrow>{work.eyebrow}</Eyebrow>
      <div id="work-title"><Headline h={work.headline} /></div>
      <p className="body-l">{work.body}</p>
      <div className="cases">
        {work.cases.map((c, i) => (
          <article key={c.index} className="case">
            {i === 0 ? (
              <div className="slot slot--case" data-frame-slot="browser" data-frame-variant="home" data-frame-radius="12">
                <FrameStatic state="browser" />
              </div>
            ) : (
              <div className="case-ph" aria-hidden="true"><span>Example layout</span></div>
            )}
            <p className="mono case-meta"><span>{c.index}</span><span>{c.kind}</span><span className="tag">{c.status}</span></p>
            <p className="case-note">{c.note}</p>
          </article>
        ))}
      </div>
      <p className="concepts"><span className="mono">{work.concepts.label}</span> {work.concepts.title} <a className="link" href={work.concepts.link.href}>{work.concepts.link.label}<Arrow /></a></p>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="s s-process" data-theme="paper" data-field="drift" aria-labelledby="process-title">
      <Eyebrow>{process.eyebrow}</Eyebrow>
      <div id="process-title"><Headline h={process.headline} /></div>
      <p className="body-l">{process.body}</p>
      <ol className="steps">
        {process.steps.map((s) => (
          <li key={s.index}><span className="mono">{s.index}</span><h3>{s.title}</h3><p>{s.body}</p></li>
        ))}
      </ol>
      <ul className="safeguards mono">{process.safeguards.map((s) => <li key={s}><Stroke className="tick" />{s}</li>)}</ul>
    </section>
  );
}

export function Packages() {
  return (
    <section id="packages" className="s s-packages" data-theme="paper" data-field="drift" aria-labelledby="packages-title">
      <Eyebrow>{packages.eyebrow}</Eyebrow>
      <div id="packages-title"><Headline h={packages.headline} /></div>
      <p className="body-l">{packages.sub}</p>
      <div className="options">
        {packages.options.map((o) => (
          <article key={o.title} className={`option${o.featured ? " option--featured" : ""}`}>
            <p className="mono option-tag">{o.tag}</p>
            <h3>{o.title}</h3>
            <p className="option-fit">{o.fit}</p>
            <ul>{o.items.map((t) => <li key={t}>{t}</li>)}</ul>
            <a className="btn btn--ghost" href={packages.cta.href}>{packages.cta.label}<Arrow /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="s s-footer" data-theme="ink" data-field="heart">
      <div className="footer-panel">
        <span className="mono footer-tab">03:00 / 03:00</span>
        <Eyebrow>{footer.eyebrow}</Eyebrow>
        <Headline h={footer.headline} className="hl--footer" />
        <div className="ctas">
          {footer.ctas.map((c, i) => (
            <a key={c.label} className={`btn ${i === 0 ? "btn--signal" : "btn--ghost"}`} href={c.href}>{c.label}<Arrow /></a>
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
