import { apiInterceptors, postAgentInstall, postAgentMy, postAgentUninstall } from '@/client/api';
import { IMyPlugin } from '@/types/agent';
import { useRequest } from 'ahooks';
import { Card, Spin, Tag, Tooltip, message } from 'antd';
import { useCallback, useState } from 'react';
import MyEmpty from '../common/MyEmpty';
import { ClearOutlined, LoadingOutlined } from '@ant-design/icons';

function MyPlugins() {
  const [isError, setIsError] = useState(false);
  const [actionIndex, setActionIndex] = useState<number | undefined>();

  const {
    data = [],
    loading,
    refresh,
  } = useRequest(async () => {
    const [err, res] = await apiInterceptors(postAgentMy());
    setIsError(!!err);
    return res ?? [];
  });

  const uninstall = async (name: string, index: number) => {
    if (actionIndex) return;
    setActionIndex(index);
    const [err] = await apiInterceptors(postAgentUninstall(name));
    message[err ? 'error' : 'success'](err ? 'failed' : 'success');
    !err && refresh();
    setActionIndex(undefined);
  };

  const renderAction = useCallback(
    (item: IMyPlugin, index: number) => {
      if (index === actionIndex) {
        return <LoadingOutlined />;
      }
      return (
        <Tooltip title="Uninstall">
          <div
            className="w-full h-full"
            onClick={() => {
              uninstall(item.name, index);
            }}
          >
            <ClearOutlined />
          </div>
        </Tooltip>
      );
    },
    [actionIndex],
  );

  return (
    <Spin spinning={loading}>
      {!data.length && !loading && <MyEmpty error={isError} refresh={refresh} />}
      <div className="flex gap-2 md:gap-4">
        {data.map((item, index) => (
          <Card className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4" key={item.id} actions={[renderAction(item, index)]}>
            <h2 className="mb-2 text-base font-semibold">{item.name}</h2>
            {item.version && <Tag>v{item.version}</Tag>}
            {item.type && <Tag>Type {item.type}</Tag>}
            <Tooltip title={item.description}>
              <p className="mt-2 line-clamp-2 text-gray-400 text-sm">{item.description}</p>
            </Tooltip>
          </Card>
        ))}
      </div>
    </Spin>
  );
}

export default MyPlugins;
