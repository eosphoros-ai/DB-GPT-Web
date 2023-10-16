import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, postAgentMy } from '@/client/api';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

function AgentSelector() {
  const { t } = useTranslation();
  const { agentList, setAgentList } = useContext(ChatContext);

  const { data = [] } = useRequest(async () => {
    const [, res] = await apiInterceptors(postAgentMy());
    if (res && res.length) {
      setAgentList?.([res[0].name]);
    }
    return res ?? [];
  });

  if (!data.length) return null;

  return (
    <Select
      className="w-60"
      value={agentList}
      mode="multiple"
      maxTagCount={1}
      maxTagTextLength={12}
      placeholder={t('Select_Plugins')}
      options={data.map((item) => ({ label: item.name, value: item.name }))}
      allowClear
      onChange={(val) => {
        setAgentList?.(val);
      }}
    />
  );
}

export default AgentSelector;
