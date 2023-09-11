type ChartValue = {
  name: string;
  type: string;
  value: number;
};

/**
 * dashboard chart type
 */
export type ChartData = {
  chart_desc: string;
  chart_name: string;
  chart_sql: string;
  chart_type: string;
  chart_uid: string;
  column_name: Array<string>;
  values: Array<ChartValue>;
};

export type getChatHistoryResponse = IChatDialogueMessageSchema[];

export type IChatDialogueSchema = {
  conv_uid: string;
  user_input: string;
  user_name: string;
  chat_mode: 'chat_with_db_execute' | 'chat_excel' | 'chat_with_db_qa' | 'chat_knowledge' | 'chat_dashboard' | 'chat_execution';
  select_param: string;
};

export type GetChatDialogueListResponse = IChatDialogueSchema[];

export type IChatDialogueMessageSchema = {
  role: 'human' | 'view' | 'system' | 'ai';
  context: string | {};
  order: number;
  time_stamp: number | string | null;
  model_name: string;
};

export type ModelType = 'proxyllm' | (string & {});

export type LLMOption = { label: string; icon: string };
