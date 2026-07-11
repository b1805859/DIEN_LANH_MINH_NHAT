const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="10" x2="54" y1="8" y2="58" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0EA5E9"/>
      <stop offset="0.48" stop-color="#0060B8"/>
      <stop offset="1" stop-color="#0B172A"/>
    </linearGradient>
    <linearGradient id="cold" x1="14" x2="50" y1="31" y2="51" gradientUnits="userSpaceOnUse">
      <stop stop-color="#CFFAFE"/>
      <stop offset="0.5" stop-color="#22D3EE"/>
      <stop offset="1" stop-color="#E0F2FE"/>
    </linearGradient>
    <linearGradient id="amber" x1="43" x2="53" y1="14" y2="25" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FDE68A"/>
      <stop offset="1" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <path d="M13 20.5A6.5 6.5 0 0 1 19.5 14h25A6.5 6.5 0 0 1 51 20.5v7A3.5 3.5 0 0 1 47.5 31h-31a3.5 3.5 0 0 1-3.5-3.5v-7Z" fill="#F8FAFC"/>
  <path d="M19 23.5h22" stroke="#0B172A" stroke-linecap="round" stroke-width="3" opacity="0.55"/>
  <path d="M20 27h16" stroke="#0B172A" stroke-linecap="round" stroke-width="2" opacity="0.25"/>
  <circle cx="45.5" cy="22.5" r="2.5" fill="url(#amber)"/>
  <path d="M15.5 49V35.5L24 44l8.5-8.5V49" fill="none" stroke="url(#cold)" stroke-linecap="round" stroke-linejoin="round" stroke-width="5.4"/>
  <path d="M38 49V35.5L48.5 49V35.5" fill="none" stroke="#E0F2FE" stroke-linecap="round" stroke-linejoin="round" stroke-width="5.4"/>
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/svg+xml',
    },
  });
}
