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
  onChange,
  className,
  uri,
  editorInstanceRef,
}: MonacoEditorProps & {
  editorInstanceRef?: (ref: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>) => void;
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
						onChange?.((editor?.current?.getValue?.() as string), event);
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
      if (value === editor.current.getValue()) {
        return;
      }

      const model = editor.current.getModel();
      __prevent_trigger_change_event.current = true;
      editor.current.pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      model?.pushEditOperations(
        [],
        [
          {
            range: model?.getFullModelRange(),
            text: (value as string  | null),
          },
        ],
        undefined
      );
      editor.current.pushUndoStop();
      __prevent_trigger_change_event.current = false;
    }
  }, [value]);

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
      });
    }
  }, [className, options]);

  // useEffect(() => {
  //   if (editor.current) {
  //     editor.current.layout();
  //   }
  // }, [width, height]);

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
