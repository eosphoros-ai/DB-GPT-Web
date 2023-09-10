import Editor, { OnChange } from '@monaco-editor/react';
import classNames from 'classnames';
import { useMemo } from 'react';
import { format } from 'sql-formatter';

interface MonacoEditorProps {
  className?: string;
  value: string;
  language: string;
  onChange?: OnChange;
  thoughts?: string;
}

export default function MonacoEditor({ className, value, language = 'mysql', onChange, thoughts }: MonacoEditorProps) {
  // merge value and thoughts
  const editorValue = useMemo(() => {
    if (language !== 'mysql') {
      return value;
    }
    if (thoughts && thoughts.length > 0) {
      return format(`-- ${thoughts} \n${value}`);
    }
    return format(value);
  }, [value, thoughts]);
  return (
    <Editor
      className={classNames(className)}
      value={editorValue}
      language={language}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: {
          enabled: false,
        },
        wordWrap: 'on',
      }}
    />
  );
}
