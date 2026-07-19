function optionalPublicValue(value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized || normalized.includes("00000") || normalized.includes("your-")) {
    return null;
  }
  return normalized;
}

const whatsappNumber = optionalPublicValue(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(
  /\D/g,
  ""
);

export const SITE_CONFIG = {
  contactPhone: optionalPublicValue(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  contactEmail: optionalPublicValue(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  factoryAddress:
    optionalPublicValue(process.env.NEXT_PUBLIC_FACTORY_ADDRESS) ||
    "Peenya Industrial Area, Bengaluru, Karnataka",
  whatsappNumber: whatsappNumber || null,
  linkedinUrl: optionalPublicValue(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  facebookUrl: optionalPublicValue(process.env.NEXT_PUBLIC_FACEBOOK_URL),
};
