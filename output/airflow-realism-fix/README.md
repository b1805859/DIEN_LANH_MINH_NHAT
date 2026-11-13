# Airflow realism correction

Changes are limited to `apps/web/components/redesign/hero-airflow.tsx`.

- Finder: replace the lower boundary's straight/exponential join with a continuous expansion shared by the shader and particle trajectories.
- Feather upper/lower boundaries, taper the cross section and fade the density with travel distance.
- Remove artificial finder mist patches behind the head and on the floor; use coverage-correct premultiplied alpha.
- Reduce finder particle size/brightness, confine curl to the fan and disperse particles with distance.
- Match the finder image's exact 1660/947 projection.
- Replace reversed GLSL smoothstep arguments with defined descending ramps.
- Preserve the existing people mask and legacy/mobile composition settings.

Validation: targeted ESLint and TypeScript pass. Browser screenshots at t=0,3,6 for widths 390,1024,1440,1920: no console/page errors or horizontal overflow. Reduced-motion screenshots one second apart are identical. Pixel samples at the technician's face/shirt and each family member's face match the airflow-off render exactly. See results.json and scene screenshots.

Preview: after.png. These are local changes; no deployment performed.
