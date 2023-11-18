import { LinkOutlined, ReadOutlined, SyncOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Table, Image, Tag, Tabs, TabsProps } from 'antd';
import { format } from 'sql-formatter';

import { Reference } from '@/types/chat';
import { AutoChart, BackEndChartType, getChartType } from '@/components/chart';
import { CodePreview } from './code-preview';
import { Datum } from '@antv/ava';

type MarkdownComponent = Parameters<typeof ReactMarkdown>['0']['components'];

const basicComponents: MarkdownComponent = {
  code({ inline, node, className, children, style, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodePreview code={children as string} language={match?.[1] ?? 'javascript'} />
    ) : (
      <code {...props} style={style} className="px-[6px] py-[2px] rounded bg-gray-700 text-gray-100 dark:bg-gray-100 dark:text-gray-800 text-sm">
        {children}
      </code>
    );
  },
  ul({ children }) {
    return <ul className="py-1">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="py-1">{children}</ol>;
  },
  li({ children, ordered }) {
    return <li className={`text-sm leading-7 ml-5 pl-2 text-gray-600 dark:text-gray-300 ${ordered ? 'list-decimal' : 'list-disc'}`}>{children}</li>;
  },
  table({ children }) {
    return (
      <table className="my-2 rounded-tl-md rounded-tr-md max-w-full bg-white dark:bg-gray-900 text-sm rounded-lg overflow-hidden">{children}</table>
    );
  },
  thead({ children }) {
    return <thead className="bg-[#fafafa] dark:bg-black font-semibold">{children}</thead>;
  },
  th({ children }) {
    return <th className="!text-left p-4">{children}</th>;
  },
  td({ children }) {
    return <td className="p-4 border-t border-[#f0f0f0] dark:border-gray-700">{children}</td>;
  },
  h1({ children }) {
    return <h3 className="text-2xl font-bold my-4 border-b border-slate-300 pb-4">{children}</h3>;
  },
  h2({ children }) {
    return <h3 className="text-xl font-bold my-3">{children}</h3>;
  },
  h3({ children }) {
    return <h3 className="text-lg font-semibold my-2">{children}</h3>;
  },
  h4({ children }) {
    return <h3 className="text-base font-semibold my-1">{children}</h3>;
  },
  a({ children, href }) {
    return (
      <div className="inline-block text-blue-600 dark:text-blue-400">
        <LinkOutlined className="mr-1" />
        <a href={href} target="_blank">
          {children}
        </a>
      </div>
    );
  },
  img({ src, alt }) {
    return (
      <div>
        <Image
          className="min-h-[1rem] max-w-full max-h-full border rounded"
          src={src}
          alt={alt}
          placeholder={
            <Tag icon={<SyncOutlined spin />} color="processing">
              Image Loading...
            </Tag>
          }
          fallback="/images/fallback.png"
        />
      </div>
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="py-4 px-6 border-l-4 border-blue-600 rounded bg-white my-2 text-gray-500 dark:bg-slate-800 dark:text-gray-200 dark:border-white shadow-sm">
        {children}
      </blockquote>
    );
  },
  references({ children }) {
    let referenceData;
    try {
      referenceData = JSON.parse(children as string);
    } catch (error) {
      console.log(error);
      return <p className="text-sm">Render Reference Error!</p>;
    }
    const references = referenceData?.references;
    if (!references || references?.length < 1) {
      return null;
    }
    return (
      <div className="border-t-[1px] border-gray-300 mt-3 py-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          <LinkOutlined className="mr-2" />
          <span className="font-semibold">{referenceData.title}</span>
        </p>
        {references.map((reference: Reference, index: number) => (
          <p key={`file_${index}`} className="text-sm font-normal block ml-2 h-6 leading-6 overflow-hidden">
            <span className="inline-block w-6">[{index + 1}]</span>
            <span className="mr-4 text-blue-400">{reference.name}</span>
            {reference?.pages?.map((page, index) => (
              <>
                <span key={`file_page_${index}`}>{page}</span>
                {index < reference?.pages.length - 1 && <span key={`file_page__${index}`}>,</span>}
              </>
            ))}
          </p>
        ))}
      </div>
    );
  },
  summary({ children }) {
    return (
      <div>
        <p className="mb-2">
          <ReadOutlined className="mr-2" />
          <span className="font-semibold">Document Summary</span>
        </p>
        <div>{children}</div>
      </div>
    );
  },
};

const extraComponents: MarkdownComponent = {
  'chart-view': function ({ content }) {
    let data: {
      data: Datum[];
      type: BackEndChartType;
      sql: string;
    };
    try {
      data = JSON.parse(content as string);
    } catch (e) {
      console.log(e, content);
      data = {
        type: 'response_table',
        sql: '',
        data: [],
      };
    }

    const columns = data?.data?.[0]
      ? Object.keys(data?.data?.[0])?.map((item) => {
          return {
            title: item,
            dataIndex: item,
            key: item,
          };
        })
      : [];

    const ChartItem = {
      key: 'chart',
      label: 'Chart',
      children: <AutoChart data={data?.data} chartType={getChartType(data?.type)} />,
    };
    const SqlItem = {
      key: 'sql',
      label: 'SQL',
      children: <CodePreview code={format(data?.sql, { language: 'mysql' }) as string} language={'sql'} />,
    };
    const DataItem = {
      key: 'data',
      label: 'Data',
      children: <Table dataSource={data?.data} columns={columns} />,
    };
    const TabItems: TabsProps['items'] = data?.type === 'response_table' ? [DataItem, SqlItem] : [ChartItem, SqlItem, DataItem];

    return (
      <div>
        <Tabs defaultActiveKey={data?.type === 'response_table' ? 'data' : 'chart'} items={TabItems} size="small" />
      </div>
    );
  },
};

const markdownComponents = {
  ...basicComponents,
  ...extraComponents,
};

export default markdownComponents;
