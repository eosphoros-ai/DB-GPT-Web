import MarketPlugins from '@/components/agent/market-plugins';
import MyPlugins from '@/components/agent/my-plugins';
import { Tabs } from 'antd';
import { useMemo } from 'react';

function Agent() {
  const items: Required<Parameters<typeof Tabs>[0]['items']> = useMemo(
    () => [
      {
        key: 'market',
        label: 'Market',
        children: <MarketPlugins />,
      },
      {
        key: 'my',
        label: 'My',
        children: <MyPlugins />,
      },
    ],
    [],
  );

  return (
    <div className="h-screen p-6 overflow-y-auto">
      <Tabs type="card" items={items} />
    </div>
  );
}

export default Agent;
