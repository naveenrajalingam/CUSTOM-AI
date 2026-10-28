import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'solid' | 'outline'
  size?: 'md' | 'sm'
  children: ReactNode
}

/** Link styled as a cut-corner button. */
export function CutLink({ variant = 'solid', size = 'md', className = '', children, ...rest }: Props) {
  const pad = size === 'md' ? 'px-6 py-3.5 text-[0.9375rem]' : 'px-4 py-2.5 text-sm'
  const look =
    variant === 'solid'
      ? 'cut bg-paper text-ink hover:bg-white'
      : 'cut-border text-paper'
  return (
    <a
      className={`inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors duration-300 ${pad} ${look} ${className}`}
      {...rest}
    >
      <span>{children}</span>
    </a>
  )
}
