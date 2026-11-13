// Match the shared public frame, capped at 1920 CSS pixels on wide monitors.
export const contentImageSizes =
  '(min-width: 2400px) 1920px, (min-width: 1536px) calc(75vw + 120px), (min-width: 1200px) calc(100vw - 96px), (max-width: 480px) calc(100vw - 32px), (max-width: 1050px) calc(100vw - 48px), 1200px';

export const halfContentImageSizes =
  '(min-width: 2400px) 960px, (min-width: 1536px) calc(37.5vw + 60px), 50vw';

export const thirdContentImageSizes =
  '(max-width: 800px) 50vw, (min-width: 2400px) 640px, (min-width: 1536px) calc(25vw + 40px), 33vw';
