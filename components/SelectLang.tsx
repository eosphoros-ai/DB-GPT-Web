import React from 'react'
import { Box, Select, Option } from '@/lib/mui'
import { useTranslation } from 'react-i18next'

const SelectLang = () => {
  const { i18n } = useTranslation()
  return (
    <>
      <Box className="absolute top-12 right-12">
        <Select
          variant="plain"
          color="primary"
          value={i18n.language}
          onChange={(e, newValue) => {
            i18n.changeLanguage(newValue)
            window.localStorage.setItem('lng', newValue)
          }}
        >
          <Option value="zh">简体中文</Option>
          <Option value="en">English</Option>
        </Select>
      </Box>
    </>
  )
}

export default SelectLang
