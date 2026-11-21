/**
 * UPI Deep Link Generator
 * Generates UPI payment strings following NPCI specifications:
 * upi://pay?pa=<vpa>&pn=<name>&am=<amount>&cu=INR&tn=<note>
 */

export interface UpiPayloadOptions {
  pa: string; // Payee VPA / UPI ID (e.g. rohan@okaxis)
  pn: string; // Payee Name
  am: number; // Amount
  cu?: string; // Currency (defaults to INR)
  tn?: string; // Transaction Note
}

export function isValidVpa(vpa: string): boolean {
  if (!vpa) return false;
  const clean = vpa.trim();
  // Standard NPCI UPI VPA format
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(clean);
}

export function generateUpiLink(options: UpiPayloadOptions): string {
  const cleanPa = options.pa.trim();
  // Sanitize payee name and note to prevent URL parameter injection
  const cleanPn = options.pn.trim().replace(/[&?=#]/g, '').slice(0, 70);
  const safeAmount = Math.max(0.01, isFinite(options.am) ? options.am : 0.01);
  const cleanTn = (options.tn || 'Contrey Trip Settlement')
    .trim()
    .replace(/[&?=#]/g, '')
    .slice(0, 80);

  const params = new URLSearchParams({
    pa: cleanPa,
    pn: cleanPn || 'Traveler',
    am: safeAmount.toFixed(2),
    cu: options.cu || 'INR',
    tn: cleanTn,
  });

  return `upi://pay?${params.toString()}`;
}
