import Editor, { OnChange } from '@monaco-editor/react';
import { useEffect, useMemo } from 'react';
import { format } from "sql-formatter";

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: OnChange,
  thoughts: string
}

export default function MonacoEditor({
  value,
  language = 'mysql',
  onChange,
  thoughts
}: MonacoEditorProps) {
  // merge value and thoughts
  const editorValue = useMemo(() => {
    if (thoughts && thoughts.length > 0) {
      return `-- ${thoughts} \n${value}`
    }
    return value
  }, [value, thoughts])
  return (
    <Editor
      value={format(editorValue)}
      language={language}
      onChange={onChange}
      theme='vs-dark'
      options={{
        minimap: {
          enabled: false
        },
        wordWrap: 'on'
      }}
    /> 
  )
}