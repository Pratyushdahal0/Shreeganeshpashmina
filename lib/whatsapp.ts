export const WHATSAPP='9779849220167';
export function whatsappUrl(message:string){return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`}
