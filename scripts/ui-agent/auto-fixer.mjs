import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { repairTransitionClasses, repairCssTransitions } from './class-repair.mjs';
import { root, output, sourceIndex, runAudit } from './auditor.mjs';

const hash = (text) => createHash('sha256').update(text).digest('hex');
const changed = [];
const verification = [];

async function save(file, text) {
  const absolute = path.join(root, file);
  const previous = await readFile(absolute, 'utf8').catch(() => null);
  if (previous === text) return;
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, text);
  changed.push({
    file,
    beforeHash: previous === null ? null : hash(previous),
    afterHash: hash(text),
  });
}

async function applyFixes() {
  const skill = await readFile(path.join(root, 'scripts/ui-agent/ui-motion-skill.md'), 'utf8');
  if (!skill.includes('60FPS GPU Mandate')) throw new Error('Motion skill is missing or invalid.');
  for (const { file, text } of await sourceIndex()) {
    if (/\.[jt]sx?$/.test(file)) await save(file, repairTransitionClasses(file, text));
    else if (file.endsWith('.css')) await save(file, repairCssTransitions(text));
  }
  const css = await readFile(
    path.join(root, 'scripts/ui-agent/templates/ui-interactions.css'),
    'utf8',
  );
  await save('apps/web/app/ui-interactions.css', css);
  const layoutFile = 'apps/web/app/layout.tsx';
  let layout = await readFile(path.join(root, layoutFile), 'utf8');
  if (!layout.includes("import './ui-interactions.css'")) {
    layout = layout.replace(
      "import './motion.css';",
      "import './motion.css';\nimport './ui-interactions.css';",
    );
    if (!layout.includes("import './ui-interactions.css'"))
      throw new Error('Could not locate stylesheet import; review layout.tsx.');
    await save(layoutFile, layout);
  }
}

async function check(label, args, env = {}) {
  console.log(`Verifying ${label}…`);
  const nodeCommand = args[0] === 'exec' && args[1] === '--' && args[2] === 'node';
  const executable = nodeCommand ? process.execPath : 'npm';
  const commandArgs = nodeCommand ? args.slice(3) : args;
  const generatedFiles =
    label === 'build' ? ['apps/web/next-env.d.ts', 'apps/web/tsconfig.json'] : [];
  const generatedSnapshots = await Promise.all(
    generatedFiles.map(async (file) => ({
      file,
      text: await readFile(path.join(root, file), 'utf8'),
    })),
  );
  const result = spawnSync(executable, commandArgs, {
    cwd: root,
    env: {
      ...process.env,
      ...env,
      ...(label === 'build' ? { UI_AUDIT_DIST_DIR: '.next-ui-build', NODE_ENV: 'production' } : {}),
    },
    encoding: 'utf8',
    timeout: 300000,
    maxBuffer: 8 * 1024 * 1024,
  });
  // Next writes these files even when its output directory is isolated.
  for (const snapshot of generatedSnapshots)
    await writeFile(path.join(root, snapshot.file), snapshot.text);
  const log = (result.stdout || '') + (result.stderr || '');
  verification.push({
    label,
    command: `${nodeCommand ? 'node' : 'npm'} ${commandArgs.join(' ')}`,
    passed: result.status === 0,
    exitCode: result.status,
  });
  await writeFile(path.join(output, `verification-${label}.log`), log);
  if (result.status !== 0)
    throw new Error(
      `${label} failed. See audit-output/verification-${label}.log. Source changes retained for review.`,
    );
}

