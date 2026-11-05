export const contactFields = ['name', 'email', 'message'] as const
export type ContactField = (typeof contactFields)[number]
export type ContactValues = Record<ContactField, string>
export type ContactError = 'required' | 'email' | 'rejected'
export type ContactErrors = Partial<Record<ContactField, ContactError>>

export function validateContact(values: ContactValues, validEmail: boolean): ContactErrors {
  const errors: ContactErrors = {}
  for (const field of contactFields) {
    if (!values[field].trim()) errors[field] = 'required'
  }
  if (!errors.email && !validEmail) errors.email = 'email'
  return errors
}

export function contactErrorCode(code: string): ContactError {
  if (code === 'REQUIRED_FIELD_MISSING' || code === 'REQUIRED_FIELD_EMPTY') return 'required'
  if (code === 'TYPE_EMAIL') return 'email'
  return 'rejected'
}
