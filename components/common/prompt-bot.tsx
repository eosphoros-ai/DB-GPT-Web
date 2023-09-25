import { useState } from 'react'
import { List, FloatButton, Popover, Tooltip, Form, message, Select } from 'antd'
import { useUserInfo } from '@/store/useUserInfo'
import { useRequest } from 'ahooks'
import { sendSpacePostRequest } from '@/utils/request'

type SelectTableProps = {
  data: any,
  loading: boolean,
  submit: (prompt: string) => void
  close: () => void
}

const SelectTable: React.FC<SelectTableProps> = ({ data, loading, submit, close }) => {
  const handleClick = (content: string) => () => {
    submit(content)
    close()
  }

  return (
      <div
      style={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      >
        <List
          dataSource={data?.data}
          loading={loading}
          rowKey={(record: any) => record.prompt_name}
          renderItem={(item) => (
            <List.Item key={item.prompt_name} onClick={handleClick(item.content)}>
              <Tooltip title={item.content}>
                <List.Item.Meta
                  style={{ cursor: 'copy' }}
                  title={item.prompt_name}
                  description={`场景：${item.chat_scene}，次级场景：${item.sub_chat_scene}`}
                />
              </Tooltip>
            </List.Item>
          )}
        />
      </div>
    )
}

type PromptBotProps = {
  submit: (prompt: string) => void
}

const PromptBot: React.FC<PromptBotProps> = ({ submit }) => {
  const userInfo: any = useUserInfo()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('common')

  const { data, loading } = useRequest(() => {
    const body = {
      user_name: userInfo.loginName,
      prompt_type: current,
    }
    return sendSpacePostRequest('/prompt/list', body)
  }, {
    refreshDeps: [current],
    onError: (err) => {
      message.error(err?.message)
    }
  })

  const close = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleChange = (value: string) => {
    setCurrent(value)
  }
  
  return (
    <Popover
      title={
        <Form.Item label="Prompt 类型">
          <Select
            style={{ width: 130 }}
            value={current}
            onChange={handleChange}
            options={[
              {
                label: '公共 Prompts',
                value: 'common',
              },
              {
                label: '私有 Prompts',
                value: 'private',
              },
            ]}
          />
        </Form.Item>
      }
      content={<SelectTable { ...{ data, loading, submit, close } } />}
      placement="topRight"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Tooltip title={'点击选择 Prompt'}>
        <FloatButton />
      </Tooltip>
    </Popover>
  )
}

export default PromptBot
