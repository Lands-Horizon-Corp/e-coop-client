import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

import { Printer } from 'lucide-react'
import nunjucks from 'nunjucks'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// Configure nunjucks once (no filesystem loader, autoescape off so HTML/CSS pass through)
nunjucks.configure({ autoescape: false })

interface DebouncedTextareaProps extends Omit<
    React.ComponentProps<typeof Textarea>,
    'onChange' | 'value'
> {
    value: string
    onDebouncedChange: (value: string) => void
    delay?: number
}

const DebouncedTextarea = forwardRef<
    HTMLTextAreaElement,
    DebouncedTextareaProps
>(({ value, onDebouncedChange, delay = 500, ...rest }, ref) => {
    const [local, setLocal] = useState(value)

    useEffect(() => {
        setLocal(value)
    }, [value])

    useEffect(() => {
        if (local === value) return
        const t = setTimeout(() => onDebouncedChange(local), delay)
        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [local, delay])

    return (
        <Textarea
            onChange={(e) => setLocal(e.target.value)}
            ref={ref}
            value={local}
            {...rest}
        />
    )
})
DebouncedTextarea.displayName = 'DebouncedTextarea'

const DEFAULT_JSON = `{
  "title": "Hello world",
  "items": ["one", "two", "three"]
}`

const DEFAULT_TEMPLATE = `<!doctype html>
<html>
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 2rem; }
      h1 { color: #333; }
      li { margin: 0.25rem 0; }
      @media print {
        body { padding: 0; }
      }
    </style>
  </head>
  <body>
    <h1>{{ title }}</h1>
    <ul>
      {% for item in items %}<li>{{ item }}</li>{% endfor %}
    </ul>
  </body>
</html>`

export const NunjucksTemplateEditor = () => {
    const [jsonInput, setJsonInput] = useState(DEFAULT_JSON)
    const [templateInput, setTemplateInput] = useState(DEFAULT_TEMPLATE)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const { rendered, error } = useMemo(() => {
        let data: unknown = {}
        try {
            data = jsonInput.trim() ? JSON.parse(jsonInput) : {}
        } catch (e) {
            return {
                rendered: '',
                error: `JSON error: ${e instanceof Error ? e.message : String(e)}`,
            }
        }
        try {
            const out = nunjucks.renderString(templateInput, data as object)
            return { rendered: out, error: null as string | null }
        } catch (e) {
            return {
                rendered: '',
                error: `Template error: ${e instanceof Error ? e.message : String(e)}`,
            }
        }
    }, [jsonInput, templateInput])

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return
        const doc = iframe.contentDocument
        if (!doc) return
        doc.open()
        doc.write(rendered || '<!doctype html><html><body></body></html>')
        doc.close()
    }, [rendered])

    const handlePrint = () => {
        const iframe = iframeRef.current
        if (!iframe?.contentWindow) return
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
    }

    return (
        <div className="flex h-screen w-full flex-col bg-background text-foreground">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h1 className="text-lg font-semibold">
                    Nunjucks Template Editor
                </h1>
                <Button onClick={handlePrint} size="sm" variant="default">
                    <Printer />
                    Print preview
                </Button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-2">
                <div className="flex min-h-0 flex-col gap-4">
                    <Card className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                        <Label htmlFor="json-input">JSON data</Label>
                        <DebouncedTextarea
                            className="flex-1 resize-none font-mono text-xs ecoop-scroll"
                            delay={500}
                            id="json-input"
                            onDebouncedChange={setJsonInput}
                            placeholder='{ "key": "value" }'
                            spellCheck={false}
                            value={jsonInput}
                        />
                    </Card>

                    <Card className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                        <Label htmlFor="template-input">
                            Nunjucks template
                        </Label>
                        <DebouncedTextarea
                            className="flex-1 resize-none font-mono text-xs ecoop-scroll"
                            delay={500}
                            id="template-input"
                            onDebouncedChange={setTemplateInput}
                            placeholder="<h1>{{ title }}</h1>"
                            spellCheck={false}
                            value={templateInput}
                        />
                    </Card>

                    {error && (
                        <Card className="border-destructive bg-destructive/10 p-3 text-xs text-destructive">
                            {error}
                        </Card>
                    )}
                </div>

                <Card className="flex min-h-0 flex-col overflow-hidden p-0">
                    <div className="flex items-center justify-between border-b border-border px-3 py-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Preview
                        </span>
                    </div>
                    <iframe
                        className="flex-1 w-full bg-white"
                        ref={iframeRef}
                        title="Nunjucks preview"
                    />
                </Card>
            </div>
        </div>
    )
}

export default NunjucksTemplateEditor
