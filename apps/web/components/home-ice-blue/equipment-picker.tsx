'use client';

import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Droplet, Plug, Refrigerator, Snowflake, WashingMachine } from 'lucide-react';
import styles from './home.module.css';
import { ScrollRevealCopy } from './scroll-reveal-copy';
import { StaggeredHero } from './staggered-hero';
import { StaggeredServiceCards } from './staggered-service-cards';

const shortcutIcons = {
  airvent: Snowflake,
  washer: WashingMachine,
  fridge: Refrigerator,
  plug: Plug,
  droplet: Droplet,
};

type EquipmentGroup = {
  id: string;
  label: string;
  icon: keyof typeof shortcutIcons;
  image: ReactNode;
  content: ReactNode;
};

const shortLabels: Record<string, string> = {
  utilities: 'Điện nước',
  'drinking-water': 'Nước uống nóng lạnh',
  'water-heater': 'Máy nước nóng',
};

/** All panels arrive as server-rendered content, including their crawlable links. */
export function EquipmentPicker({ groups, art, phoneHref }: {
  groups: EquipmentGroup[];
  art: ReactNode;
  phoneHref: string;
}) {
  const [selected, setSelected] = useState(groups[0].id);
  const panels = useRef<Record<string, HTMLDivElement | null>>({});

  function openServices(id: string) {
    setSelected(id);
    requestAnimationFrame(() => {
      const panel = panels.current[id];
      if (!panel || panel.hidden) return;
      panel.focus({ preventScroll: true });
      panel.scrollIntoView({ block: 'start' });
    });
  }

  return <>
    <StaggeredHero art={art} phoneHref={phoneHref} shortcuts={
      <div className={styles.shortcuts} role="group" aria-label="Chọn nhanh thiết bị">
        {groups.map(group => {
          const Icon = shortcutIcons[group.icon];
          return (
            <button key={group.id} type="button" aria-controls={`services-${group.id}`} onClick={() => openServices(group.id)}>
              <Icon size={19} aria-hidden="true" />
              {shortLabels[group.id] ?? group.label}
            </button>
          );
        })}
      </div>
    } />
    <StaggeredServiceCards className={`${styles.chooser} approved-home-chooser`} labelledBy="equipment-heading" animateInitiallyVisible>
      <div className={styles.chooserIntro}>
        <ScrollRevealCopy id="equipment-heading" title="Bạn cần hỗ trợ gì?">
          Chọn thiết bị để xem dịch vụ phù hợp.
        </ScrollRevealCopy>
      </div>
      <div className={styles.equipmentGrid} role="group" aria-label="Chọn nhóm thiết bị">
        {groups.map((group, index) => <button key={group.id} type="button" className={styles.equipment}
          data-u251-card style={{ '--u251-delay': `${index * 45}ms` } as CSSProperties}
          aria-pressed={selected === group.id} aria-controls={`services-${group.id}`}
          onClick={() => setSelected(group.id)}>
          {group.image}<span>{group.label === 'Điện nước dân dụng' ? 'Điện nước' : group.id === 'water-heater' ? 'Máy nước nóng' : group.id === 'drinking-water' ? <>Nước uống<br />nóng lạnh</> : group.label}</span>
        </button>)}
      </div>
    </StaggeredServiceCards>
    {groups.map(group => <div key={group.id} id={`services-${group.id}`}
      className={styles.servicePanel} hidden={selected !== group.id} tabIndex={-1}
      role="region" aria-labelledby={`heading-${group.id}`}
      ref={element => { panels.current[group.id] = element; }}>
      {group.content}
    </div>)}
    <span className={styles.srOnly} role="status">Đang hiển thị: {groups.find(group => group.id === selected)?.label}</span>
  </>;
}
