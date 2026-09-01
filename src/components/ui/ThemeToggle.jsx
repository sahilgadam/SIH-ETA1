import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeProvider'
import { useLanguage } from '../../context/LanguageProvider'
import { IconButton } from './IconButton'

export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()

  const isDark = theme === 'dark'

  return (
    <IconButton
      label={isDark ? t('theme.toLight') : t('theme.toDark')}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={className}
    >
      {isDark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </IconButton>
  )
}
