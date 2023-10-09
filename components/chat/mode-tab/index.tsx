/**
 * Preview and Editor tab component
 */
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import './index.css';
import { useContext } from 'react';
import { ChatContext } from '@/app/chat-context';
import { Radio } from 'antd';
import Icon, { AppstoreFilled } from '@ant-design/icons';
import StarsSvg from '@/icons/stars-svg';

export default function ModeTab() {
  const { isContract, setIsContract, scene } = useContext(ChatContext);
  const isShow = scene && ['chat_with_db_execute', 'chat_dashboard'].includes(scene as string);

  if (!isShow) {
    return null;
  }

  return (
    <Radio.Group
      value={isContract}
      defaultValue={true}
      buttonStyle="solid"
      onChange={() => {
        setIsContract(!isContract);
      }}
    >
      <Radio.Button value={false}>
        <Icon component={StarsSvg} className="mr-1" />
        Preview
      </Radio.Button>
      <Radio.Button value={true}>
        <AppstoreFilled className="mr-1" />
        Editor
      </Radio.Button>
    </Radio.Group>
  );
}
