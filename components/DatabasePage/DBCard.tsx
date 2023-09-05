import React, { useCallback } from 'react';
import { DBOption } from '@/app/database/page';
import { Tooltip } from 'antd';

interface Props {
  info: DBOption;
  onClick?: () => void;
}

function DBCard({ info, onClick }: Props) {
  const handleClick = useCallback(() => {
    if (info.disabled) return;
    onClick?.();
  }, [info.disabled, onClick]);

  return (
    <div
      className={`relative flex flex-col py-4 px-4 w-72 h-32 cursor-pointer rounded-lg justify-between text-black bg-white border-gray-200 border hover:shadow-md dark:border-gray-600 dark:bg-black dark:text-white dark:hover:border-white transition-all ${
        info.disabled ? 'grayscale' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <img className="w-11 h-11 rounded-full mr-4 border border-gray-200 object-contain" src={info.icon} alt={info.label} />
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold">{info.label}</h2>
          {info.disabled && (
            <div className="mt-[2px] rounded-full font-normal bg-gray-100 text-xs h-5 flex items-center px-2 dark:bg-gray-800">Comming soon</div>
          )}
        </div>
      </div>
      <Tooltip title={info.desc}>
        <p className="text-sm text-gray-500 font-normal line-clamp-2">{info.desc}</p>
      </Tooltip>
    </div>
  );
}

export default DBCard;
