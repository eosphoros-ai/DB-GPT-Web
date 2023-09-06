/**
 * @example
 * GET:/api/v1/chat/db/list
 * =>
 * GetChatDbListResponse
 */

export type DBType =
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
  | 'couchbase'
  | (string & {});

export type IChatDbSchema = {
  comment: string;
  db_host: string;
  db_name: string;
  db_path: string;
  db_port: number;
  db_pwd: string;
  db_type: DBType;
  db_user: string;
};

export type GetChatDbListResponse = IChatDbSchema[];

export type IChatDbSupportTypeSchema = {
  db_type: DBType;
  is_file_db: boolean;
};

export type GetChatDbSupportTypeResponse = IChatDbSupportTypeSchema[];

export type PostChatDbParams = Partial<GetChatDbListResponse[0] & { file_path: string }>;

export type IChatDialogueMessageSchema = {
  role: 'human' | 'view' | 'system' | 'ai';
  context: string | {};
  order: number;
  time_stamp: number | string | null;
};

export type GetChatDialogueMessagesHistoryResponse = IChatDialogueMessageSchema[];

export type IChatDialogueSchema = {
  conv_uid: string;
  user_input: string;
  user_name: string;
  chat_mode: 'chat_with_db_execute' | 'chat_excel' | 'chat_with_db_qa' | 'chat_knowledge' | 'chat_dashboard' | 'chat_execution';
  select_param: string;
};

export type GetChatDialogueListResponse = IChatDialogueSchema[];
