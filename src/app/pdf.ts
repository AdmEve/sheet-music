// Vector PDF (A4) from Verovio SVG pages.
import { renderPages } from './render';

export async function makePdf(musicxml: string, title: string): Promise<Blob> {
  const [{ jsPDF }, { svg2pdf }] = await Promise.all([import('jspdf'), import('svg2pdf.js')]);
  const pages = await renderPages(musicxml, { width: 0, zoom: 40, print: true });
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  doc.setProperties({ title, creator: 'Sheet Music' });
  const holder = document.createElement('div');
  holder.style.cssText = 'position:fixed;left:-10000px;top:0;width:800px';
  document.body.appendChild(holder);
  try {
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) doc.addPage('a4', 'portrait');
      holder.innerHTML = pages[i];
      const svg = holder.querySelector('svg') as SVGSVGElement;
      await svg2pdf(svg, doc, { x: 0, y: 0, width: 210, height: 297 });
    }
  } finally {
    holder.remove();
  }
  return doc.output('blob');
}
