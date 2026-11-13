'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { CalendarDays, ClipboardList, Headset, MessagesSquare, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from 'next/navigation';
import { isServicePage } from '@/lib/service-pages';

const stepIcons = [MessagesSquare, CalendarDays, ClipboardList, Wrench, Headset];
const stepIllustrations = [
  { src: '/images/process/process-step-2.png', alt: 'Nhân viên tiếp nhận thông tin và tư vấn qua điện thoại' },
  { src: '/images/process/process-step-3.png', alt: 'Kỹ thuật viên kiểm tra máy lạnh tại nhà' },
  { src: '/images/process/process-step-1.png', alt: 'Khách hàng trao đổi và xác nhận thông tin qua điện thoại' },
  { src: '/images/process/process-step-4.png', alt: 'Kỹ thuật viên thực hiện dịch vụ máy lạnh' },
  { src: '/images/process/process-step-5.png', alt: 'Kỹ thuật viên và khách hàng hài lòng sau dịch vụ' },
];

function StepGifOverlay({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <svg className="mn-process-gif-fx" viewBox="0 0 240 320" fill="none" aria-hidden="true">
          {/* Outward-propagating acoustic voice waves from headset mic */}
          <path className="mn-gif-wave mn-gif-wave-1" d="M132 142c8-5 14 2 12 11" stroke="#0759c7" strokeWidth="2.6" strokeLinecap="round" />
          <path className="mn-gif-wave mn-gif-wave-2" d="M140 135c12-7 21 4 18 17" stroke="#00a8cc" strokeWidth="2.4" strokeLinecap="round" />
          <path className="mn-gif-wave mn-gif-wave-3" d="M148 128c15-9 27 5 23 22" stroke="#38d9ff" strokeWidth="2.2" strokeLinecap="round" />
          {/* Steady cartoon speech bubble with smooth wave dots */}
          <g className="mn-gif-bubble">
            <rect x="142" y="16" width="76" height="40" rx="14" fill="#ffffff" stroke="#0759c7" strokeWidth="2.5" />
            <path d="M156 56l-10 11 20-11" fill="#ffffff" stroke="#0759c7" strokeWidth="2.5" strokeLinejoin="round" />
            <circle className="mn-gif-dot mn-gif-dot-1" cx="164" cy="36" r="4.2" fill="#0759c7" />
            <circle className="mn-gif-dot mn-gif-dot-2" cx="180" cy="36" r="4.2" fill="#00a8cc" />
            <circle className="mn-gif-dot mn-gif-dot-3" cx="196" cy="36" r="4.2" fill="#0759c7" />
          </g>
          {/* Self-drawing notebook ink lines (pathLength=1) + gliding pen tip glow */}
          <path className="mn-gif-draw-line mn-gif-draw-line-1" pathLength={1} d="M90 292h26" stroke="#0759c7" strokeWidth="2.4" strokeLinecap="round" />
          <path className="mn-gif-draw-line mn-gif-draw-line-2" pathLength={1} d="M93 298h23" stroke="#00a8cc" strokeWidth="2.2" strokeLinecap="round" />
          <circle className="mn-gif-pen-tip" cx="90" cy="292" r="3" fill="#00e1ff" />
        </svg>
      );
    case 1:
      return (
        <svg className="mn-process-gif-fx" viewBox="0 0 240 320" fill="none" aria-hidden="true">
          {/* Smooth AC diagnostic laser scan inside open AC grill */}
          <g className="mn-gif-scan-beam">
            <line x1="68" y1="62" x2="180" y2="44" stroke="#00e1ff" strokeWidth="3" strokeLinecap="round" />
            <polygon points="68,62 180,44 180,72 68,90" fill="url(#mnScanGrad)" opacity="0.42" />
          </g>
          {/* Smooth horizontal-gliding magnifying inspection HUD (no rotation wobble) */}
          <g className="mn-gif-magnifier">
            <circle cx="0" cy="0" r="16" fill="#00d2ff22" stroke="#00e1ff" strokeWidth="2.5" />
            <circle className="mn-gif-hud-ring" cx="0" cy="0" r="21" stroke="#ffffff" strokeWidth="1.6" strokeDasharray="5 4" />
            <line x1="12" y1="12" x2="23" y2="23" stroke="#0759c7" strokeWidth="4" strokeLinecap="round" />
          </g>
          {/* Steady checklist verification pill with self-drawing checkmark & progress bars */}
          <g className="mn-gif-check-badge">
            <rect x="0" y="0" width="78" height="28" rx="14" fill="#0759c7" stroke="#ffffff" strokeWidth="2.2" />
            <circle cx="15" cy="14" r="8" fill="#28e0b9" />
            <path className="mn-gif-draw-check" pathLength={1} d="M11.5 14l2.5 2.5 5-5" stroke="#002b46" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            <line className="mn-gif-draw-line mn-gif-draw-line-1" pathLength={1} x1="29" y1="11" x2="66" y2="11" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" />
            <line className="mn-gif-draw-line mn-gif-draw-line-2" pathLength={1} x1="29" y1="18" x2="54" y2="18" stroke="#9be7ff" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <defs>
            <linearGradient id="mnScanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e1ff" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#00e1ff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 2:
      return (
        <svg className="mn-process-gif-fx" viewBox="0 0 240 320" fill="none" aria-hidden="true">
          {/* Smooth sequential calendar date selection highlights */}
          <rect className="mn-gif-cal-cell-1" x="172" y="76" width="5.5" height="4.5" rx="1.2" fill="#00c4ff" />
          <rect className="mn-gif-cal-cell-2" x="181" y="76" width="5.5" height="4.5" rx="1.2" fill="#0759c7" />
          <rect className="mn-gif-cal-cell-3" x="172" y="84" width="5.5" height="4.5" rx="1.2" fill="#28e0b9" />
          {/* Pure-white inner clock face cover + smooth continuous spinning clock hands */}
          <circle cx="198" cy="107" r="11.5" fill="#ffffff" />
          <line className="mn-gif-clock-hour" x1="198" y1="107" x2="198" y2="100" stroke="#0971dc" strokeWidth="2.6" strokeLinecap="round" />
          <line className="mn-gif-clock-hand" x1="198" y1="107" x2="206" y2="107" stroke="#00a8cc" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="198" cy="107" r="2.2" fill="#0971dc" />
          {/* Smooth expanding smartphone touch ripples */}
          <circle className="mn-gif-ripple mn-gif-ripple-1" cx="114" cy="176" r="10" stroke="#00e1ff" strokeWidth="2.5" />
          <circle className="mn-gif-ripple mn-gif-ripple-2" cx="114" cy="176" r="20" stroke="#5ce1ff" strokeWidth="2" />
        </svg>
      );
    case 3:
      return (
        <svg className="mn-process-gif-fx" viewBox="0 0 240 320" fill="none" aria-hidden="true">
          {/* Continuous 360-degree rotating mechanical torque ring at screwdriver tip */}
          <g className="mn-gif-tool-rotor">
            <circle cx="129" cy="104" r="13" stroke="#00e1ff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="16 12" />
            <circle cx="129" cy="104" r="7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="8 8" />
          </g>
          <circle className="mn-gif-tool-core" cx="129" cy="104" r="3.5" fill="#ffffff" />
          {/* Soft-breathing 4-point cartoon stars (no rotational twitch) */}
          <path className="mn-gif-star mn-gif-star-1" d="M26 36l4.5 11 11 4.5-11 4.5-4.5 11-4.5-11-11-4.5 11-4.5z" fill="#ffffff" stroke="#62d9ff" strokeWidth="1.2" />
          <path className="mn-gif-star mn-gif-star-2" d="M82 40l3.5 8 8 3.5-8 3.5-3.5 8-3.5-8-8-3.5 8-3.5z" fill="#ffffff" stroke="#62d9ff" strokeWidth="1.2" />
          <path className="mn-gif-star mn-gif-star-3" d="M182 186l4 9.5 9.5 4-9.5 4-4 9.5-4-9.5-9.5-4 9.5-4z" fill="#ffffff" stroke="#62d9ff" strokeWidth="1.2" />
          <path className="mn-gif-star mn-gif-star-4" d="M158 208l3.2 7.5 7.5 3.2-7.5 3.2-3.2 7.5-3.2-7.5-7.5-3.2 7.5-3.2z" fill="#ffffff" stroke="#62d9ff" strokeWidth="1.2" />
          {/* Continuous flowing water wash streams on the blue tarp */}
          <path className="mn-gif-water mn-gif-water-1" d="M158 134v58" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="7 11" />
          <path className="mn-gif-water mn-gif-water-2" d="M176 128v66" stroke="#aeeeff" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="9 12" />
          <path className="mn-gif-water mn-gif-water-3" d="M194 122v64" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="6 12" />
        </svg>
      );
    case 4:
    default:
      return (
        <svg className="mn-process-gif-fx" viewBox="0 0 240 320" fill="none" aria-hidden="true">
          {/* Smooth continuous cool airflow ribbons from AC */}
          <path className="mn-gif-breeze mn-gif-breeze-1" d="M56 76c-2 10-5 20-9 30" stroke="#38d9ff" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="10 8" />
          <path className="mn-gif-breeze mn-gif-breeze-2" d="M88 76c2 16 6 32 13 48" stroke="#38d9ff" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="12 9" />
          <path className="mn-gif-breeze mn-gif-breeze-3" d="M118 76c5 18 13 34 22 48" stroke="#38d9ff" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="12 9" />
          {/* Soft-breathing cold sparkles */}
          <path className="mn-gif-star mn-gif-star-1" d="M130 102l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#38d9ff" />
          <path className="mn-gif-star mn-gif-star-2" d="M112 126l3.5 7.5 7.5 3.5-7.5 3.5-3.5 7.5-3.5-7.5-7.5-3.5 7.5-3.5z" fill="#7be5ff" />
          <path className="mn-gif-star mn-gif-star-3" d="M114 148l4.5 10 10 4.5-10 4.5-4.5 10-4.5-10-10-4.5 10-4.5z" fill="#ffffff" stroke="#38d9ff" strokeWidth="1.4" />
          {/* Self-drawing thumbs-up shine arcs beside both hands */}
          <g className="mn-gif-thumb-rays">
            <path className="mn-gif-draw-line mn-gif-draw-line-1" pathLength={1} d="M52 254c7 4 9 14 4 22" stroke="#00c4ff" strokeWidth="2.8" strokeLinecap="round" />
            <path className="mn-gif-draw-line mn-gif-draw-line-2" pathLength={1} d="M59 250c9 6 11 19 5 29" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
            <path className="mn-gif-draw-line mn-gif-draw-line-1" pathLength={1} d="M182 256c-7 4-9 14-4 22" stroke="#00c4ff" strokeWidth="2.8" strokeLinecap="round" />
            <path className="mn-gif-draw-line mn-gif-draw-line-2" pathLength={1} d="M175 252c-9 6-11 19-5 29" stroke="#0759c7" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </svg>
      );
  }
}

