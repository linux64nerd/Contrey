/**
 * WhatsApp Deep Link Generator
 * Generates pre-filled wa.me links for one-click settlement reminders and trip summaries.
 */

export function cleanPhoneNumber(phone: string): string {
  // Strip non-digits, keep leading country code
  return phone.replace(/[^0-9]/g, '');
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

  const message = [
    `✈️ *Contrey Travel Settlement Reminder*`,
    tripName ? `📍 *Trip:* ${tripName}` : '',
    ``,
    `Hey ${debtorName}! 👋`,
    `Here is the minimal settlement breakdown for our group trip:`,
    `👉 *Amount Due:* ${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
    `👉 *Pay To:* ${creditorName}`,
    upiId ? `👉 *UPI ID:* \`${upiId}\`` : '',
    ``,
    `Please settle this transfer when you get a moment. You can also scan the instant QR code on Contrey!`,
    `_Sent via Contrey – Travel Smart, Spend Smart_ 🌴`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
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
    `🌴 *${tripName} – Group Trip Expense Summary*`,
    `_Managed with Contrey – Travel Smart, Spend Smart_`,
    ``,
    `📊 *Total Group Spent:* ${totalSpent}`,
    `👥 *Travelers:* ${numTravelers} Friends`,
    `⚖️ *Fair Share / Person:* ${fairShare}`,
    ``,
    `Check the full itemized breakdown, charts, and minimal settlement plan on your Contrey Dashboard!`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
