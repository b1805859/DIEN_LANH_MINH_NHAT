import test from 'node:test';
import assert from 'node:assert/strict';
import { repairTransitionClasses, repairCssTransitions, transitionClass } from './class-repair.mjs';

test('repairs JSX classes while preserving business strings, handlers and comments', () => {
  const input =
    '// transition-all is a rule\nconst message = "transition-all";\nconst View = () => <button title="transition-all" onClick={() => save("transition-all")} className="rounded transition-all hover:transition-all">Xác nhận</button>;';
  const result = repairTransitionClasses('fixture.tsx', input);
  assert.ok(result.includes(`className="rounded ${transitionClass} hover:${transitionClass}"`));
  assert.ok(result.includes('const message = "transition-all"'));
  assert.ok(result.includes('title="transition-all"'));
  assert.ok(result.includes('onClick={() => save("transition-all")}'));
  assert.ok(result.startsWith('// transition-all is a rule'));
  assert.equal(repairTransitionClasses('fixture.tsx', result), result);
});

test('repairs dynamic templates and cva variants without evaluating interpolations', () => {
  const input =
    'const style = cva("transition-all", {variants:{size:{small:"hover:transition-all"}}}); const View = () => <a className={`transition-all ${selected ? "transition-all" : "plain"}`}/>;';
  const result = repairTransitionClasses('fixture.tsx', input);
  assert.equal((result.match(/transition-\[/g) || []).length, 4);
  assert.ok(result.includes('${selected ?'));
  assert.ok(result.includes(': "plain"}'));
});

test('does not alter longer unrelated identifiers or class tokens', () => {
  const input = 'const className="not-transition-all transition-all-custom";';
  assert.equal(repairTransitionClasses('fixture.tsx', input), input);
});

test('repairs CSS shorthand without splitting easing functions, preserving keyframes', () => {
  const input =
    '.button { transition: all 180ms cubic-bezier(0.22,1,0.36,1); } @keyframes enter { from { opacity: 0; } to { opacity: 1; } }';
  const result = repairCssTransitions(input);
  assert.ok(!result.includes('transition: all'));
  assert.equal((result.match(/cubic-bezier\(0.22,1,0.36,1\)/g) || []).length, 5);
  assert.ok(result.includes('@keyframes enter { from { opacity: 0; } to { opacity: 1; } }'));
  assert.equal(repairCssTransitions(result), result);
});

test('repairs CSS transition-property and preserves safe transition declarations', () => {
  const input = '.button { transition-property: all; } .card { transition: opacity 200ms ease; }';
  const result = repairCssTransitions(input);
  assert.ok(
    result.includes(
      'transition-property: transform, opacity, background-color, border-color, box-shadow',
    ),
  );
  assert.ok(result.includes('.card { transition: opacity 200ms ease; }'));
  const multiline = '.card { transition:\n  transform 180ms ease,\n  opacity 180ms ease; }';
  assert.equal(repairCssTransitions(multiline), multiline);
});
