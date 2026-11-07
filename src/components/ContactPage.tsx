import '../contact.css'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { profile } from '../data/portfolio'
import { ContactForm } from './ContactForm'
import { Github, Linkedin } from './SocialIcons'
import { Card } from './ui/card'

export function ContactPage() {
  const { t } = useTranslation()
  return (
    <main id="main" tabIndex={-1} className="contact-page">
      <header className="contact-heading">
        <h1>{t('navigation.contact')}</h1>
        <Link to="/portfolio" className="back-link">
          <ArrowLeft size={15} aria-hidden="true" /> {t('contact.back')}
        </Link>
      </header>
      <div className="contact-layout">
        <div className="contact-information">
          <p className="contact-introduction">{t('contact.introduction')}</p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          <div className="contact-socials">
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={17} aria-hidden="true" /> GitHub{' '}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={17} aria-hidden="true" /> LinkedIn{' '}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <Card className="contact-form-panel">
          <ContactForm formId={import.meta.env.VITE_FORMSPREE_FORM_ID?.trim()} />
        </Card>
      </div>
    </main>
  )
}
