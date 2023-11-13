import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, postChatModeParamsList } from '@/client/api';
import { DBSvg } from '@/components/icons';
import Icon from '@ant-design/icons';
import { useAsyncEffect } from 'ahooks';
import { Select } from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';

function DBSelector() {
  const { scene, dbParam, setDbParam } = useContext(ChatContext);

  const [dbMapper, setDBMapper] = useState<Record<string, string>>({});

  useAsyncEffect(async () => {
    const [, res] = await apiInterceptors(postChatModeParamsList(scene as string));
    setDBMapper(res ?? {});
  }, [scene]);

  const dbOpts = useMemo(() => Object.entries(dbMapper).map(([k, v]) => ({ label: k, value: v })), [dbMapper]);

  useEffect(() => {
    if (dbOpts.length && !dbParam) {
      setDbParam(dbOpts[0].value);
    }
  }, [dbOpts, setDbParam, dbParam]);

  if (!dbOpts.length) return null;
  console.log(1111, dbOpts);

  return (
    <Select
      value={dbParam}
      className="w-36"
      onChange={(val) => {
        setDbParam(val);
      }}
    >
      {dbOpts.map((item) => (
        <Select.Option key={item.value}>
          <Icon component={DBSvg} className="mr-1" />
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
}

export default DBSelector;