export async function writeSummary(before, after, extra = {}) {
  const files = [...new Set([...changed.map((item) => item.file), ...(extra.files || [])])];
  const manifest = JSON.parse(
    await readFile(path.join(output, 'refactor-manifest.json'), 'utf8').catch(() => '{"files":[]}'),
  );
  files.push(...manifest.files.filter((file) => !files.includes(file)));
  const optional = async (file) =>
    JSON.parse(await readFile(path.join(output, file), 'utf8').catch(() => 'null'));
  const [routes, additional, responsive, contrast, preservation] = await Promise.all([
    optional('after-routes-audit-report.json'),
    optional('after-additional-audit-report.json'),
    optional('responsive-verification.json'),
    optional('contrast-verification.json'),
    optional('business-preservation.json'),
  ]);
  const comparability =
    before.targetUrl === after.targetUrl &&
    JSON.stringify(before.paths) === JSON.stringify(after.paths);
  const lines = [
    '# Báo cáo cải thiện UI / UX & Motion',
    '',
    `Trước: ${before.generatedAt} · Sau: ${after.generatedAt}`,
    `URL: ${after.targetUrl}`,
    `Phạm vi: ${after.paths.join(', ')} × desktop 1440×900 / mobile 390×844.`,
    '',
    '| Chỉ số (lượt xuất hiện theo viewport) | Trước | Sau | Giảm |',
    '| --- | ---: | ---: | ---: |',
    ...Object.keys(before.summary).map(
      (key) =>
        `| ${key} | ${before.summary[key]} | ${after.summary[key]} | ${before.summary[key] - after.summary[key]} |`,
    ),
    '',
    `Số target có transition được bổ sung (chênh lệch tổng): ${before.summary.missingTransitions - after.summary.missingTransitions}.`,
    '',
    '## Ảnh đối chiếu',
    '',
    '| Desktop trước | Desktop sau |',
    '| --- | --- |',
    '| ![Trước](before-desktop.png) | ![Sau](after-desktop.png) |',
    '',
    '| Mobile trước | Mobile sau |',
    '| --- | --- |',
    '| ![Trước](before-mobile.png) | ![Sau](after-mobile.png) |',
    '',
    '## File sửa trong lần chạy / refactor thủ công',
    '',
    ...files.map((file) => `- ${file}`),
    '',
    '## Xác minh',
    '',
    ...verification.map(
      (item) => `- ${item.label}: ${item.passed ? 'PASS' : 'FAIL'} (${item.command})`,
    ),
    ...[...(manifest.notes || []), ...(extra.notes || [])].map((note) => `- ${note}`),
    '',
    '## Kiểm tra bổ sung',
    '',
    ...[routes, additional]
      .filter(Boolean)
      .map(
        (report) =>
          `- ${report.paths.join(', ')}: ${report.summary.pages} lượt viewport, ${report.summary.axeViolations} vi phạm Axe, ${report.summary.smallTouchTargets} target nhỏ, ${report.summary.missingTransitions} thiếu transition. [JSON](${report.phase}-audit-report.json)`,
      ),
    ...(responsive
      ? [
          `- Responsive ${responsive.map((item) => item.width).join('/')}px: ${responsive.every((item) => !item.horizontalOverflow && !item.header.overlaps.length && !item.smallTouchTargets) ? 'PASS; không tràn ngang, không chồng target header' : 'cần xem chi tiết'}. [Bằng chứng](responsive-verification.json)`,
        ]
      : []),
    ...(contrast
      ? [
          `- Placeholder đặt lịch: ${contrast.before.ratio.toFixed(2)}:1 → ${contrast.ratio.toFixed(2)}:1 trên nền màu đặc. [Bằng chứng](contrast-verification.json)`,
        ]
      : []),
    ...(preservation
      ? [
          `- ${preservation.results.filter((item) => item.unchanged).length}/${preservation.results.length} kiểm tra giữ nguyên source nghiệp vụ. [Bằng chứng](business-preservation.json)`,
        ]
      : []),
    '- [Trạng thái tương tác](interaction-verification.json) · [Kiểm tra tính lặp lại](idempotence-verification.json) · [Log xác minh](verification.json)',
    '',
    '## Giới hạn',
    '',
    `- Phạm vi Before/After đồng nhất: ${comparability ? 'có' : 'KHÔNG; không dùng chênh lệch làm kết luận'}.`,
    '- Axe là kiểm tra tự động; các mục incomplete, trải nghiệm bàn phím và nội dung vẫn cần đánh giá thủ công.',
    '- Số liệu không phải điểm phần trăm accessibility hoặc chứng nhận WCAG/60FPS.',
    '- Auto-fixer sửa các mẫu xác định (class transition và chính sách CSS); lỗi ngữ nghĩa / thiết kế phức tạp cần đọc bằng chứng và sửa component.',
    '- Không gửi biểu mẫu đặt lịch, không sửa dữ liệu hoặc tài khoản.',
    '',
  ];
  await writeFile(path.join(output, 'improvement-summary.md'), lines.join('\n'));
}

