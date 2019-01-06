export function stripHtmlToText(html: string) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const res = tmp.textContent || tmp.innerText || '';
  res.replace('\u200B', '');
  return res.trim();
}

export const intersection = (arr1: any[], arr2: any[]) =>
  arr1.filter(el => arr2.includes(el));

export const toLower = (str: string) => str.toLowerCase();
