import { useState, useMemo } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { Menu, Table, Space, message, Button, Tooltip } from 'antd';
import PromptModal from '@/components/prompt/prompt-modal';
import { PlusOutlined } from '@ant-design/icons';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { useRequest } from 'ahooks';
import { sendSpacePostRequest } from '@/utils/request';

const items: MenuProps['items'] = [
  {
    label: '公共 Prompts',
    key: 'common',
    icon: <GroupsIcon />,
  },
  {
    label: '私有 Prompts',
    key: 'private',
    icon: <PersonIcon />,
  },
];

const getColumns = (current: string, mutate: Function): ColumnsType<any> => [
  {
    title: '名称',
    dataIndex: 'prompt_name',
    key: 'prompt_name',
  },
  {
    title: '场景',
    dataIndex: 'chat_scene',
    key: 'chat_scene',
  },
  {
    title: '次级场景',
    dataIndex: 'sub_chat_scene',
    key: 'sub_chat_scene',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    render: (content) => (
      <Tooltip placement="topLeft" title={content}>
        {content}
      </Tooltip>
    ),
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (_, record) => (
      <Space size="middle">
        <PromptModal prompt_type={current} item={record} mutate={mutate}>
          <a>编辑</a>
        </PromptModal>
      </Space>
    ),
  },
];

const Prompt = () => {
  const [current, setCurrent] = useState('common');
  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 1000, // 需要用到分页时改为10
      hideOnSinglePage: true, // 单页时隐藏分页器
      showQuickJumper: true,
      showTotal: (total: number, range: Array<number>) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    },
  });

  const { data, loading, run, mutate } = useRequest(
    (params = tableParams, prompt_type = current) => {
      const body = {
        prompt_type,
        ...params.pagination,
      };
      return sendSpacePostRequest('/prompt/list', body);
    },
    {
      onSuccess: (res: any) => {
        setTableParams((prevParams: any) => ({
          ...prevParams,
          pagination: {
            ...prevParams.pagination,
            total: res?.totalCount || res?.data?.length,
          },
        }));
      },
      onError: (err) => {
        message.error(err?.message);
      },
    },
  );

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const params: any = {
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        ...pagination,
      },
    };
    setTableParams(params);
    run(params, current);
  };

  const columns = useMemo(() => getColumns(current, mutate), [current, mutate]);

  const onClick: MenuProps['onClick'] = (e) => {
    const type = e.key;
    setCurrent(type);
    run(tableParams, type);
  };

  return (
    <div>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      <div className="px-6 py-4">
        <div className="flex flex-row-reverse mb-4">
          <PromptModal prompt_type={current} mutate={mutate} setTableParams={setTableParams} pageSize={tableParams.pagination.pageSize}>
            <Button className="flex items-center">
              <PlusOutlined />
              新增 Prompts
            </Button>
          </PromptModal>
          {current === 'common' && (
            <Button className="mr-2 flex items-center" disabled>
              <PlusOutlined />
              新增 Prompts 模版
            </Button>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={data?.data}
          loading={loading}
          rowKey={(record) => record.prompt_name}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{ y: 600 }}
        />
      </div>
    </div>
  );
};

export default Prompt;
