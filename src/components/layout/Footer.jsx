import { Database } from 'lucide-react'
import { footerSections } from '../../data/content'
import { useLanguage } from '../../context/LanguageProvider'
import { Logo } from '../ui/Logo'

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer id="about" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo showTagline />
            <p className="mt-3 max-w-sm text-sm leading-6 text-fg-muted">
              {t('footer.summary')}
            </p>
          </div>

          <div className="md:col-span-4">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fg">
              <Database className="size-3.5 text-fg-subtle" aria-hidden="true" />
              {t('footer.dataTitle')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-fg-muted">{t('footer.dataBody')}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3">
            {footerSections.map((section) => (
              <div key={section.id}>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-fg">
                  {t(section.titleKey)}
                </h2>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link) => (
                    <li key={link.labelKey + link.href}>
                      <a
                        href={link.href}
                        className="whitespace-nowrap text-sm text-fg-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline"
                      >
                        {t(link.labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-1.5 border-t border-line pt-5 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.rights', { year })}</p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
