import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { useTheme } from '@/components/theme-provider'

interface MonacoEditorProps {
    language: string
    value: string
    onChange: (value: string) => void
    height: string
}

export function MonacoEditor({ language, value, onChange, height }: MonacoEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()

    useEffect(() => {
        if (editorRef.current) {
            const editor = monaco.editor.create(editorRef.current, {
                value,
                language,
                theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                cursorStyle: 'line',
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                tabCompletion: 'on',
                parameterHints: {
                    enabled: true,
                },
                quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                },
            })


            editor.onDidChangeModelContent(() => {
                onChange(editor.getValue())
            })

            return () => {
                editor.dispose()
            }
        }
    }, [language, onChange, theme])

    useEffect(() => {
        monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light')
    }, [theme])

    return <div ref={editorRef} style={{ height }} />
}

