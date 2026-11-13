const playing = 'data-u216-playing';
const keepNav = 'data-u216-keep-nav';
const reducedMotion = '(prefers-reduced-motion: reduce)';

function playHeroEntrance(site: HTMLElement, keepNavigationVisible = false) {
  if (window.matchMedia(reducedMotion).matches) return;
  site.toggleAttribute(keepNav, keepNavigationVisible);
  site.setAttribute(playing, '');
}

export function observeHeroEntrance(site: HTMLElement, hero: HTMLElement) {
  const preference = window.matchMedia(reducedMotion);
  const finish = () => {
    site.removeAttribute(playing);
    site.removeAttribute(keepNav);
  };
  const onPreferenceChange = (event: MediaQueryListEvent) => {
    if (event.matches) finish();
  };
  const observer = typeof IntersectionObserver === 'function' && !preference.matches
    ? new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio < 0.35) return;
        observer?.disconnect();
        const focused = document.activeElement;
        if (site.contains(focused) && focused?.matches(':focus-visible')) {
          if (focused.closest('.mn-header')) playHeroEntrance(site, true);
          return;
        }
        playHeroEntrance(site);
      }, { threshold: 0.35 })
    : undefined;
  const onPageShow = (event: PageTransitionEvent) => {
    if (!event.persisted) return;
    finish();
    observer?.observe(hero);
  };
  observer?.observe(hero);
  window.addEventListener('pageshow', onPageShow);
  site.addEventListener('focusin', finish);
  preference.addEventListener('change', onPreferenceChange);
  return () => {
    observer?.disconnect();
    window.removeEventListener('pageshow', onPageShow);
    site.removeEventListener('focusin', finish);
    preference.removeEventListener('change', onPreferenceChange);
    finish();
  };
}
