// Match the existing 1280px content frame without changing rendered geometry.
export const contentImageSizes =
  '(max-width: 480px) calc(100vw - 32px), (max-width: 1050px) calc(100vw - 48px), (max-width: 1250px) calc(100vw - 70px), (max-width: 1380px) calc(100vw - 100px), 1280px';

export const halfContentImageSizes =
  '(max-width: 1380px) 50vw, 630px';

export const thirdContentImageSizes =
  '(max-width: 800px) 50vw, (max-width: 1380px) 33vw, 415px';
