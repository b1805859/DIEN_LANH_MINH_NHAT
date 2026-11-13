'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import styles from './home.module.css';

interface BgPatchConfig {
  id: string;
  src: string;
  left: string;
  top: string;
  width: string;
  height: string;
  imgW: number;
  imgH: number;
}

interface HandLayerConfig {
  id: string;
  src: string;
  className: string;
  left: string;
  top: string;
  width: string;
  height: string;
  origin: string;
  imgW: number;
  imgH: number;
}

const BG_PATCHES: BgPatchConfig[] = [
  {
    id: 'bg-r1',
    src: '/images/home-ice-blue/hd/hands/bg-r1.webp',
    left: '39.578795%',
    top: '17.950963%',
    width: '7.262164%',
    height: '12.259194%',
    imgW: 200,
    imgH: 280,
  },
  {
    id: 'bg-r2',
    src: '/images/home-ice-blue/hd/hands/bg-r2.webp',
    left: '77.705156%',
    top: '33.274956%',
    width: '5.809731%',
    height: '7.443082%',
    imgW: 160,
    imgH: 170,
  },
  {
    id: 'bg-r3',
    src: '/images/home-ice-blue/hd/hands/bg-r3.webp',
    left: '39.941903%',
    top: '69.614711%',
    width: '6.172840%',
    height: '12.259194%',
    imgW: 170,
    imgH: 280,
  },
  {
    id: 'bg-r4',
    src: '/images/home-ice-blue/hd/hands/bg-r4.webp',
    left: '81.316815%',
    top: '63.045686%',
    width: '7.842765%',
    height: '19.719685%',
    imgW: 326,
    imgH: 680,
  },
];

const HAND_LAYERS: HandLayerConfig[] = [
  {
    id: 'ac-hands',
    src: '/images/home-ice-blue/hd/hands/hand-r1.webp',
    className: styles.handAc,
    left: '39.578795%',
    top: '17.950963%',
    width: '7.262164%',
    height: '12.259194%',
    origin: '52% 65.71429%',
    imgW: 200,
    imgH: 280,
  },
  {
    id: 'washer-hand',
    src: '/images/home-ice-blue/hd/hands/hand-r2.webp',
    className: styles.handWasher,
    left: '77.705156%',
    top: '33.274956%',
    width: '5.809731%',
    height: '7.443082%',
    origin: '53.75% 49.41176%',
    imgW: 160,
    imgH: 170,
  },
  {
    id: 'fridge-probe-hand',
    src: '/images/home-ice-blue/hd/hands/hand-r3a.webp',
    className: styles.handFridgeProbe,
    left: '39.941903%',
    top: '69.614711%',
    width: '6.172840%',
    height: '12.259194%',
    origin: '40% 17.85714%',
    imgW: 170,
    imgH: 280,
  },
  {
    id: 'fridge-meter-hand',
    src: '/images/home-ice-blue/hd/hands/hand-r3b.webp',
    className: styles.handFridgeMeter,
    left: '39.941903%',
    top: '69.614711%',
    width: '6.172840%',
    height: '12.259194%',
    origin: '64.70588% 83.57143%',
    imgW: 170,
    imgH: 280,
  },
  {
    id: 'heater-probe-hand',
    src: '/images/home-ice-blue/hd/hands/hand-r4a.webp',
    className: styles.handHeaterProbe,
    left: '81.316815%',
    top: '63.045686%',
    width: '7.842765%',
    height: '19.719685%',
    origin: '45.39877% 14.70588%',
    imgW: 326,
    imgH: 680,
  },
  {
    id: 'heater-meter-hand',
    src: '/images/home-ice-blue/hd/hands/hand-r4b.webp',
    className: styles.handHeaterMeter,
    left: '81.316815%',
    top: '63.045686%',
    width: '7.842765%',
    height: '19.719685%',
    origin: '49.07975% 87.05882%',
    imgW: 326,
    imgH: 680,
  },
];

export function HouseTechnicianMotion() {
  const [seekStyle, setSeekStyle] = useState<CSSProperties | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t');
    if (t !== null) {
      const sec = parseFloat(t);
      if (!Number.isNaN(sec)) {
        setSeekStyle({
          animationDelay: `${-sec}s`,
          animationPlayState: 'paused',
        });
      }
    }
  }, []);

  return (
    <span className={styles.handRigStage} data-ready="true" aria-hidden="true">
      {BG_PATCHES.map((patch) => (
        <img
          key={patch.id}
          src={patch.src}
          alt=""
          width={patch.imgW}
          height={patch.imgH}
          className={styles.handBgPatch}
          style={{
            left: patch.left,
            top: patch.top,
            width: patch.width,
            height: patch.height,
          }}
          decoding="sync"
        />
      ))}
      {HAND_LAYERS.map((layer) => (
        <span
          key={layer.id}
          className={`${styles.handPivotBox} ${layer.className}`}
          style={{
            left: layer.left,
            top: layer.top,
            width: layer.width,
            height: layer.height,
            transformOrigin: layer.origin,
            ...seekStyle,
          }}
        >
          <img
            src={layer.src}
            alt=""
            width={layer.imgW}
            height={layer.imgH}
            className={styles.handSpriteSupersampled}
            decoding="sync"
          />
        </span>
      ))}
      <span
        className={`${styles.pcbIndicator} ${styles.pcbWasher}`}
        style={seekStyle}
      />
      <span
        className={`${styles.pcbIndicator} ${styles.pcbHeater}`}
        style={seekStyle}
      />
    </span>
  );
}
