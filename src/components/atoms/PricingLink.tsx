import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { pricingHref } from '../../lib/domain'

interface PricingLinkProps {
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export default function PricingLink({ className, children, onClick }: PricingLinkProps) {
  const href = pricingHref()

  if (href.startsWith('http')) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
