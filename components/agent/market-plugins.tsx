import { apiInterceptors, postAgentInstall, postAgentMy, postAgentQuery, postAgentUninstall } from '@/client/api';
import { IAgentPlugin, PostAgentQueryParams } from '@/types/agent';
import { useRequest } from 'ahooks';
import { Button, Card, Form, Input, Spin, Tag, Tooltip, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import MyEmpty from '../common/MyEmpty';
import { ClearOutlined, DownloadOutlined, GithubOutlined, LoadingOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

function MarketPlugins() {
  const [isError, setIsError] = useState(false);
  const [actionIndex, setActionIndex] = useState<number | undefined>();

  const [form] = Form.useForm<PostAgentQueryParams['filter']>();

  const pagination = useMemo<{ pageNo: number; pageSize: number }>(
    () => ({
      pageNo: 1,
      pageSize: 20,
    }),
    [],
  );

  const {
    data = [],
    loading,
    refresh,
  } = useRequest(async () => {
    const queryParams: PostAgentQueryParams = {
      page_index: pagination.pageNo,
      page_size: pagination.pageSize,
      filter: form.getFieldsValue(),
    };
    const [err, res] = await apiInterceptors(postAgentQuery(queryParams));
    setIsError(!!err);
    return res?.datas ?? [];
  });

  const pluginAction = async (name: string, index: number, isInstall: boolean) => {
    if (actionIndex) return;
    setActionIndex(index);
    const [err] = await apiInterceptors((isInstall ? postAgentInstall : postAgentUninstall)(name));
    message[err ? 'error' : 'success'](err ? 'failed' : 'success');
    !err && refresh();
    setActionIndex(undefined);
  };

  const renderAction = useCallback(
    (item: IAgentPlugin, index: number) => {
      if (index === actionIndex) {
        return <LoadingOutlined />;
      }
      return item.installed ? (
        <Tooltip title="Uninstall">
          <div
            className="w-full h-full"
            onClick={() => {
              pluginAction(item.name, index, false);
            }}
          >
            <ClearOutlined />
          </div>
        </Tooltip>
      ) : (
        <Tooltip title="Install">
          <div
            className="w-full h-full"
            onClick={() => {
              pluginAction(item.name, index, true);
            }}
          >
            <DownloadOutlined />
          </div>
        </Tooltip>
      );
    },
    [actionIndex],
  );

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="inline" onFinish={refresh} className="my-4">
        <Form.Item className="!mb-2" name="name" label={'Name'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item className="!mb-2" name="description" label={'Description'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item className="!mb-2" name="author" label={'Author'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item className="!mb-2" name="email" label={'Email'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item className="!mb-2" name="type" label={'Type'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item className="!mb-2" name="version" label={'Version'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item className="!mb-2" name="storage_channel" label={'Storage Channel'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item className="!mb-2" name="storage_url" label={'Storage Url'}>
          <Input allowClear className="w-48" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="reset" icon={<ReloadOutlined />} className="mr-2">
            Reset
          </Button>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      {!data.length && !loading && <MyEmpty error={isError} refresh={refresh} />}
      <div className="flex flex-wrap gap-2 md:gap-4">
        {data.map((item, index) => (
          <Card
            className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
            key={item.id}
            actions={[
              renderAction(item, index),
              <Tooltip title="To Github">
                <div
                  className="w-full h-full"
                  onClick={() => {
                    window.open(item.storage_url, '_blank');
                  }}
                >
                  <GithubOutlined />
                </div>
              </Tooltip>,
            ]}
          >
            <h2 className="mb-2 text-base font-semibold">{item.name}</h2>
            {item.author && <Tag>{item.author}</Tag>}
            {item.version && <Tag>v{item.version}</Tag>}
            {item.type && <Tag>Type {item.type}</Tag>}
            {item.storage_channel && <Tag>{item.storage_channel}</Tag>}
            <Tooltip title={item.description}>
              <p className="mt-2 line-clamp-2 text-gray-400 text-sm">{item.description}</p>
            </Tooltip>
          </Card>
        ))}
      </div>
    </Spin>
  );
}

export default MarketPlugins;
