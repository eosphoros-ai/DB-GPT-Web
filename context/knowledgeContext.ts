import { createContext } from 'react';

type KnowledgeContext = {
  onFinish?: () => void;
};

const knowledgeContext = createContext<KnowledgeContext>({});
const KnowledgeProvider = knowledgeContext.Provider;

export { knowledgeContext, KnowledgeProvider };
