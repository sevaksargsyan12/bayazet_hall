export interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

const PHONE_PATTERN = /^[+\d][\d\s\-()]{5,19}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(
  payload: Partial<ContactPayload>
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const name = payload.name?.trim() ?? "";
  if (name.length < 2 || name.length > 100) {
    errors.name = "Անունը պետք է լինի 2-ից 100 նիշ";
  }

  const phone = payload.phone?.trim() ?? "";
  if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Մուտքագրեք վավեր հեռախոսահամար";
  }

  const email = payload.email?.trim() ?? "";
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Մուտքագրեք վավեր էլ. հասցե";
  }

  const message = payload.message?.trim() ?? "";
  if (message.length < 10 || message.length > 2000) {
    errors.message = "Հաղորդագրությունը պետք է լինի 10-ից 2000 նիշ";
  }

  return errors;
}
