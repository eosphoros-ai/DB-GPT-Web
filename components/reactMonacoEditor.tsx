import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React, { useEffect, useRef } from "react";
import { MonacoEditorProps } from "@/types";
import { noop } from "@/utils/editor";

function MonacoEditor({
  width = '100%',
  height = '100%',
  value,
  defaultValue,
  language,
  theme,
  options,
  overrideServices,
  editorWillMount,
  editorDidMount,
  editorWillUnmount,
  className,
  description,
  uri,
  editorInstanceRef,
  handleChange
}: MonacoEditorProps & {
  editorInstanceRef?: (ref: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>) => void;
  description?: string;
  handleChange: (value: string, description?: string) => void;
}) {
  const myMonaco = React.useMemo(() => {
    if (typeof window !== 'undefined' && typeof window?.fetch === 'function') {
			const monaco = require('monaco-editor');
			return monaco;
		}
		return undefined;
	}, []);

  const containerElement = useRef<HTMLDivElement | null>(null);

  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const _subscription = useRef<monaco.IDisposable | null>(null);

  const __prevent_trigger_change_event = useRef<boolean | null>(null);

  const style = React.useMemo(
    () => ({
      width,
      height,
      overflow: 'hidden',
    }),
    [width, height],
  );

  const handleEditorWillMount = () => {
    const finalOptions = editorWillMount?.(myMonaco);
    return finalOptions || {};
  };

  const handleEditorDidMount = () => {
    if (!editor?.current) {
      console.error('Can not get editor element!');
      return;
    }
    editorDidMount?.(editor?.current, myMonaco);
    editorInstanceRef?.(editor?.current);
    if (_subscription) {
			_subscription.current = editor?.current?.onDidChangeModelContent?.((event) => {
					if (!__prevent_trigger_change_event.current) {
            const model = editor?.current?.getModel();
            const ranges = editor?.current?.getVisibleRanges();
            const decorations = model?.getDecorationsInRange(ranges?.[0]);
            if (decorations) {
              let currentDescration;
              for (let i = 0; i < decorations?.length; i++) {
                const decoration = decorations[i];
                const options = decoration.options;
                if (options && options.className === 'my-description') {
                  currentDescration = decoration;
                }
              }
              if (currentDescration) {
                const description = model?.getValueInRange(new myMonaco.Range(currentDescration.range.startLineNumber, 1, currentDescration.range.endLineNumber + 1, 1));
                const lines = model?.getLinesContent();
                const sqlV = lines?.slice(currentDescration.range.endLineNumber);
                handleChange((sqlV?.join('\n') as string), description);
                return;
              }
            }
            handleChange?.((editor?.current?.getValue?.() as string), undefined);
					}
				});
    }
  };

  const handleEditorWillUnmount = () => {
    if (!editor?.current) {
      console.error('Can not get editor element!');
      return;
    }
    editorWillUnmount?.(editor?.current, myMonaco);
  };

  const initMonaco = () => {
    const finalValue = value !== null ? value : defaultValue;
    if (containerElement.current) {
      // Before initializing monaco editor
      const finalOptions = { ...options, ...handleEditorWillMount() };
      const modelUri = uri?.(myMonaco);
      let model = modelUri && myMonaco.editor.getModel(modelUri);
      if (model) {
        // Cannot create two models with the same URI,
        // if model with the given URI is already created, just update it.
        model.setValue(finalValue);
        myMonaco.editor.setModelLanguage(model, language);
      } else {
        model = myMonaco.editor.createModel(finalValue, language, modelUri);
      }
      editor.current = myMonaco.editor.create(
        containerElement.current,
        {
          model,
          ...(className ? { extraEditorClassName: className } : {}),
          ...finalOptions,
          ...(theme ? { theme } : {}),
          automaticLayout: true
        },
        overrideServices,
      );
      // After initializing monaco editor
      handleEditorDidMount();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initMonaco, []);

  useEffect(() => {
    if (editor.current) {

      const model = editor.current.getModel();
      __prevent_trigger_change_event.current = true;
      editor.current.pushUndoStop();
      // After initializing monaco editor
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      model?.pushEditOperations(
        [],
        [
          {
            range: model?.getFullModelRange(),
            text: (`\n${description ? '-- ' + description : ''}\n\n` + value as string  | null),
          },
        ],
        undefined
      );
      const ranges = editor?.current?.getVisibleRanges();
      const decorations = model?.getDecorationsInRange(ranges?.[0]);
      let currentDeIds: string[] = [];
      decorations?.forEach(decoration => {
        if (decoration?.options?.className === 'my-description') {
          currentDeIds.push(decoration.id);
        }
      });
      model?.deltaDecorations(currentDeIds, [{
        range: new myMonaco.Range(1, 1, 3, 1),
        options: {
          before: {
            content: `-- 注释开始`,
          },
          after: {
            content: `-- 注释结束`,
          },
          className: 'my-description'
        }
      }]);
      editor.current.pushUndoStop();
      __prevent_trigger_change_event.current = false;
    }
  }, [value, description]);

  useEffect(() => {
    if (editor.current) {
      const model = editor.current.getModel();
      myMonaco.editor.setModelLanguage(model, language);
    }
  }, [language]);

  useEffect(() => {
    if (editor.current) {
      // Don't pass in the model on update because monaco crashes if we pass the model
      // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
      const { model: _model, ...optionsWithoutModel } = options;
      editor.current.updateOptions({
        ...(className ? { extraEditorClassName: className } : {}),
        ...optionsWithoutModel,
        wordWrap: "on",
      });
    }
  }, [className, options]);

  useEffect(() => {
    myMonaco.editor.setTheme(theme);
  }, [theme]);

  useEffect(
    () => () => {
      if (editor.current) {
        handleEditorWillUnmount();
        editor.current.dispose();

        const model = editor.current.getModel();
        if (model) {
          model.dispose();
        }
      }
      if (_subscription.current) {
        _subscription.current.dispose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div
      ref={containerElement}
      className="react-monaco-editor-container"
      style={style}
    />
  );
}

MonacoEditor.defaultProps = {
  value: null,
  defaultValue: "",
  language: "javascript",
  theme: null,
  options: {},
  overrideServices: {},
  editorWillMount: noop,
  editorDidMount: noop,
  editorWillUnmount: noop,
  onChange: noop,
  className: null,
};

MonacoEditor.displayName = "MonacoEditor";

export default MonacoEditor;
