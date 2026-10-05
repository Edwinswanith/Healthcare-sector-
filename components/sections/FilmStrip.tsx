"use client";

import { useState } from "react";
import { films } from "@/content/site";
import { MiniField } from "@/components/frame/MiniField";
import type { OrganKey } from "@/lib/field/shapes";

/** Horizontal film strip. Hover or focus previews a card's study. */
export function FilmStrip() {
  const [active, setActive] = useState(-1);
  return (
    <ul className="strip" data-strip>
      {films.library.map((f, i) => (
        <li key={f.title} className={`film${active === i ? " is-active" : ""}`}>
          <a
            href={`/contact?interest=films&topic=${encodeURIComponent(f.title)}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(-1)}
          >
            <span className="film-art">
              <MiniField organ={f.organ as OrganKey} active={active === i} zoom={1.55} />
              <span className="film-bar"><span /></span>
            </span>
            <span className="film-meta mono"><span>{f.duration}</span><span>{f.category}</span></span>
            <span className="film-title">{f.title}</span>
            <span className="film-cta mono">Ask about this film</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
