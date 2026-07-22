/**
 * Utility function to format any Indonesian phone number string (e.g. 0812-1768-7815 or +6281217687815)
 * into a valid WhatsApp deep link URL (https://wa.me/6281217687815)
 */
export function formatWhatsAppUrl(phone: string, message: string = ''): string {
  if (!phone) return 'https://wa.me/6281217687815';
  
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  } else if (!digits.startsWith('62') && digits.length > 0) {
    digits = '62' + digits;
  }
  
  if (!digits) digits = '6281217687815';

  const textParam = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${textParam}`;
}

export function formatDisplayPhone(phone: string): string {
  if (!phone) return '0812-1768-7815';
  return phone;
}
