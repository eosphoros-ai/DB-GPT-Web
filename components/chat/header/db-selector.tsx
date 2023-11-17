import { ChatContext } from '@/app/chat-context';
import { apiInterceptors, postChatModeParamsList } from '@/client/api';
import { IDB } from '@/types/chat';
import { FileTwoTone } from '@ant-design/icons';
import { useAsyncEffect } from 'ahooks';
import { Select } from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';

function DBSelector() {
  const { scene, dbParam, setDbParam } = useContext(ChatContext);

  const [dbMapper, setDBMapper] = useState<IDB[]>([]);

  useAsyncEffect(async () => {
    const [, res] = await apiInterceptors(postChatModeParamsList(scene as string));
    setDBMapper(res ?? []);
  }, [scene]);

  const dbOpts = useMemo(() => dbMapper.map?.((db: IDB) => ({ label: db.param, value: db.param })), [dbMapper]);

  useEffect(() => {
    if (dbOpts.length && !dbParam) {
      setDbParam(dbOpts[0].value);
    }
  }, [dbOpts, setDbParam, dbParam]);

  if (!dbOpts.length) return null;

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
          <FileTwoTone className="mr-1" />
          {item.label}
        </Select.Option>
      ))}
    </Select>
  );
}

export default DBSelector;
