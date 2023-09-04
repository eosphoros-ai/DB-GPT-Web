'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useColorScheme, Table, Stack, Typography, Breadcrumbs, Link, Box } from '@/lib/mui';
import { Popover, Pagination } from 'antd';
import { sendSpacePostRequest } from '@/utils/request';
import { useTranslation } from 'react-i18next';
const page_size = 20;

const ChunkList = () => {
  const router = useRouter();
  const { mode } = useColorScheme();
  const spaceName = useSearchParams().get('spacename');
  const documentId = useSearchParams().get('documentid');
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);
  const [chunkList, setChunkList] = useState<any>([]);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchChunks() {
      const data = await sendSpacePostRequest(`/knowledge/${spaceName}/chunk/list`, {
        document_id: documentId,
        page: 1,
        page_size,
      });
      if (data.success) {
        setChunkList(data.data.data);
        setTotal(data.data.total);
        setCurrent(data.data.page);
      }
    }
    fetchChunks();
  }, []);
  return (
    <Box
      className="p-4"
      sx={{
        '&': {
          height: '90%',
        },
      }}
    >
      <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ marginBottom: '20px' }}>
        <Breadcrumbs aria-label="breadcrumbs">
          <Link
            onClick={() => {
              router.push('/datastores');
            }}
            key="Knowledge Space"
            underline="hover"
            color="neutral"
            fontSize="inherit"
          >
            {t('Knowledge_Space')}
          </Link>
          <Link
            onClick={() => {
              router.push(`/datastores/documents?name=${spaceName}`);
            }}
            key="Knowledge Space"
            underline="hover"
            color="neutral"
            fontSize="inherit"
          >
            {t('Documents')}
          </Link>
          <Typography fontSize="inherit">{t('Chunks')}</Typography>
        </Breadcrumbs>
      </Stack>
      <Box
        className="p-4 overflow-auto"
        sx={{
          '&': {
            height: '90%',
          },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {chunkList.length ? (
          <>
            <Table
              color="primary"
              variant="plain"
              size="lg"
              sx={{
                '& tbody tr: hover': {
                  backgroundColor: mode === 'light' ? 'rgb(246, 246, 246)' : 'rgb(33, 33, 40)',
                },
                '& tbody tr: hover a': {
                  textDecoration: 'underline',
                },
              }}
            >
              <thead>
                <tr>
                  <th>{t('Name')}</th>
                  <th>{t('Content')}</th>
                  <th>{t('Meta_Data')}</th>
                </tr>
              </thead>
              <tbody>
                {chunkList.map((row: any) => (
                  <tr key={row.id}>
                    <td>{row.doc_name}</td>
                    <td>
                      {
                        <Popover content={row.content} trigger="hover">
                          {row.content.length > 10 ? `${row.content.slice(0, 10)}...` : row.content}
                        </Popover>
                      }
                    </td>
                    <td>
                      {
                        <Popover content={JSON.stringify(row.meta_info || '{}', null, 2)} trigger="hover">
                          {row.meta_info.length > 10 ? `${row.meta_info.slice(0, 10)}...` : row.meta_info}
                        </Popover>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : (
          <></>
        )}
      </Box>
      <Stack className="mt-5" direction="row" justifyContent="flex-end">
        <Pagination
          defaultPageSize={20}
          showSizeChanger={false}
          current={current}
          total={total}
          onChange={async (page) => {
            const data = await sendSpacePostRequest(`/knowledge/${spaceName}/chunk/list`, {
              document_id: documentId,
              page,
              page_size,
            });
            if (data.success) {
              setChunkList(data.data.data);
              setTotal(data.data.total);
              setCurrent(data.data.page);
            }
          }}
          hideOnSinglePage
        />
      </Stack>
    </Box>
  );
};

export default ChunkList;
