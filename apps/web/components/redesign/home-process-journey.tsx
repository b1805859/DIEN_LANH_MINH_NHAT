'use client';

import { Fragment, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { CalendarDays, ClipboardList, Headset, MessagesSquare, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const stepIcons = [MessagesSquare, CalendarDays, ClipboardList, Wrench, Headset];
const stepIllustrations = [
  { src: '/images/process/process-step-2.png', alt: 'Nhân viên tiếp nhận thông tin và tư vấn qua điện thoại' },
  { src: '/images/process/process-step-3.png', alt: 'Kỹ thuật viên kiểm tra máy lạnh tại nhà' },
  { src: '/images/process/process-step-1.png', alt: 'Khách hàng trao đổi và xác nhận thông tin qua điện thoại' },
  { src: '/images/process/process-step-4.png', alt: 'Kỹ thuật viên thực hiện dịch vụ máy lạnh' },
  { src: '/images/process/process-step-5.png', alt: 'Kỹ thuật viên và khách hàng hài lòng sau dịch vụ' },
];

export function HomeProcessJourney({ steps }: { steps: string[][] }) {
  const root = useRef<HTMLDivElement>(null);

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
      },
      (context) => {
        const reduced = !!context.conditions?.reduce;
        section.dataset.journeyState = 'pending';
        const timeline = gsap.timeline({
          paused: true,
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

          const journeyStart = 0.6;
          cards.forEach((_, index) => {
            const arrival = journeyStart + index * 0.6;
            timeline.set(stepTargets[index], { attr: { 'data-journey-step-state': 'active' } }, arrival);
            if (index > 0) timeline.set(stepTargets[index - 1],
              { attr: { 'data-journey-step-state': 'complete' } }, arrival);
            timeline.to(icons[index], { scale: 1.05, duration: 0.3, ease: 'power2.out' }, arrival);
            timeline.to(highlights[index], { opacity: 1, duration: 0.3, ease: 'power2.out' }, arrival);
            timeline.to(icons[index], { scale: 1, duration: 0.45, ease: 'power2.out' }, arrival + 0.3);
            timeline.to(highlights[index], { opacity: 0, duration: 0.45, ease: 'power2.out' }, arrival + 0.3);
            if (fills[index]) timeline.to(fills[index],
              { scaleX: 1, scaleY: 1, duration: 0.45, ease: 'power2.inOut' }, arrival + 0.15);
          });
        }
        // Release transforms only after the complete sequence; the scoped hover
        // rules can then take over without competing with an entrance tween.
        const finish = timeline.duration();
        timeline.set([...cards, ...milestones], { attr: { 'data-journey-step-state': 'complete' } }, finish);
        if (reduced) timeline.set([heading, ...cards], { clearProps: 'opacity' }, finish);
        timeline.set(icons, { clearProps: 'transform' }, finish);
        timeline.set(highlights, { clearProps: 'opacity' }, finish);
        // Give each milestone about a second; keep the reduced-motion fade short.
        timeline.timeScale(reduced ? 1 : 0.55);
        const replay = () => {
          section.dataset.journeyState = 'playing';
          // Replay emphasis without resetting the scroll-controlled visibility.
          // Reuse one timeline and one trigger for both directions of entry.
          timeline.pause(0).invalidate().restart();
        };
        ScrollTrigger.create({
          trigger: section,
          start: 'clamp(top 80%)',
          end: 'clamp(bottom top)',
          onEnter: replay,
          onEnterBack: replay,
        });
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
  }, [steps]);

  return (
    <div className="mn-process-grid" ref={root} role="list" aria-label="Các bước phục vụ">
      {steps.map(([title, description], index) => {
        const StepIcon = stepIcons[index % stepIcons.length];
        const illustration = stepIllustrations[index];
        return (
          <Fragment key={title}>
            <article role="listitem">
              {illustration && <div className="mn-process-illustration">
                <Image src={illustration.src} alt={illustration.alt} fill
                  sizes="(max-width: 440px) calc(100vw - 88px), (max-width: 700px) 40vw, (max-width: 1000px) 28vw, 230px" />
              </div>}
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
