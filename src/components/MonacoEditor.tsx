import { useEffect, useRef, useState } from 'react'
import * as monaco from 'monaco-editor'
import { useTheme } from '@/components/theme-provider'
import { initVimMode } from 'monaco-vim'
import { Badge } from '@/components/ui/badge'

interface MonacoEditorProps {
    language: string
    value: string
    onChange: (value: string) => void
    height: string
    vimMode: boolean
}

export function MonacoEditor({ language, value, onChange, height, vimMode }: MonacoEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const statusBarRef = useRef<HTMLDivElement>(null)
    const { theme } = useTheme()
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null)
    const [vimModeInstance, setVimModeInstance] = useState<any>(null)
    //const [vimStatus, setVimStatus] = useState<string>('Normal')

    useEffect(() => {
        if (editorRef.current) {
            const newEditor = monaco.editor.create(editorRef.current, {
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

            setEditor(newEditor)

            newEditor.onDidChangeModelContent(() => {
                onChange(newEditor.getValue())
            })

            return () => {
                if (vimModeInstance) {
                    vimModeInstance.dispose()
                }
                newEditor.dispose()
            }
        }
    }, [language, onChange, theme])

    useEffect(() => {
        if (editor) {
            monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs-light')
        }
    }, [theme, editor])

    useEffect(() => {
        if (editor && statusBarRef.current) {
            if (vimMode && !vimModeInstance) {
                const statusNode = statusBarRef.current
                if (statusNode) {
                    const vim = initVimMode(editor, statusNode)
                    setVimModeInstance(vim)
                }
            } else if (!vimMode && vimModeInstance) {
                vimModeInstance.dispose()
                setVimModeInstance(null)
                //setVimStatus('');
            }
        }
    }, [vimMode, editor, vimModeInstance])

    return (
        <div className="flex flex-col">
            <div ref={editorRef} style={{ height }} />
            {vimMode && (
                <div className="flex items-center justify-between p-2 border-t">
                    <Badge variant="outline" className="text-xs flex items-center">
                        Vim: <span ref={statusBarRef} className="ml-1" />
                    </Badge>
                </div>
            )}
        </div>
    )
}

