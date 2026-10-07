const { spawnSync } = require('node:child_process');

function run(script) {
  const result = spawnSync('npm', ['run', script], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('prisma:generate');
run('build');

// Preview builds must never apply migrations to the production database.
// Run only after compilation succeeds; a migration failure blocks deployment.
if (process.env.VERCEL_ENV === 'production') {
  run('prisma:deploy');
} else {
  console.log('Skipping database migrations outside Vercel production.');
}
