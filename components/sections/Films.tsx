import { films } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Arrow } from "@/components/ui/Arrow";
import { Eyebrow, Headline } from "@/components/ui/Headline";
import { FilmStrip } from "./FilmStrip";

export function Films() {
  return (
    <section id="films" className="s s-films" data-theme="ink" data-field="drift" aria-labelledby="films-title">
      <div className="films-head">
        <div className="films-copy">
          <Eyebrow>{films.eyebrow}</Eyebrow>
          <div id="films-title"><Headline h={films.headline} /></div>
          <p className="body-l">{films.body}</p>
        </div>
        <div className="films-player">
          <div className="slot slot--film" data-frame-slot="film" data-frame-radius="10">
            <FrameStatic state="film" />
          </div>
          <p className="mono films-now"><span>{films.nowShowing}</span>Gallstones and robotic gallbladder removal · concept preview</p>
        </div>
      </div>
      <div className="films-stats">
        {films.stats.map((s) => (
          <div key={s.value} className="stat" data-stat>
            <span className="stat-value" data-stat-value>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="strip-stage" data-strip-stage>
        <div className="strip-sticky">
          <p className="mono strip-hint">{films.hint}</p>
          <FilmStrip />
        </div>
      </div>
      <div className="films-close">
        <p className="body-l">{films.closing}</p>
        <div className="ctas">
          {films.ctas.map((c, i) => (
            <a key={c.label} className={`btn ${i === 0 ? "btn--signal" : "btn--ghost"}`} href={c.href}>{c.label}<Arrow /></a>
          ))}
        </div>
      </div>
    </section>
  );
}
