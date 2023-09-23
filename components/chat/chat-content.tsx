import { memo, useContext } from 'react';
import { CodeOutlined, CopyOutlined, LinkOutlined, RobotOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import { IChatDialogueMessageSchema } from '@/types/chart';
import rehypeRaw from 'rehype-raw';
import classNames from 'classnames';
import { Button, Image, Tag, message } from 'antd';
import { renderModelIcon } from './header/model-selector';
import { ChatContext } from '@/app/chat-context';
import copy from 'copy-to-clipboard';

interface Props {
  content: Omit<IChatDialogueMessageSchema, 'context'> & {
    context:
      | string
      | {
          template_name: string;
          template_introduce: string;
        };
  };
  isChartChat?: boolean;
  onLinkClick: () => void;
}

const mdComps: Parameters<typeof ReactMarkdown>['0']['components'] = {
  code({ inline, node, className, children, style, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="relative">
        <Button
          className="absolute right-3 top-3 text-white hover:!text-white"
          type="text"
          icon={<CopyOutlined />}
          onClick={() => {
            const success = copy(children as string);
            message[success ? 'success' : 'error'](success ? 'Copy success' : 'Copy failed');
          }}
        />
        <SyntaxHighlighter children={String(children)} language={match?.[1] ?? 'javascript'} style={oneDark} />
      </div>
    ) : (
      <code
        {...props}
        style={style}
        className="px-[6px] py-[2px] rounded bg-gray-700 text-gray-100 dark:bg-gray-100 dark:text-gray-800 text-sm whitespace-nowrap"
      >
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
      <Image
        className="min-h-[1rem] max-w-full max-h-full border rounded"
        src={src}
        alt={alt}
        placeholder={
          <Tag icon={<SyncOutlined spin />} color="processing">
            Image Loading...
          </Tag>
        }
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
      />
    );
  },
  blockquote({ children }) {
    return (
      <blockquote className="py-4 px-6 border-l-4 border-blue-600 rounded bg-white my-2 text-gray-500 dark:bg-slate-800 dark:text-gray-200 dark:border-white shadow-sm">
        {children}
      </blockquote>
    );
  },
};

function ChatContent({ content, isChartChat, onLinkClick }: Props) {
  const { scene } = useContext(ChatContext);

  const { context, model_name, role } = content;
  const isRobot = role === 'view';

  return (
    <div
      className={classNames('overflow-x-auto w-full flex px-2 sm:px-4 py-2 sm:py-6 rounded-xl', {
        'bg-slate-100 dark:bg-[#353539]': isRobot,
        'lg:w-full xl:w-full pl-0': ['chat_with_db_execute', 'chat_dashboard'].includes(scene),
      })}
    >
      <div className="mr-2 flex flex-shrink-0 items-center justify-center h-7 w-7 rounded-full text-lg sm:mr-4">
        {isRobot ? renderModelIcon(model_name) || <RobotOutlined /> : <UserOutlined />}
      </div>
      <div className="flex-1 items-center text-md leading-8">
        {/* User Input */}
        {!isRobot && typeof context === 'string' && context}
        {/* Render Report */}
        {isRobot && isChartChat && typeof context === 'object' && (
          <div>
            {`[${context.template_name}]: `}
            <span className="text-[#1677ff] cursor-pointer" onClick={onLinkClick}>
              <CodeOutlined className="mr-1" />
              {context.template_introduce || 'More Details'}
            </span>
          </div>
        )}
        {/* Markdown */}
        {isRobot && typeof context === 'string' && (
          <ReactMarkdown
            children={context
              .replaceAll('\\n', '\n')
              .replace(/<table(\w*=[^>]+)>/gi, '<table $1>')
              .replace(/<tr(\w*=[^>]+)>/gi, '<tr $1>')}
            components={mdComps}
            rehypePlugins={[rehypeRaw]}
          />
        )}
      </div>
    </div>
  );
}

export default memo(ChatContent);
