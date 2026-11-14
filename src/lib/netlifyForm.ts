/**
 * Posts a form to Netlify Forms. The form must be registered by name: the
 * prerender step writes a hidden copy of each one into index.html.
 *
 * Netlify limits (docs, checked Phase 6): one file per field, 8 MB per request
 * including text fields, and uploads time out after 30 seconds.
 *
 * FormData is sent as multipart without a Content-Type header, so the browser
 * sets the boundary and file uploads work.
 */
export async function submitNetlifyForm(formName: string, data: FormData) {
  data.set('form-name', formName);
  const res = await fetch('/', { method: 'POST', body: data });
  if (!res.ok) throw new Error(`Form submission failed with status ${res.status}`);
}

/** Copies the form's fields, dropping empty file inputs so Netlify does not store blanks. */
export function formDataFrom(form: HTMLFormElement) {
  const data = new FormData(form);
  for (const [key, value] of [...data.entries()]) {
    if (value instanceof File && value.size === 0) data.delete(key);
  }
  return data;
}

const SHRINK_OVER = 1.5 * 1024 * 1024;
const LONG_EDGE = 2000;

/**
 * Phone photos are often 3–6 MB each. Three of them would miss Netlify's 30 second
 * upload timeout on a slow connection, so large JPEG/PNG/WebP files are scaled to
 * 2000px on the long edge as JPEG before sending. Formats the browser cannot draw
 * (HEIC outside Safari) are sent as they are.
 */
export async function shrinkImages(data: FormData, fields: readonly string[]) {
  for (const key of fields) {
    const file = data.get(key);
    if (!(file instanceof File) || file.size <= SHRINK_OVER || !/^image\/(jpeg|png|webp)$/.test(file.type)) continue;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, LONG_EDGE / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
      if (blob && blob.size < file.size) {
        data.set(key, new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }));
      }
    } catch {
      /* Could not decode it: send the original. */
    }
  }
  return data;
}

export function totalFileBytes(data: FormData) {
  let total = 0;
  for (const value of data.values()) if (value instanceof File) total += value.size;
  return total;
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
