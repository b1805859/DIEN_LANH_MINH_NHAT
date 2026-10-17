import ts from 'typescript';
import postcss from 'postcss';

const properties = ['transform', 'opacity', 'background-color', 'border-color', 'box-shadow'];
export const transitionClass = `transition-[${properties.join(',')}]`;

function isClassContext(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (ts.isJsxAttribute(parent)) return parent.name.getText() === 'className';
    if (
      ts.isCallExpression(parent) &&
      /^(cn|clsx|cva|twMerge|classNames)$/.test(parent.expression.getText())
    )
      return true;
    if (
      ts.isVariableDeclaration(parent) &&
      /(?:classes|classname|class|variants)$/i.test(parent.name.getText())
    )
      return true;
    if (
      ts.isPropertyAssignment(parent) &&
      parent.name.getText().replace(/['"]/g, '') === 'className'
    )
      return true;
    if (ts.isFunctionLike(parent) || ts.isSourceFile(parent)) return false;
  }
  return false;
}

export function repairTransitionClasses(file, text) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function visit(node) {
    if (
      (ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node) ||
        ts.isTemplateHead(node) ||
        ts.isTemplateMiddle(node) ||
        ts.isTemplateTail(node)) &&
      isClassContext(node)
    ) {
      const original = text.slice(node.getStart(source), node.end);
      const replacement = original.replace(/(?<![\w-])transition-all(?![\w-])/g, transitionClass);
      if (replacement !== original)
        edits.push({ start: node.getStart(source), end: node.end, text: replacement });
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  let result = text;
  for (const edit of edits.sort((a, b) => b.start - a.start))
    result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  return result;
}

export function repairCssTransitions(text) {
  const css = postcss.parse(text);
  css.walkDecls('transition', (declaration) => {
    if (!postcss.list.comma(declaration.value).some((value) => /^all(?:\s|$)/.test(value.trim())))
      return;
    declaration.value = postcss.list
      .comma(declaration.value)
      .flatMap((value) => {
        if (!/^all(?:\s|$)/.test(value.trim())) return [value];
        return properties.map((property) => value.replace(/^\s*all\b/, property));
      })
      .join(', ');
  });
  css.walkDecls('transition-property', (declaration) => {
    if (postcss.list.comma(declaration.value).includes('all'))
      declaration.value = properties.join(', ');
  });
  return css.toString();
}