export function HomeProcessJourney({ steps }: { steps: string[][] }) {
  const root = useRef<HTMLDivElement>(null);
  const servicePage = isServicePage(usePathname());

  useLayoutEffect(() => {
    const grid = root.current;
    const section = grid?.closest<HTMLElement>('.mn-home-process-journey');
    const heading = section?.querySelector<HTMLElement>('.mn-section-heading h2');
    if (!grid || !section || !heading) return;
    gsap.registerPlugin(ScrollTrigger);

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('article'));
    const icons = cards.map((card) => card.querySelector<HTMLElement>('.mn-home-process-icon')!);
    const highlights = cards.map((card) => card.querySelector<HTMLElement>('.mn-journey-highlight')!);
    const connectors = Array.from(grid.querySelectorAll<HTMLElement>('.mn-journey-connector'));
    const fills = connectors.map((connector) => connector.firstElementChild as HTMLElement);
    const milestones = Array.from(grid.querySelectorAll<HTMLElement>('.mn-journey-milestone'));
    const stepTargets = cards.map((card, index) => [card, milestones[index]].filter(Boolean));
    let disposed = false;
    let resizeFrame = 0;

    // Measure only on layout changes, using offsets unaffected by reveal/hover transforms.
    // The segments live outside the cards and occupy only the gaps between their borders.
    const placeConnectors = () => {
      resizeFrame = 0;
      if (disposed || !cards.length) return;
      const positions = cards.map((card, index) => ({
        left: card.offsetLeft,
        right: card.offsetLeft + card.offsetWidth,
        top: card.offsetTop,
        bottom: card.offsetTop + card.offsetHeight,
        center: card.offsetLeft + icons[index].offsetLeft + icons[index].offsetWidth / 2,
        railCenter: card.offsetLeft + card.offsetWidth / 2,
        anchor: card.offsetTop + icons[index].offsetTop + icons[index].offsetHeight / 2,
      }));
      const oneRow = positions.every((position) => Math.abs(position.top - positions[0].top) < 2);
      const oneColumn = positions.every((position) => Math.abs(position.left - positions[0].left) < 2);
      milestones.forEach((milestone, index) => {
        milestone.style.left = `${positions[index].railCenter - 42}px`;
      });
      connectors.forEach((connector, index) => {
        const current = positions[index];
        const next = positions[index + 1];
        connector.style.display = (oneRow || oneColumn) && next ? 'block' : 'none';
        if (!next || (!oneRow && !oneColumn)) return;
        connector.dataset.axis = oneRow ? 'horizontal' : 'vertical';
        connector.style.left = `${oneRow ? current.railCenter : current.center - 1.5}px`;
        connector.style.top = `${oneRow ? 42 : current.bottom}px`;
        connector.style.width = `${oneRow ? Math.max(0, next.railCenter - current.railCenter) : 3}px`;
        connector.style.height = `${oneRow ? 4 : Math.max(0, next.top - current.bottom)}px`;
      });
    };
    const scheduleConnectors = () => {
      if (!resizeFrame && !disposed) resizeFrame = requestAnimationFrame(placeConnectors);
    };
    placeConnectors();
    const resize = new ResizeObserver(scheduleConnectors);
    resize.observe(grid);
    void document.fonts.ready.then(scheduleConnectors);

    const media = gsap.matchMedia();
    media.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        motion: '(prefers-reduced-motion: no-preference)',
        compact: '(max-width: 700px)',
      },
      (context) => {
        // The compact timeline is read as one screen, without waiting for five
        // separate scroll reveals. Desktop keeps its original journey sequence.
        if (servicePage || context.conditions?.compact) {
          section.dataset.journeyState = 'complete';
          return;
        }
        const reduced = !!context.conditions?.reduce;
        section.dataset.journeyState = 'pending';
        const timeline = gsap.timeline({
          paused: true,
          repeat: reduced ? 0 : -1,
          repeatDelay: reduced ? 0 : 0.4,
          onStart: () => {
            section.dataset.journeyState = 'playing';
          },
          onComplete: () => { section.dataset.journeyState = 'complete'; },
        });

        timeline.set([...cards, ...milestones], { attr: { 'data-journey-step-state': 'pending' } }, 0);
        if (reduced) {
          // Keep a short orientation cue, without movement, stagger, or icon scaling.
          timeline.fromTo([heading, ...cards], { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, 0);
        } else {
          // The shared homepage reveal owns opacity/translation for each card,
          // cartoon and text detail, including reversing them on upward scroll.
          // This timeline only owns the connector and the icon/highlight emphasis.
          timeline.set(fills, {
            scaleX: (_: number, fill: HTMLElement) => fill.parentElement?.dataset.axis === 'vertical' ? 1 : 0,
            scaleY: (_: number, fill: HTMLElement) => fill.parentElement?.dataset.axis === 'vertical' ? 0 : 1,
            transformOrigin: 'top left',
          }, 0);

          const journeyStart = 0.2;
          const stepHold = 1.9;
          const connectorTravel = 0.45;
          cards.forEach((_, index) => {
            const arrival = journeyStart + index * stepHold;
            timeline.set(stepTargets[index], { attr: { 'data-journey-step-state': 'active' } }, arrival);
            if (index > 0) timeline.set(stepTargets[index - 1],
              { attr: { 'data-journey-step-state': 'complete' } }, arrival);
            timeline.to(icons[index], { scale: 1.08, duration: 0.35, ease: 'power2.out' }, arrival);
            timeline.to(highlights[index], { opacity: 1, duration: 0.3, ease: 'power2.out' }, arrival);
            timeline.to(icons[index], { scale: 1, duration: 0.45, ease: 'power2.out' }, arrival + stepHold - 0.45);
            timeline.to(highlights[index], { opacity: 0, duration: 0.35, ease: 'power2.out' }, arrival + stepHold - 0.35);
            if (fills[index]) {
              timeline.fromTo(
                fills[index],
                {
                  scaleX: (_: number, fill: HTMLElement) => fill.parentElement?.dataset.axis === 'vertical' ? 1 : 0,
                  scaleY: (_: number, fill: HTMLElement) => fill.parentElement?.dataset.axis === 'vertical' ? 0 : 1,
                  transformOrigin: 'top left',
                },
                {
                  scaleX: 1,
                  scaleY: 1,
                  duration: connectorTravel,
                  ease: 'power2.inOut',
                  immediateRender: true,
                },
                arrival + stepHold - connectorTravel,
              );
            }
          });
        }
        // Release transforms after the last step completes its active hold.
        const finish = reduced ? timeline.duration() : 0.2 + cards.length * 1.9;
        timeline.set([...cards, ...milestones], { attr: { 'data-journey-step-state': 'complete' } }, finish);
        if (reduced) timeline.set([heading, ...cards], { clearProps: 'opacity' }, finish);
        timeline.set(icons, { clearProps: 'transform' }, finish);
        timeline.set(highlights, { clearProps: 'opacity' }, finish);
        if (!reduced) {
          timeline.to({}, { duration: 0.65 }, finish);
        }
        timeline.timeScale(1);
        const replay = () => {
          section.dataset.journeyState = 'playing';
          timeline.restart();
        };
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'clamp(top 90%)',
          end: 'clamp(bottom top)',
          onEnter: replay,
          onEnterBack: replay,
          onLeave: () => timeline.pause(),
          onLeaveBack: () => timeline.pause(),
        });
        if (st.isActive) replay();
        return () => { section.dataset.journeyState = 'complete'; };
      },
      section,
    );

    return () => {
      disposed = true;
      resize.disconnect();
      cancelAnimationFrame(resizeFrame);
      media.revert();
      delete section.dataset.journeyState;
    };
  }, [steps, servicePage]);

  return (
    <div className="mn-process-grid" ref={root} role="list" aria-label="Các bước phục vụ">
      {steps.map(([title, description], index) => {
        const StepIcon = stepIcons[index % stepIcons.length];
        const illustration = stepIllustrations[index];
        return (
          <Fragment key={title}>
            <article role="listitem" data-step-index={index}>
              {illustration && (
                <div className="mn-process-illustration" data-step-illustration={index}>
                  <div className="mn-process-cartoon-stage">
                    <Image
                      loading="eager"
                      src={illustration.src}
                      alt={illustration.alt}
                      fill
                      sizes="(max-width: 700px) 82px, (max-width: 1000px) 28vw, 230px"
                    />
                    {!servicePage && <StepGifOverlay step={index} />}
                  </div>
                </div>
              )}
              <div className="mn-home-process-icon"><StepIcon size={30} strokeWidth={1.7} aria-hidden="true" /></div>
              <span className="mn-journey-step-number" role="img" aria-label={`Bước ${index + 1}`}>
                <small aria-hidden="true">BƯỚC</small><strong aria-hidden="true">{String(index + 1).padStart(2, '0')}</strong>
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="mn-journey-highlight" aria-hidden="true" />
            </article>
            <span className="mn-journey-milestone" data-step-index={index} aria-hidden="true">
              <small>BƯỚC</small><strong>{String(index + 1).padStart(2, '0')}</strong>
            </span>
            {index < steps.length - 1 && <span className="mn-journey-connector" aria-hidden="true"><span /></span>}
          </Fragment>
        );
      })}
    </div>
  );
}
