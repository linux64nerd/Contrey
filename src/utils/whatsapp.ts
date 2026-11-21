/**
 * WhatsApp Deep Link Generator
 * Generates pre-filled wa.me links for one-click settlement reminders and trip summaries.
 */

export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone);
  return cleaned.length >= 7 && cleaned.length <= 15;
}

export function generateSettlementWhatsAppUrl(
  debtorPhone: string,
  debtorName: string,
  creditorName: string,
  amount: number,
  currencySymbol: string,
  upiId?: string,
  tripName?: string
): string {
  const cleanPhone = cleanPhoneNumber(debtorPhone);
  const safeDebtorName = debtorName.trim().slice(0, 50) || 'Traveler';
  const safeCreditorName = creditorName.trim().slice(0, 50) || 'Friend';
  const safeAmount = Math.max(0, isFinite(amount) ? amount : 0);

  const message = [
    `✈️ *Contrey Travel Settlement Reminder*`,
    tripName ? `📍 *Trip:* ${tripName.trim().slice(0, 80)}` : '',
    ``,
    `Hey ${safeDebtorName}! 👋`,
    `Here is the minimal settlement breakdown for our group trip:`,
    `👉 *Amount Due:* ${currencySymbol}${safeAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    `👉 *Pay To:* ${safeCreditorName}`,
    upiId ? `👉 *UPI ID:* \`${upiId.trim()}\`` : '',
    ``,
    `Please settle this transfer when you get a moment. You can also scan the instant QR code on Contrey!`,
    `_Sent via Contrey – Travel Smart, Spend Smart_ 🌴`,
  ]
    .filter(Boolean)
    .join('\n');

  const encodedText = encodeURIComponent(message);
  // If phone is valid, target that phone; otherwise use wa.me share URL to let user select recipient
  return cleanPhone.length >= 7
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
}

export function generateTripSummaryWhatsAppUrl(
  phone: string,
  tripName: string,
  totalSpent: string,
  fairShare: string,
  numTravelers: number
): string {
  const cleanPhone = cleanPhoneNumber(phone);

  const message = [
    `🌴 *${tripName.trim().slice(0, 80)} – Group Trip Expense Summary*`,
    `_Managed with Contrey – Travel Smart, Spend Smart_`,
    ``,
    `📊 *Total Group Spent:* ${totalSpent}`,
    `👥 *Travelers:* ${Math.max(1, numTravelers)} Friends`,
    `⚖️ *Fair Share / Person:* ${fairShare}`,
    ``,
    `Check the full itemized breakdown, charts, and minimal settlement plan on your Contrey Dashboard!`,
  ].join('\n');

  const encodedText = encodeURIComponent(message);
  return cleanPhone.length >= 7
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;
}
