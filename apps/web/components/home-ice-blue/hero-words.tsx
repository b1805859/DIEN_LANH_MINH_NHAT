import type { CSSProperties } from 'react';
import styles from './staggered-hero.module.css';

export function HeroWords({ text, start = 0 }: { text: string; start?: number }) {
  return text.trim().split(/\s+/).flatMap((word, index) => {
    const mask = (
      <i className={styles.wordMask} key={index}>
        <i data-u216="word" style={{ '--u216-delay': `${300 + (start + index) * 70}ms` } as CSSProperties}>
          {word}
        </i>
      </i>
    );
    return index === 0 ? [mask] : [' ', mask];
  });
}
