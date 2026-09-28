// Engraves MusicXML into SVG pages with Verovio (bundled, offline).
import type { VerovioToolkit } from 'verovio/esm';

let toolkit: Promise<VerovioToolkit> | null = null;

function getToolkit(): Promise<VerovioToolkit> {
  if (!toolkit) {
    toolkit = (async () => {
      const [{ default: createVerovioModule }, { VerovioToolkit }] = await Promise.all([
        import('verovio/wasm'),
        import('verovio/esm'),
      ]);
      return new VerovioToolkit(await createVerovioModule());
    })();
  }
  return toolkit;
}

export interface RenderOptions {
  /** Screen width in CSS pixels the pages should fit. */
  width: number;
  /** Zoom in percent. */
  zoom: number;
  /** A4 pages for printing/PDF instead of one long screen page. */
  print?: boolean;
}

export async function renderPages(musicxml: string, opt: RenderOptions): Promise<string[]> {
  const tk = await getToolkit();
  const scale = opt.print ? 40 : Math.max(15, Math.min(120, opt.zoom));
  tk.setOptions(
    opt.print
      ? { pageWidth: 2100, pageHeight: 2970, pageMarginLeft: 100, pageMarginRight: 100, pageMarginTop: 100, pageMarginBottom: 100, scale, footer: 'none', header: 'auto', breaks: 'auto' }
      : {
          pageWidth: Math.round((opt.width * 100) / scale),
          pageHeight: 60000,
          pageMarginLeft: 20,
          pageMarginRight: 20,
          pageMarginTop: 20,
          scale,
          adjustPageHeight: true,
          footer: 'none',
          breaks: 'auto',
        },
  );
  if (!tk.loadData(musicxml)) throw new Error('Could not engrave the score: ' + tk.getLog());
  const pages: string[] = [];
  for (let i = 1; i <= tk.getPageCount(); i++) pages.push(tk.renderToSVG(i));
  return pages;
}
