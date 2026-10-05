/* eslint-disable @next/next/no-img-element -- pre-encoded responsive WebP, sized by srcSet */
import { Script } from "@/components/ui/Script";
import { InViewVideo } from "./InViewVideo";

/** Full-bleed generated still that opens from a window to the full viewport on scroll. */
export function Interlude({ id, word, alt, video, script }: { id: string; word: string; alt: string; video?: string; script?: string }) {
  return (
    <figure className="interlude" data-interlude>
      <div className="interlude-sticky">
        <div className="interlude-media" data-il-media>
          {video ? <InViewVideo src={video} className="interlude-video" data-il-img /> : null}
          <img
            hidden={Boolean(video)}
            src={`/media/gen/${id}-1920.webp`}
            srcSet={`/media/gen/${id}-960.webp 960w, /media/gen/${id}-1920.webp 1920w`}
            sizes="100vw"
            alt={alt}
            width={1920}
            height={1072}
            loading="lazy"
            decoding="async"
            data-il-img={video ? undefined : true}
          />
          <div className="interlude-shade" />
        </div>
        <p className="interlude-word" data-il-word aria-hidden="true">{word}</p>
        {script ? <Script name={script} tone="paper" className="script--interlude" /> : null}
        <figcaption className="mono interlude-cap">Generated illustration</figcaption>
      </div>
    </figure>
  );
}

/** Dimmed generated still used as a scene backdrop. */
export function SceneImage({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div className={`scene-img ${className}`} aria-hidden="true" data-scene-img>
      <img src={`/media/gen/${id}-1920.webp`} srcSet={`/media/gen/${id}-960.webp 960w, /media/gen/${id}-1920.webp 1920w`} sizes="100vw" alt="" width={1920} height={1072} loading="lazy" decoding="async" />
    </div>
  );
}
