'use client';

import { HomeProcessJourney } from './home-process-journey';

// One illustrated journey and motion sequence across all public pages.
export function ProcessTimeline({ steps }: { steps: string[][] }) {
  return <HomeProcessJourney steps={steps} />;
}
