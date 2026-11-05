import { ArrowRight, FolderCode, House, Mail, Menu, UserRound, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { siteNavigation } from '../data/navigation'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './ui/popover'

const icons = { home: House, work: FolderCode, about: UserRound, contact: Mail }

export function MobileNavigation() {
  const { t } = useTranslation()
  const { pathname, hash, search } = useLocation()
  const [open, setOpen] = useState(false)
  const navigating = useRef(false)
  const titleId = useId()

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 701px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="mobile-menu-trigger" aria-label={t('navigation.openMenu')}>
          <Menu size={19} strokeWidth={1.6} aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="mobile-menu-panel"
        align="end"
        sideOffset={12}
        collisionPadding={16}
        aria-labelledby={titleId}
        onCloseAutoFocus={(event) => {
          // PageEffects handles focus after navigating to another page.
          if (navigating.current) {
            event.preventDefault()
            document.getElementById('main')?.focus({ preventScroll: true })
            navigating.current = false
          } else if (window.matchMedia('(min-width: 701px)').matches) {
            event.preventDefault()
            document
              .querySelector<HTMLAnchorElement>('.site-header .identity')
              ?.focus({ preventScroll: true })
          }
        }}
      >
        <div className="mobile-menu-heading">
          <h2 id={titleId}>{t('navigation.menu')}</h2>
          <PopoverClose className="mobile-menu-close" aria-label={t('navigation.closeMenu')}>
            <X size={16} aria-hidden="true" />
          </PopoverClose>
        </div>
        <nav aria-label={t('navigation.label')}>
          {siteNavigation.map(({ id, href }) => {
            const Icon = icons[id]
            return (
              <NavLink
                className="mobile-menu-link"
                to={href}
                end={id === 'home'}
                key={id}
                onClick={(event) => {
                  if (
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return
                  if (pathname === href && !hash && !search) event.preventDefault()
                  navigating.current = pathname !== href || !!hash || !!search
                  setOpen(false)
                }}
              >
                <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                <span>{t(`navigation.${id}`)}</span>
                <ArrowRight className="mobile-menu-arrow" size={15} aria-hidden="true" />
              </NavLink>
            )
          })}
        </nav>
      </PopoverContent>
    </Popover>
  )
}
