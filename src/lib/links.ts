export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}/`;

export const whatsappUrl = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
