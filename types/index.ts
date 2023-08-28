import { NextApiRequest, NextPage } from 'next/types';
import { Session } from 'next-auth';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

export type Message = { role: 'human' | 'view'; context: string; createdAt?: Date };

export type AppNextApiRequest = NextApiRequest & {
  session: Session;
};

export interface DialogueItem {
  chat_mode: string;
  conv_uid: string;
  select_param?: string;
  user_input?: string;
  user_name?: string;
}

export type EditorConstructionOptions = NonNullable<Parameters<typeof monacoEditor.editor.create>[1]>;

export interface MonacoEditorBaseProps {
  /**
   * Width of editor. Defaults to 100%.
   */
  width?: string | number;

  /**
   * Height of editor. Defaults to 100%.
   */
  height?: string | number;

  /**
   * The initial value of the auto created model in the editor.
   */
  defaultValue?: string;

  /**
   * The initial language of the auto created model in the editor. Defaults to 'javascript'.
   */
  language?: string;

  /**
   * Theme to be used for rendering.
   * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
   * You can create custom themes via `monaco.editor.defineTheme`.
   */
  theme?: string | null;

  /**
   * Optional string classname to append to the editor.
   */
  className?: string | null;
}

export type EditorWillMount = (monaco: typeof monacoEditor) => void | EditorConstructionOptions;

export type EditorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void;

export type EditorWillUnmount = (
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor,
) => void | EditorConstructionOptions;

export type ChangeHandler = (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => void;

export interface MonacoEditorProps extends MonacoEditorBaseProps {
  /**
   * Value of the auto created model in the editor.
   * If you specify `null` or `undefined` for this property, the component behaves in uncontrolled mode.
   * Otherwise, it behaves in controlled mode.
   */
  value?: string | null;

  /**
   * Refer to Monaco interface {monaco.editor.IStandaloneEditorConstructionOptions}.
   */
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions;

  /**
   * Refer to Monaco interface {monaco.editor.IEditorOverrideServices}.
   */
  overrideServices?: monacoEditor.editor.IEditorOverrideServices;

  /**
   * An event emitted before the editor mounted (similar to componentWillMount of React).
   */
  editorWillMount?: EditorWillMount;

  /**
   * An event emitted when the editor has been mounted (similar to componentDidMount of React).
   */
  editorDidMount?: EditorDidMount;

  /**
   * An event emitted before the editor unmount (similar to componentWillUnmount of React).
   */
  editorWillUnmount?: EditorWillUnmount;

  /**
   * An event emitted when the content of the current model has changed.
   */
  onChange?: ChangeHandler;

  /**
   * Let the language be inferred from the uri
   */
  uri?: (monaco: typeof monacoEditor) => monacoEditor.Uri;
}

export interface IResponseModal<T = any> {
  data: T;
  err_code: string | null;
  err_msg: string | null;
  success: boolean;
}

export interface IDatabaseItem {
  comment: string;
  db_host: string;
  db_name: string;
  db_path: string;
  db_port: number;
  db_pwd: string;
  db_type:
    | 'mysql'
    | 'duckdb'
    | 'sqlite'
    | 'mssql'
    | 'clickhouse'
    | 'oracle'
    | 'postgresql'
    | 'db2'
    | 'access'
    | 'mongodb'
    | 'hbase'
    | 'redis'
    | 'cassandra'
    | 'couchbase';
  db_user: string;
}
