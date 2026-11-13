/** Vector rendering keeps the approved home wordmark sharp on Retina displays. */
export function HomeLogo({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 242 43" aria-hidden="true" style={{ overflow: 'visible' }}>
    <g fill="#007ec5">
      <path d="M0 20 18 2h9l17 18-5 5L23 9 6 26H1Zm7 4 8-8v23H7Zm12-9 5-4 14 14v14H19Z" />
      <path d="M33 5h5v12l-5-5Z" />
    </g>
    <path d="M23 27h6v12h-6Z" fill="white" />
    <text x="54" y="27" fill="#007ec5" fontSize="26" fontWeight="800" textLength="186" lengthAdjust="spacingAndGlyphs" style={{ fontFamily: 'var(--font-be-vietnam-pro), sans-serif' }}>MINH NHẬT</text>
    <text x="54" y="40" fill="#6383a5" fontSize="6.6" fontWeight="600" textLength="186" lengthAdjust="spacingAndGlyphs" style={{ fontFamily: 'var(--font-be-vietnam-pro), sans-serif' }}>ĐIỆN LẠNH · SỬA CHỮA · LẮP ĐẶT TẠI NHÀ</text>
  </svg>;
}
