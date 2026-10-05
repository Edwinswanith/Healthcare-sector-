import { films } from "@/content/site";
import { FrameStatic } from "@/components/frame/FrameStatic";
import { Arrow } from "@/components/ui/Arrow";
import { Roll } from "@/components/ui/Roll";
import { Eyebrow, Headline } from "@/components/ui/Headline";
import { FilmStrip } from "./FilmStrip";
import { Interlude } from "./Interlude";

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
          <p className="mono films-now"><span>{films.nowShowing}</span>Concept preview</p>
        </div>
      </div>
      <Interlude id="g-theatre" video="v-theatre" script="plainenglish" word="Explained." alt="Generated illustration: an empty operating theatre under surgical lights" />
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
        <div className="collage" aria-hidden="true" data-collage>
          {[
            ["g-theatre", 0.9, "c1"],
            ["g-edit", 0.45, "c2"],
            ["g-phone", 1.25, "c3"],
            ["g-glassheart", 0.6, "c4"],
            ["g-room", 1.05, "c5"],
          ].map(([id, depth, cls]) => (
            <figure key={id as string} className={`collage-item ${cls}`} data-depth={depth}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/gen/${id}-960.webp`} alt="" width={960} height={536} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
        <p className="body-l">{films.closing}</p>
        <div className="ctas">
          {films.ctas.map((c, i) => (
            <a key={c.label} className={`btn ${i === 0 ? "btn--signal" : "btn--ghost"}`} href={c.href}><Roll>{c.label}</Roll><Arrow /></a>
          ))}
        </div>
      </div>
    </section>
  );
}
