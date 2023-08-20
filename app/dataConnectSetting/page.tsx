'use client';

import React, { useMemo, useState } from 'react';
import { IDatabaseItem, SQLItem, SQLType } from '@/types';
import { Add, Edit } from '@mui/icons-material';
import { useRequest } from 'ahooks';
import { sendGetRequest } from '@/utils/request';
import { Button, Chip, Tab, TabList, TabPanel, Tabs, Card, IconButton, CardContent, Tooltip } from '@/lib/mui';
import MuiLoading from '@/components/MuiLoading';

const SQLTypes: SQLItem[] = [
  { name: 'Mysql', enable: true },
  { name: 'DuckDB', enable: true },
  { name: 'SqlServer', enable: true },
  { name: 'SQLite', enable: true },
  { name: 'MongoDB', enable: true },
  { name: 'Redis', enable: true },
  { name: 'Oracle', enable: false },
  { name: 'INFORMIX', enable: false },
  { name: 'HBase', enable: false },
  { name: 'Neo4J', enable: false },
  { name: 'CouchDB', enable: false },
];

function renderDBItems(dbList: IDatabaseItem[]) {
  return (
    <div className="flex flex-wrap">
      {dbList.map((item) => (
        <div key={item.db_name} className="px-1 w-full mb-2 sm:w-1/2 md:w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4">
          <Card variant="outlined">
            <div className="flex w-full items-center justify-between">
              <Tooltip title={item.db_name} placement="top-start">
                <div className="flex-1">{item.db_name}</div>
              </Tooltip>
              <IconButton aria-label="bookmark Bahamas Islands" variant="plain" color="neutral" size="sm">
                <Edit />
              </IconButton>
            </div>
            <CardContent>
              <div className="flex items-center justify-start text-sm text-gray-500">
                <label className="w-20">Username:</label>
                <span>{item.db_user}</span>
              </div>
              <div className="flex items-center justify-start text-sm text-gray-500">
                <label className="w-20">Password:</label>
                <span>{item.db_pwd.replace(/./g, '*')}</span>
              </div>
              <div className="flex items-center justify-start text-sm text-gray-500">
                <label className="w-20">Host:</label>
                <span>{item.db_host}</span>
              </div>
              <div className="flex items-center justify-start text-sm text-gray-500">
                <label className="w-20">Port:</label>
                <span>{item.db_port}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

function DataConnenctSetting() {
  const [activeKey, setActiveKey] = useState<SQLType>('Mysql');
  const [loading, setLoading] = useState(false);
  const { data: dbList, run: runDbList } = useRequest(async () => {
    try {
      setLoading(true);
      return await sendGetRequest('/v1/chat/db/list');
    } finally {
      setLoading(false);
    }
  });

  const dbMapper = useMemo(() => {
    const list = (dbList?.data ?? []) as IDatabaseItem[];
    const result = SQLTypes.reduce((acc, item) => {
      acc[item.name] = list.filter((db) => db.db_type.toLowerCase() === item.name.toLowerCase());
      return acc;
    }, {} as Record<SQLType, IDatabaseItem[]>);
    return result;
  }, [dbList]);

  return (
    <div className="relative p-4">
      <MuiLoading visible={loading} />
      <Tabs
        aria-label="Pipeline"
        orientation="vertical"
        className="bg-transparent"
        onChange={(_, value) => setActiveKey(value as SQLType)}
        defaultValue={SQLTypes[0].name}
      >
        <TabList>
          {SQLTypes.map((item) => {
            return (
              <Tab key={item.name} value={item.name} disabled={!item.enable}>
                {item.name}
                <Chip size="sm" variant="soft" color={activeKey === item.name ? 'primary' : 'neutral'} sx={{ ml: 1 }}>
                  {dbMapper[item.name].length}
                </Chip>
              </Tab>
            );
          })}
        </TabList>
        {SQLTypes.map((item) => {
          return (
            <TabPanel key={item.name} value={item.name}>
              <div className="px-1 mb-2">
                <Button type="primary">
                  <Add fontSize="small" />
                  New
                </Button>
              </div>
              {renderDBItems(dbMapper[item.name])}
            </TabPanel>
          );
        })}
      </Tabs>
    </div>
  );
}

export default DataConnenctSetting;
