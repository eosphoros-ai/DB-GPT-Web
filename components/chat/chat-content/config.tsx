import { CopyOutlined, LinkOutlined, SyncOutlined } from '@ant-design/icons';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import { Button, Image, Tag, message } from 'antd';
import copy from 'copy-to-clipboard';
import { Reference } from '@/types/chat';

type MarkdownComponent = Parameters<typeof ReactMarkdown>['0']['components'];

const basicComponents: MarkdownComponent = {
  code({ inline, node, className, children, style, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="relative">
        <Button
          className="absolute right-3 top-2 text-gray-300 hover:!text-gray-200 bg-gray-700"
          type="text"
          icon={<CopyOutlined />}
          onClick={() => {
            const success = copy(children as string);
            message[success ? 'success' : 'error'](success ? 'Copy success' : 'Copy failed');
          }}
        />
        <SyntaxHighlighter language={match?.[1] ?? 'javascript'} style={oneDark}>
          {children as string}
        </SyntaxHighlighter>
      </div>
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
};

const extraComponents: MarkdownComponent = {};

const markdownComponents = {
  ...basicComponents,
  ...extraComponents,
};

export default markdownComponents;
