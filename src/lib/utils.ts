/** Strips spaces, brackets and dashes so a phone string is safe for tel: links. */
export function toTelHref(phone: string): string {
  return phone.replace(/[\s()\-]/g, '')
}
