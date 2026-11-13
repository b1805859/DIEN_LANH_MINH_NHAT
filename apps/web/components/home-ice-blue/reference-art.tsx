import Image from 'next/image';
import type { CSSProperties } from 'react';
import styles from './home.module.css';
import { HouseTechnicianMotion } from './house-technician-motion';

/** Source coordinates remain in the approved mockup's coordinate system. */
export function ReferenceArt({ x, y, width, height, className = '', priority = false }: {
  x: number; y: number; width: number; height: number; className?: string; priority?: boolean;
}) {
  let source = '/images/home-ice-blue/approved-artwork.webp';
  let sourceWidth = 1122;
  let sourceHeight = 1402;
  let cropX = x;
  let cropY = y;
  let cropWidth = width;
  let cropHeight = height;
  if (x === 430 && y === 40) {
    source = '/images/home-ice-blue/hd/house-fridge-approved-v4.webp';
    sourceWidth = 2754; sourceHeight = 2284;
    cropX = 0; cropY = 0; cropWidth = sourceWidth; cropHeight = sourceHeight;
  } else if (y === 962 && [32, 389, 743].includes(x)) {
    const name = { 32: 'repair', 389: 'clean', 743: 'install' }[x as 32 | 389 | 743];
    source = `/images/home-ice-blue/hd/${name}.webp`;
    sourceWidth = name === 'install' ? 1653 : 1652; sourceHeight = 952;
    cropX = 0; cropY = 0; cropWidth = sourceWidth; cropHeight = sourceHeight;
  } else if (y === 638 || y === 660) {
    source = '/images/home-ice-blue/hd/equipment.webp';
    sourceWidth = 2179; sourceHeight = 722;
    // The restored strip retains a 141px top margin around its 441px panel.
    cropX = (x - 38) * 2179 / 1046;
    cropY = 141 + (y - 614) * 441 / 212;
    cropWidth = width * 2179 / 1046;
    cropHeight = height * 441 / 212;
  }
  const style: CSSProperties = {
    aspectRatio: `${width} / ${height}`,
    '--art-left': `${-cropX / cropWidth * 100}%`,
    '--art-top': `${-cropY / cropHeight * 100}%`,
    '--art-width': `${sourceWidth / cropWidth * 100}%`,
  } as CSSProperties;
  return <span className={`${styles.referenceArt} ${className}`} style={style} aria-hidden="true">
    <Image src={source} alt="" width={sourceWidth} height={sourceHeight}
      unoptimized priority={priority} loading={priority ? undefined : 'lazy'} />
    {x === 430 && y === 40 && <Image
      className={styles.bathOverlay}
      src="/images/home-ice-blue/hd/bath-connected-v1.webp"
      alt="" width={1132} height={1389} unoptimized
      priority={priority} loading={priority ? undefined : 'lazy'}
    />}
    {x === 430 && y === 40 && <HouseTechnicianMotion />}
  </span>;
}
