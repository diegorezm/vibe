import Prismjs from "prismjs"
import { useEffect } from "react"

import "prismjs/components/prism-javascript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-typescript"

import "./code-theme.css"

interface Props {
  code: string
  lang: string
}

export function CodeView({ code, lang }: Props) {
  useEffect(() => {
    Prismjs.highlightAll()
  }, [code])
  return (
    <pre className="p-2 bg-transparent border-none rounded-none m-0 text-sm">
      <code className={`language-${lang}`}>
        {code}
      </code>
    </pre>
  )
}
