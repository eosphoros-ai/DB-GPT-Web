'use client';

import React, { useState } from 'react';
import { IDatabaseItem } from '@/types';
import { Add, EditNote, DeleteOutline } from '@mui/icons-material';
import { useAsyncEffect, useRequest } from 'ahooks';
import { sendGetRequest } from '@/utils/request';
import { Button, Card, CardContent, Tooltip } from '@/lib/mui';
import Image from 'next/image';
import { Modal, Spin, message } from 'antd';
import FormDialog from '@/components/DatabasePage/FormDialog';
import { apiInterceptors, getChatDbSupportType, postChatDbDelete } from '@/utils/api';
import { DBType, GetChatDbSupportTypeResponse } from '@/types/schema.type';

const iconMap: Record<DBType, string> = {
  mysql: '/icons/mysql.png',
  mssql: '/icons/mssql.png',
  duckdb: '/icons/duckdb.png',
  oracle: '/icon/oracle.png',
  sqlite: '/icon/sqlite.png',
  access: '/icon/access.png',
  mongodb: '/icon/mongodb.png',
  db2: '/icon/db2.png',
  hbase: '/icon/hbase.png',
  clickhouse: '/icon/clickhouse.png',
  redis: '/icon/redis.png',
  cassandra: '/icon/cassandra.png',
  couchbase: '/icon/couchbase.png',
  postgresql: '/icon/postgresql.png',
};

export function isFileDb(supportList: GetChatDbSupportTypeResponse, dbType: DBType) {
  return supportList.find((item) => item.db_type === dbType)?.is_file_db;
}

function Database() {
  const [dbSupportList, setDbSupportList] = useState<GetChatDbSupportTypeResponse>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; info?: IDatabaseItem }>({ open: false });

  const getDbSupportList = async () => {
    const [_, data] = await apiInterceptors(getChatDbSupportType());
    setDbSupportList(data ?? []);
  };

  const { data: { data: dbList } = { data: [] }, run: runDbList } = useRequest(async () => {
    try {
      setLoading(true);
      return await sendGetRequest('/v1/chat/db/list');
    } finally {
      setLoading(false);
    }
  });

  const onModify = (item: IDatabaseItem) => {
    setModal({ open: true, info: item });
  };

  const onDelete = (item: IDatabaseItem) => {
    Modal.confirm({
      title: 'Tips',
      content: `Do you Want to delete the ${item.db_name}?`,
      onOk() {
        return new Promise<void>(async (resolve, reject) => {
          try {
            const [err] = await apiInterceptors(postChatDbDelete(item.db_name));
            if (err) {
              message.error(err.message);
              reject();
              return;
            }
            message.success('success');
            runDbList();
            resolve();
          } catch (e: any) {
            message.error(e.message);
            reject();
          }
        });
      },
    });
  };

  useAsyncEffect(async () => {
    await getDbSupportList();
  }, []);

  return (
    <div className="relative p-4 bg-slate-50 dark:bg-transparent min-h-full overflow-y-auto">
      <Spin spinning={loading} className="dark:bg-black dark:bg-opacity-5">
        <div className="px-1 mb-4">
          <Button
            type="primary"
            size="sm"
            onClick={() => {
              setModal({ open: true });
            }}
          >
            <Add fontSize="small" />
            Create
          </Button>
        </div>
        <div className="flex flex-wrap">
          {(dbList as IDatabaseItem[]).map((item) => {
            const fileDb = isFileDb(dbSupportList, item.db_type);
            return (
              <div key={item.db_name} className="px-1 w-full mb-2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5">
                <Card
                  variant="outlined"
                  sx={{
                    boxShadow: 'unset',
                    transition: 'box-shadow .3s ease',
                    ':hover': {
                      boxShadow: '0 10px 16px -6px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center flex-wrap">
                      <Image
                        className="rounded-full border border-gray-200 mr-3"
                        src={iconMap[item.db_type] ?? '/icons/db.png'}
                        alt={item.db_type}
                        width={44}
                        height={44}
                        unoptimized
                      />
                      <Tooltip title={item.db_name}>
                        <div className="flex flex-col flex-1 ">
                          <span className="text-xs text-gray-500 font-normal">[{item.db_type}]</span>
                          <div className="font-bold text-base line-clamp-1 break-all">{item.db_name}</div>
                        </div>
                      </Tooltip>
                    </div>
                    {/* operation */}
                    <div className="flex items-center justify-center">
                      <div
                        className="mr-1 cursor-pointer"
                        onClick={() => {
                          onModify(item);
                        }}
                      >
                        <EditNote color="primary" />
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          onDelete(item);
                        }}
                      >
                        <DeleteOutline className="text-red-500" />
                      </div>
                    </div>
                  </div>
                  <CardContent>
                    <div className="flex items-center justify-start text-sm text-gray-500">
                      <label className="w-20">Username:</label>
                      <span>{item.db_user}</span>
                    </div>
                    <div className="flex items-center justify-start text-sm text-gray-500">
                      <label className="w-20">{fileDb ? 'Path' : 'Host'}:</label>
                      <span>{fileDb ? item.db_path : item.db_host}</span>
                    </div>
                    <div className="flex items-center justify-start text-sm text-gray-500">
                      <label className="w-20">Port:</label>
                      <span>{fileDb ? '-' : item.db_port}</span>
                    </div>
                    <div className="flex items-center justify-start text-sm text-gray-500">
                      <label className="w-20">Remark:</label>
                      <span>{item.comment}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </Spin>
      <FormDialog
        open={modal.open}
        dbSupportList={dbSupportList}
        editValue={modal.info}
        dbNames={(dbList as IDatabaseItem[]).map((item) => item.db_name)}
        onSuccess={() => {
          setModal({ open: false, info: undefined });
          runDbList();
        }}
        onClose={() => {
          setModal({ open: false, info: undefined });
        }}
      />
    </div>
  );
}

export default Database;
