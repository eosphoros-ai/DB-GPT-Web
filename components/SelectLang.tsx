import React from 'react'
import {
  Box,
  Select,
  Option
} from '@/lib/mui'
import { useTranslation } from 'react-i18next';

const SelectLang = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Box className="absolute top-20 right-20">
        <Select value={i18n.language} onChange={(e, newValue) => {
          i18n.changeLanguage(newValue);
          window.localStorage.setItem('lng', newValue);
        }}>
          <Option value="zh">简体中文</Option>
          <Option value="en">English</Option>
        </Select>
      </Box>
    </>
  )
}

export default SelectLang
