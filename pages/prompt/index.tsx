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
import { PromptProps } from '@/types/db'
import { useTranslation } from 'react-i18next';


const Prompt = () => {
  const { t } = useTranslation();

  const items: MenuProps['items'] = [
    {
      label: t('Public') + ' Prompts',
      key: 'common',
      icon: <GroupsIcon />,
    },
    {
      label: t('Private') + ' Prompts',
      key: 'private',
      icon: <PersonIcon />,
    },
  ];

  const getColumns = (current: string, mutate: Function): ColumnsType<PromptProps> => [
    {
      title: t('Prompt_Info_Name'),
      dataIndex: 'prompt_name',
      key: 'prompt_name',
    },
    {
      title: t('Prompt_Info_Scene'),
      dataIndex: 'chat_scene',
      key: 'chat_scene',
    },
    {
      title: t('Prompt_Info_Sub_Scene'),
      dataIndex: 'sub_chat_scene',
      key: 'sub_chat_scene',
    },
    {
      title: t('Prompt_Info_Content'),
      dataIndex: 'content',
      key: 'content',
      render: (content) => (
        <Tooltip placement="topLeft" title={content}>
          {content}
        </Tooltip>
      ),
    },
    {
      title: t('Operation'),
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record) => (
        <Space size="middle">
          <PromptModal prompt_type={current} item={record} mutate={mutate}>
            <a>{t('Edit')}</a>
          </PromptModal>
        </Space>
      ),
    },
  ];

  const [current, setCurrent] = useState('common');
  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 1000, // When pagination is needed, change it to 10.
      hideOnSinglePage: true, // Hide the paginator when it's a single page.
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
              {t('Add')} Prompts
            </Button>
          </PromptModal>
          {current === 'common' && (
            <Button className="mr-2 flex items-center" disabled>
              <PlusOutlined />
              {t('Add')} Prompts {t('template')}
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
