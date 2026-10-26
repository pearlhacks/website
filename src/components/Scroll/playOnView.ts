import { inView } from "motion/react";

interface Entrance {
  /** Puts the element in its "before" state. */
  hide: () => void;
  /** Animates it from there to how the server drew it. */
  play: () => void;
  /** How much of the element must be on screen before it plays. */
  amount?: number;
}

// Plays an entrance animation when an element scrolls into view, and sets it
// up to play again every time the page gets back to the very top, whether by
// scrolling or the back-to-top button. The server HTML shows everything in
// its final place, and an element only hides while it is below the fold, so
// nothing disappears without JavaScript and nothing on screen jumps.
// Returns a cleanup function for useEffect.
export function playOnView(element: Element, { hide, play, amount = 0.2 }: Entrance) {
  let stopWatching: VoidFunction | undefined;

  const arm = () => {
    stopWatching?.();
    stopWatching = undefined;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    // Stop the last play if it's still going, or it would finish over the
    // reset. Only script animations: CSS ones belong to the stylesheet.
    for (const animation of element.getAnimations({ subtree: true })) {
      if (animation.constructor === Animation) animation.cancel();
    }
    hide();
    stopWatching = inView(
      element,
      () => {
        play();
        stopWatching?.();
        stopWatching = undefined;
      },
      { amount }
    );
  };

  arm();
  const stopListening = onReturnToTop(arm);
  return () => {
    stopWatching?.();
    stopListening();
  };
}

// One scroll listener shared by every entrance on the page.
const returnListeners = new Set<VoidFunction>();
let atTop = true;

function checkTop() {
  const top = window.scrollY <= 0;
  if (top && !atTop) returnListeners.forEach((listener) => listener());
  atTop = top;
}

function onReturnToTop(listener: VoidFunction) {
  if (returnListeners.size === 0) {
    atTop = window.scrollY <= 0;
    window.addEventListener("scroll", checkTop, { passive: true });
  }
  returnListeners.add(listener);
  return () => {
    returnListeners.delete(listener);
    if (returnListeners.size === 0) window.removeEventListener("scroll", checkTop);
  };
}
