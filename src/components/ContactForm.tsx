import { useForm } from '@formspree/react'
import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../data/portfolio'
import {
  contactErrorCode,
  contactFields,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../lib/contact'
import { Button } from './ui/button'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

type ContactFormProps = { formId?: string }

export function ContactForm({ formId }: ContactFormProps) {
  // The hook requires an ID even when sending is unavailable. The submit guard
  // prevents this placeholder from ever making a request.
  const [state, submit, reset] = useForm(formId || 'unconfigured')
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ContactErrors>({})
  const [networkError, setNetworkError] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const pending = useRef(false)

  const providerErrors: ContactErrors = {}
  for (const field of contactFields) {
    const error = state.errors?.getFieldErrors(field)[0]
    if (error) providerErrors[field] = contactErrorCode(error.code)
  }
  const fieldErrors = { ...providerErrors, ...errors }
  const failed = networkError || !!state.errors

  useEffect(() => {
    if (state.succeeded) successRef.current?.focus()
    else if (state.errors) {
      const field = contactFields.find((name) => state.errors?.getFieldErrors(name).length)
      if (field) formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus()
    }
  }, [state.succeeded, state.errors])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formId || pending.current || state.succeeded) return
    const form = event.currentTarget
    const data = new FormData(form)
    const values = Object.fromEntries(
      contactFields.map((field) => [field, String(data.get(field) || '').trim()]),
    ) as ContactValues
    const email = form.elements.namedItem('email') as HTMLInputElement
    const validation = validateContact(values, !email.validity.typeMismatch)
    setErrors(validation)
    const invalid = contactFields.find((field) => validation[field])
    if (invalid) {
      const input = form.elements.namedItem(invalid) as HTMLElement
      input.focus()
      return
    }
    pending.current = true
    setNetworkError(false)
    reset()
    for (const field of contactFields) data.set(field, values[field])
    try {
      await submit(data)
    } catch {
      // Most network failures are returned by the SDK as submission errors.
      // Retain a local fallback for unexpected rejected requests as well.
      reset()
      setNetworkError(true)
    } finally {
      pending.current = false
    }
  }

  function clearError(field: ContactField) {
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
    if (state.errors) reset()
    if (networkError) setNetworkError(false)
  }

  if (state.succeeded) {
    return (
      <div className="contact-success" ref={successRef} tabIndex={-1}>
        <span className="contact-success-icon" aria-hidden="true">
          <Check size={24} />
        </span>
        <h2>{t('contact.successTitle')}</h2>
        <p role="status">{t('contact.successMessage')}</p>
        <Button variant="outline" onClick={reset}>
          {t('contact.sendAnother')}
        </Button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={state.submitting}
      aria-label={t('contact.formLabel')}
    >
      <div className="contact-form-fields">
        {contactFields.map((field) => {
          const error = fieldErrors[field]
          const shared = {
            id: `contact-${field}`,
            name: field,
            required: true,
            'aria-invalid': !!error,
            'aria-describedby': error ? `contact-${field}-error` : undefined,
            onChange: () => clearError(field),
            readOnly: state.submitting,
          }
          return (
            <Field key={field} data-invalid={!!error || undefined}>
              <FieldLabel htmlFor={shared.id}>{t(`contact.fields.${field}`)}</FieldLabel>
              {field === 'message' ? (
                <Textarea {...shared} rows={6} />
              ) : (
                <Input
                  {...shared}
                  type={field === 'email' ? 'email' : 'text'}
                  autoComplete={field}
                />
              )}
              {error && (
                <FieldError id={`contact-${field}-error`}>
                  {t(`contact.errors.${error}`)}
                </FieldError>
              )}
            </Field>
          )
        })}
      </div>
      <input
        className="contact-honeypot"
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {!formId && (
        <p className="contact-notice" id="contact-unavailable">
          {t('contact.unavailable')}{' '}
          <a href={`mailto:${profile.email}`}>{t('contact.emailDirectly')}</a>
        </p>
      )}
      {failed && (
        <p className="contact-notice contact-error" role="alert">
          {t('contact.errors.failed')}{' '}
          <a href={`mailto:${profile.email}`}>{t('contact.emailDirectly')}</a>
        </p>
      )}
      <Button
        className="contact-submit"
        type="submit"
        disabled={!formId || state.submitting}
        aria-describedby={!formId ? 'contact-unavailable' : undefined}
      >
        {state.submitting ? t('contact.sending') : failed ? t('contact.retry') : t('contact.send')}{' '}
        <ArrowRight size={16} aria-hidden="true" />
      </Button>
      <p className="contact-status" role="status">
        {state.submitting
          ? t('contact.sending')
          : Object.keys(errors).some((key) => errors[key as ContactField])
            ? t('contact.errors.checkFields')
            : ''}
      </p>
      <p className="contact-processor">
        {t('contact.processor')}{' '}
        <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noreferrer">
          {t('contact.privacy')}
        </a>
      </p>
    </form>
  )
}
