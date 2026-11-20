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

export function generateUpiLink(options: UpiPayloadOptions): string {
  const params = new URLSearchParams({
    pa: options.pa.trim(),
    pn: options.pn.trim(),
    am: options.am.toFixed(2),
    cu: options.cu || 'INR',
    tn: options.tn || 'Contrey Trip Settlement',
  });

  return `upi://pay?${params.toString()}`;
}
