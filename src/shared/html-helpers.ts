export function extractText(element?: HTMLElement | null) {
  if (!element) return '';

  if (element.tagName === 'TEXTAREA') {
    return (element as HTMLTextAreaElement).value;
  } else if (element.contentEditable === 'true') {
    return element.textContent || '';
  } else {
    return element.textContent || '';
  }
}
