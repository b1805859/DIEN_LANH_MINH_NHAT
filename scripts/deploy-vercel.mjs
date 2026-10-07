import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scope = 'shun-f9e0';
const projects = [
  { project: 'dien-lanh-minh-nhat-api', label: 'API' },
  { project: 'dien-lanh-minh-nhat', label: 'website' },
];

function runVercel(args, label) {
  const result = spawnSync(
    'npx',
    ['--yes', 'vercel@62.2.0', ...args, '--scope', scope],
    { cwd: repoRoot, stdio: 'inherit' },
  );

  if (result.error) {
    console.error(`Không thể chạy Vercel CLI khi ${label}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`${label} thất bại; dừng deploy để tránh báo thành công khi chưa hoàn tất.`);
    process.exit(result.status ?? 1);
  }
}

for (const { project, label } of projects) {
  console.log(`\n=== Deploy ${label} ===`);
  runVercel(['link', '--yes', '--project', project], `liên kết dự án ${project}`);
  runVercel(['deploy', '--prod', '--yes'], `deploy ${project}`);
}

console.log('\nĐã deploy API và website lên production Vercel.');
