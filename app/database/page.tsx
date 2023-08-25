'use client';

import React, { useState } from 'react';
import { IDatabaseItem, IResponseModal } from '@/types';
import { Add, EditNote, DeleteOutline } from '@mui/icons-material';
import { useRequest } from 'ahooks';
import { sendGetRequest } from '@/utils/request';
import { Button, Card, CardContent, Tooltip } from '@/lib/mui';
import Image from 'next/image';
import { Modal, Spin, message } from 'antd';
import FormDialog from '@/components/DatabasePage/FormDialog';
import axios from '@/utils/ctx-axios';

type DatabaseType = IDatabaseItem['db_type'];

const iconMap: Record<DatabaseType, string> = {
  mysql: '/icons/mysql.png',
  mssql: '/icons/mssql.png',
  duckdb: '/icons/sql.png',
};

export const dbOptions: { value: DatabaseType; label: string; isFileDb?: boolean }[] = [
  { label: 'Mysql', value: 'mysql' },
  { label: 'Mssql', value: 'mssql' },
  { label: 'Duckdb', value: 'duckdb', isFileDb: true },
];

export function isFileDb(dbType: DatabaseType) {
  return dbOptions.find((item) => item.value === dbType)?.isFileDb;
}

function Database() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; info?: IDatabaseItem }>({ open: false });

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
            const { success, err_msg } = await axios.post<null, IResponseModal<null>>(
              `/api/v1/chat/db/delete?db_name=${item.db_name}`,
            );
            if (!success) {
              message.error(err_msg);
              reject();
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
            const fileDb = isFileDb(item.db_type);
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
                        src={iconMap[item.db_type] ?? '/icons/sql.png'}
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
