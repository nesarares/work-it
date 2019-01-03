export function stripHtmlToText(html: string) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const res = tmp.textContent || tmp.innerText || '';
  res.replace('\u200B', '');
  return res.trim();
}
