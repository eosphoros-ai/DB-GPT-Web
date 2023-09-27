import React from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import './index.css';

interface IKnowledge {
  name: string;
  vector_type: string;
  docs: string | number;
  owner: string;
}

interface IProps {
  index?: number;
  item?: IKnowledge;
  t?: any;
  handleCardClick: () => void;
  handleDeleteClick: (e: any, item: any) => void;
}

export default function StoresCard(props: IProps) {
  const { index, item, t, handleCardClick, handleDeleteClick } = props;
  return (
    <>
      <div onClick={handleCardClick} className="text-lg font-bold text-black mx-4 mb-1 mt-6">
        <ContentPasteSearchOutlinedIcon className="mr-[5px] text-[#2AA3FF]" />
        {item?.name}
      </div>
      <div className="flex mb-6">
        <div className="mx-8">
          <div className="text-[#2AA3FF]">{item?.vector_type}</div>
          <div className="text-xs text-black">{t('Vector')}</div>
        </div>
        <div className="mx-8">
          <div className="text-[#2AA3FF]">{item?.owner}</div>
          <div className="text-xs text-black">{t('Owner')}</div>
        </div>
        <div className="mx-8">
          <div className="text-[#2AA3FF]">{item?.docs || 0}</div>
          <div className="text-xs text-black">{t('Docs')}</div>
        </div>
      </div>
      <div
        className="absolute right-2.5 top-2.5 text-[#CD2029]"
        onClick={(e) => {
          handleDeleteClick(e, item);
        }}
      >
        <DeleteOutlineIcon className="text-3xl" />
      </div>
    </>
  );
}
