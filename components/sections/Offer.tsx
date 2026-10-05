import { offer } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow, Headline } from "@/components/ui/Headline";

export function Offer() {
  return (
    <section id="offer" className="s s-offer" data-theme="paper" data-field="drift" aria-labelledby="offer-title">
      <div className="stage stage--offer">
        <div className="offer-copy">
          <Eyebrow>{offer.eyebrow}</Eyebrow>
          <div id="offer-title"><Headline h={offer.headline} /></div>
          <ol className="svc-list">
            {offer.services.map((s, i) => (
              <li key={s.index} className="svc" data-svc={i}>
                <span className="svc-index mono">{s.index}</span>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-body">{s.body}</p>
                <a className="link" href={s.link.href}>{s.link.label}<Arrow /></a>
              </li>
            ))}
          </ol>
          <div className="svc-meter" aria-hidden="true"><span /></div>
        </div>
        <div className="slot slot--offer" data-frame-slot="offer" data-frame-states="browser,film,presenter,short" data-frame-variant="home" data-frame-radius="22">
          <FrameStatic state="browser" />
        </div>
      </div>
    </section>
  );
}
