import { preloader } from "@/content/site";
import { Wordmark } from "@/components/ui/Wordmark";

/** First-visit overlay. Hidden unless the inline head script adds `intro`. */
export function Preloader() {
  return (
    <div id="preloader" className="loader" aria-hidden="true">
      <Wordmark />
      <div className="loader-row mono">
        <span>{preloader.label}</span>
        <span className="loader-count" data-loader-count>000</span>
      </div>
      <span className="loader-bar"><span data-loader-bar /></span>
      <span className="mono loader-detail">{preloader.detail}</span>
    </div>
  );
}
