import Link from "next/link";
import { brand, enquire, nav } from "@/content/site";
import { Menu } from "./Menu";
import { Roll } from "./Roll";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <header className="hdr" data-header>
      <a className="skip" href="#main">Skip to content</a>
      <Link className="hdr-brand" href="/" aria-label={`${brand.name}, home`}>
        <Wordmark />
      </Link>
      <span className="hdr-time mono" aria-hidden="true" data-timecode>00:00 / 03:00</span>
      <nav className="hdr-nav" aria-label="Main">
        <ul>{nav.map((n) => <li key={n.href}><a href={n.href}><Roll>{n.label}</Roll></a></li>)}</ul>
      </nav>
      <a className="btn btn--signal btn--sm hdr-cta" href={enquire.href}><Roll>{enquire.label}</Roll></a>
      <Menu />
    </header>
  );
}
