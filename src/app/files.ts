// Saving and sharing files: native Android storage/share sheet in the app, downloads on the web.
import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();

function toBase64(bytes: Uint8Array): string {
  let s = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(s);
}

async function blobBytes(b: Blob): Promise<Uint8Array> {
  return new Uint8Array(await b.arrayBuffer());
}

export function safeName(s: string): string {
  return s.replace(/[^\p{L}\p{N} _.-]+/gu, '').trim().replace(/\s+/g, ' ').slice(0, 80) || 'Sheet music';
}

/** Saves a file. On Android: Documents/SheetMusic/<name>. On the web: browser download. Returns a message. */
export async function saveFile(name: string, data: Blob): Promise<string> {
  if (!isNative()) {
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    return `Downloaded ${name}`;
  }
  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  const b64 = toBase64(await blobBytes(data));
  try {
    await Filesystem.writeFile({ path: `SheetMusic/${name}`, data: b64, directory: Directory.Documents, recursive: true });
    return `Saved to Documents/SheetMusic/${name}`;
  } catch {
    await shareFile(name, data);
    return 'Choose where to save the file';
  }
}

/** Opens the share sheet (Drive, WhatsApp, e-mail, MuseScore, ...). */
export async function shareFile(name: string, data: Blob): Promise<void> {
  if (!isNative()) {
    const file = new File([data], name, { type: data.type });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: name });
      return;
    }
    await saveFile(name, data);
    return;
  }
  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  const { Share } = await import('@capacitor/share');
  const res = await Filesystem.writeFile({ path: name, data: toBase64(await blobBytes(data)), directory: Directory.Cache });
  await Share.share({ title: name, files: [res.uri] });
}
