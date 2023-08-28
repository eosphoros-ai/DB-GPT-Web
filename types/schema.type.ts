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

export type GetChatDbListResponse = {
  comment: string;
  db_host: string;
  db_name: string;
  db_path: string;
  db_port: number;
  db_pwd: string;
  db_type: DBType;
  db_user: string;
}[];

export type GetChatDbSupportTypeResponse = {
  db_type: DBType;
  is_file_db: boolean;
}[];
