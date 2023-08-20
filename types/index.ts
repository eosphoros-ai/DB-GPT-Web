import { NextApiRequest, NextPage } from 'next/types';
import { Session } from 'next-auth';

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

export interface IDatabaseItem {
  comment: string;
  db_host: string;
  db_name: string;
  db_path: string;
  db_port: number;
  db_pwd: string;
  db_type: string;
  db_user: string;
}

export type SQLType = 'Mysql' | 'Oracle' | 'SqlServer' | 'SQLite' | 'INFORMIX' | 'Redis' | 'MongoDB' | 'HBase' | 'Neo4J' | 'CouchDB' | 'DuckDB';
export type SQLItem = { name: SQLType; enable: boolean };
