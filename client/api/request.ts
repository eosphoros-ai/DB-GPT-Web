import { AxiosRequestConfig } from 'axios';
import { GET, POST } from '.';
import { DbListResponse, DbSupportTypeResponse, PostDbParams, ChatFeedBackSchema } from '@/types/db';
import { DialogueListResponse, IChatDialogueSchema, NewDialogueParam, SceneResponse, ChatHistoryResponse } from '@/types/chart';
import { IModelData, StartModelParams, BaseModelParams, SupportModel } from '@/types/model';
import {
  GetEditorSQLRoundRequest,
  GetEditorySqlParams,
  PostEditorChartRunParams,
  PostEditorChartRunResponse,
  PostEditorSQLRunParams,
  PostSQLEditorSubmitParams,
} from '@/types/editor';
import {
  AddKnowledgeParams,
  BaseDocumentParams,
  ChunkListParams,
  DocumentParams,
  IChunkList,
  IDocument,
  IDocumentResponse,
  IKnowLedge,
} from '@/types/knowledge';

/** App */
export const postScenes = () => {
  return POST<null, Array<SceneResponse>>('/api/v1/chat/dialogue/scenes');
};
export const newDialogue = (data: NewDialogueParam) => {
  return POST<NewDialogueParam, IChatDialogueSchema>('/api/v1/chat/dialogue/new', data);
};

/** Database Page */
export const getDbList = () => {
  return GET<null, DbListResponse>('/api/v1/chat/db/list');
};
export const getDbSupportType = () => {
  return GET<null, DbSupportTypeResponse>('/api/v1/chat/db/support/type');
};
export const postDbDelete = (dbName: string) => {
  return POST(`/chat/db/delete?db_name=${dbName}`, undefined);
};
export const postDbEdit = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v1/chat/db/edit', data);
};
export const postDbAdd = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v1/chat/db/add', data);
};
export const postDbTestConnect = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v1/chat/db/test/connect', data);
};

/** Chat Page */
export const getDialogueList = () => {
  return GET<null, DialogueListResponse>('/api/v1/chat/dialogue/list');
};
export const getUsableModels = () => {
  return GET<null, Array<string>>('/api/v1/model/types');
};
export const postChatModeParamsList = (chatMode: string) => {
  return POST<null, Record<string, string>>(`/api/v1/chat/mode/params/list?chat_mode=${chatMode}`);
};
export const postChatModeParamsInfoList = (chatMode: string) => {
  return POST<null, Record<string, string>>(`/api/v1/chat/mode/params/info?chat_mode=${chatMode}`);
};
export const getChatHistory = (convId: string) => {
  return GET<null, ChatHistoryResponse>(`/api/v1/chat/dialogue/messages/history?con_uid=${convId}`);
};
export const postChatModeParamsFileLoad = ({
  convUid,
  chatMode,
  data,
  config,
  model,
}: {
  convUid: string;
  chatMode: string;
  data: FormData;
  model: string;
  config?: Omit<AxiosRequestConfig, 'headers'>;
}) => {
  return POST<FormData, ChatHistoryResponse>(
    `/api/v1/chat/mode/params/file/load?conv_uid=${convUid}&chat_mode=${chatMode}&model_name=${model}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    },
  );
};

/** Menu */
export const delDialogue = (conv_uid: string) => {
  return POST(`/api/v1/chat/dialogue/delete?con_uid=${conv_uid}`);
};

/** Editor */
export const getEditorSqlRounds = (id: string) => {
  return GET<null, GetEditorSQLRoundRequest>(`/api/v1/editor/sql/rounds?con_uid=${id}`);
};
export const postEditorSqlRun = (data: PostEditorSQLRunParams) => {
  return POST<PostEditorSQLRunParams>(`/api/v1/editor/sql/run`, data);
};
export const postEditorChartRun = (data: PostEditorChartRunParams) => {
  return POST<PostEditorChartRunParams, PostEditorChartRunResponse>(`/api/v1/editor/chart/run`, data);
};
export const postSqlEditorSubmit = (data: PostSQLEditorSubmitParams) => {
  return POST<PostSQLEditorSubmitParams>(`/api/v1/sql/editor/submit`, data);
};
export const getEditorSql = (id: string, round: string | number) => {
  return POST<GetEditorySqlParams, string | Array<any>>('/api/v1/editor/sql', { con_uid: id, round });
};

/** knowledge */
export const getArguments = (knowledgeName: string) => {
  return POST<object, IArguments>(`/knowledge/${knowledgeName}/arguments`, {});
};
export const saveArguments = (knowledgeName: string, data: { argument: string }) => {
  return POST<object, IArguments>(`/knowledge/${knowledgeName}/arguments`, {
    data,
  });
};

export const getKnowledgeList = () => {
  return POST<object, Array<IKnowLedge>>('/knowledge/space/list', {});
};
export const getDocumentList = (knowLedgeName: string, data: Record<string, number>) => {
  return POST<Record<string, number>, IDocumentResponse>(`/knowledge/${knowLedgeName}/document/list`, data);
};

export const addDocument = (knowledgeName: string, data: DocumentParams) => {
  return POST<DocumentParams, number>(`/knowledge/${knowledgeName}/document/add`, data);
};

export const addKnowledge = (data: AddKnowledgeParams) => {
  return POST<AddKnowledgeParams, Array<any>>(`/knowledge/space/add`, data);
};

export const syncDocument = (knowLedgeName: string, data: Record<string, Array<number>>) => {
  return POST<Record<string, Array<number>>, string | null>(`/knowledge/${knowLedgeName}/document/sync`, data);
};

export const uploadDocument = (knowLedgeName: string, data: FormData) => {
  return POST<FormData, number>(`/knowledge/${knowLedgeName}/document/upload`, data);
};

export const getChunkList = (spaceName: string, data: ChunkListParams) => {
  return POST<object, IChunkList>(`/knowledge/${spaceName}/chunk/list`, data);
};

export const delDocument = (knowledgeName: string, data: Record<string, string>) => {
  return POST<Record<string, string>, null>(`/knowledge/${knowledgeName}/document/delete`, data);
};

export const delKnowledge = (data: Record<string, string>) => {
  return POST<Record<string, string>, null>(`/knowledge/space/delete`, data);
};

/** models */
export const getModelList = () => {
  return GET<null, Array<IModelData>>('/api/v1/worker/model/list');
};

export const stopModel = (data: BaseModelParams) => {
  return POST<BaseModelParams, boolean>('/api/v1/worker/model/stop', data);
};

export const startModel = (data: StartModelParams) => {
  return POST<StartModelParams, boolean>('/api/v1/worker/model/start', data);
};

export const getSupportModels = () => {
  return GET<null, Array<SupportModel>>('/api/v1/worker/model/params');
};

/** chat feedback **/
export const getChatFeedBackSelect = () => {
  return GET<null, Record<string, string>>(`/api/v1/feedback/select`, undefined);
};
export const getChatFeedBackItme = (conv_uid: string, conv_index: number) => {
  return GET<null, Record<string, string>>(`/api/v1/feedback/find?conv_uid=${conv_uid}&conv_index=${conv_index}`, undefined);
};
export const postChatFeedBackForm = ({ data, config }: { data: ChatFeedBackSchema; config?: Omit<AxiosRequestConfig, 'headers'> }) => {
  return POST<ChatFeedBackSchema, any>(`/api/v1/feedback/commit`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
};