async function main() {
  await mkdir(output, { recursive: true });
  let before;
  try {
    before = JSON.parse(await readFile(path.join(output, 'before-audit-report.json'), 'utf8'));
  } catch {
    before = await runAudit({ phase: 'before' });
  }
  const currentUrl = process.env.TARGET_URL || before.targetUrl;
  const currentPaths = (process.env.UI_AUDIT_PATHS || before.paths.join(',')).split(',');
  if (
    currentUrl !== before.targetUrl ||
    JSON.stringify(currentPaths) !== JSON.stringify(before.paths)
  ) {
    before = await runAudit({ phase: 'before', targetUrl: currentUrl, paths: currentPaths });
  }
  // Consume the report's concrete source candidates; semantic corrections are reviewed separately.
  const candidates = [
    ...new Set(
      before.pages.flatMap((page) =>
        page.dom.elements
          .filter(
            (element) =>
              element.smallTarget || element.missingTransition || element.unsafeTransitions.length,
          )
          .flatMap((element) => element.sourceCandidates.map((item) => item.file)),
      ),
    ),
  ];
  console.log(
    `Review evidence: ${candidates.length} source candidates, ${before.summary.smallTouchTargets} small targets.`,
  );
  await applyFixes();
  await writeFile(
    path.join(output, 'fix-manifest.json'),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), sourceCandidates: candidates, changes: changed },
      null,
      2,
    ),
  );
  let after;
  try {
    await check('typecheck', ['exec', '--workspace', '@minhnhat/web', '--', 'tsc', '--noEmit']);
    await check('lint', ['run', 'lint', '--workspace', '@minhnhat/web']);
    await check('pipeline-tests', [
      'exec',
      '--',
      'node',
      '--test',
      'scripts/ui-agent/class-repair.test.mjs',
      'scripts/ui-agent/auditor.test.mjs',
    ]);
    if (process.env.UI_FIX_BUILD !== '0') await check('build', ['run', 'build:web']);
    after = await runAudit({ phase: 'after', targetUrl: currentUrl, paths: currentPaths });
    if (process.env.UI_FIX_INTERACTIONS !== '0')
      await check(
        'interactions',
        ['exec', '--', 'node', 'scripts/ui-agent/verify-interactions.mjs'],
        { TARGET_URL: currentUrl },
      );
  } finally {
    await writeFile(path.join(output, 'verification.json'), JSON.stringify(verification, null, 2));
  }
  await writeSummary(before, after);
  const failures = [
    'axeViolations',
    'missingTransitions',
    'unsafeTransitions',
    'smallTouchTargets',
    'horizontalOverflows',
    'layoutAnimations',
  ].filter((key) => after.summary[key] > 0);
  if (after.staticFindings.length || after.pages.some((page) => page.runtimeErrors.length))
    failures.push('static findings / runtime errors');
  if (
    after.pages.some(
      (page) =>
        page.reducedMotion.elementsWithTransitions.length ||
        page.reducedMotion.activeLayoutAnimations.length,
    )
  )
    failures.push('reduced-motion policy');
  if (failures.length)
    throw new Error(
      `Verification needs component review: ${failures.join(', ')}. See improvement-summary.md and after-audit-report.json.`,
    );
  console.log('UI verification passed. See audit-output/improvement-summary.md.');
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.join(root, 'scripts/ui-agent/auto-fixer.mjs')
) {
  await main().catch((error) => {
    console.error(`UI fixer: ${error.message}`);
    process.exitCode = 1;
  });
}
