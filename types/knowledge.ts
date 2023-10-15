export interface IKnowLedge {
  context?: any;
  desc: string;
  docs: string | number;
  gmt_created: string;
  gmt_modified: string;
  id: string | number;
  name: string;
  owner: string;
  vector_type: string;
}

export type BaseDocumentParams = {
  doc_name: string;
  content: string;
  doc_type: string;
};
