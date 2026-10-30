import { isValidElement, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { slugify } from '../../lib/legal'

interface LegalMarkdownProps {
  markdown: string
  hideTitle?: boolean
  compact?: boolean
}

function nodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    return nodeText(props.children)
  }
  return ''
}

export default function LegalMarkdown({
  markdown,
  hideTitle = false,
  compact = false,
}: LegalMarkdownProps) {
  const components: Components = {
    h1: ({ children }) =>
      hideTitle ? null : (
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {children}
        </h1>
      ),
    h2: ({ children }) => {
      const id = slugify(nodeText(children))
      return (
        <h2
          id={id || undefined}
          className={`scroll-mt-28 border-t border-slate-200 font-display font-bold tracking-tight text-slate-900 ${
            compact ? 'mt-7 pt-5 text-lg' : 'mt-10 pt-7 text-xl'
          }`}
        >
          {children}
        </h2>
      )
    },
    h3: ({ children }) => (
      <h3 className={`font-semibold text-slate-900 ${compact ? 'mt-5 text-base' : 'mt-6 text-lg'}`}>
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className={`text-slate-600 ${compact ? 'mt-2.5 text-sm leading-6' : 'mt-3 text-sm leading-7'}`}>
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul
        className={`list-disc space-y-2 pl-5 text-slate-600 marker:text-emerald-500 ${
          compact ? 'mt-2.5 text-sm leading-6' : 'mt-3 text-sm leading-7'
        }`}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className={`list-decimal space-y-2 pl-5 text-slate-600 marker:text-emerald-500 ${
          compact ? 'mt-2.5 text-sm leading-6' : 'mt-3 text-sm leading-7'
        }`}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
    em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
    a: ({ children, href }) => (
      <a
        href={href}
        className="font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 transition-colors hover:text-emerald-800"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    hr: () => <hr className="my-8 border-slate-200" />,
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-4 border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-slate-600">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800">
        {children}
      </code>
    ),
    table: ({ children }) => (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-600">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
    th: ({ children }) => (
      <th className="border border-slate-200 px-3 py-2 font-semibold text-slate-900">{children}</th>
    ),
    td: ({ children }) => <td className="border border-slate-200 px-3 py-2">{children}</td>,
  }

  return (
    <div className={compact ? 'text-sm' : ''}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
