import React, { useEffect, useState } from 'react';

import { Select, Tooltip } from 'antd';
import { CHARTS_CHINESE_NAME } from '../constants';

import type { ChartSelectorProps } from '../types';
import { DownOutlined } from '@ant-design/icons';

const { Option } = Select;

export const ChartSelector: React.FC<ChartSelectorProps> = ({ optionalChartTypes, onChartTypeChange: onSelectChange, customCharts, chartType }) => {
  const [tempChartType, setTempChartType] = useState<undefined | string>(chartType);
  // 根据输入图表修改内部的图表
  useEffect(() => {
    setTempChartType(chartType?.toLowerCase());
  }, [chartType]);

  // 根据输入可选options，，如果列表不包含默认的type，则修改默认值
  useEffect(() => {
    if (optionalChartTypes?.length && (!tempChartType || !optionalChartTypes?.includes(tempChartType))) {
      setTempChartType(optionalChartTypes[0]);
      onSelectChange?.(optionalChartTypes[0]);
    }
  }, [optionalChartTypes, tempChartType, onSelectChange]);
  return (
    <Select
      value={tempChartType}
      placeholder={'切换图表类型'}
      style={{ width: '110px' }}
      onChange={(value) => {
        onSelectChange?.(value);
      }}
      size={'small'}
    >
      {optionalChartTypes?.map((item) => {
        const name =
          CHARTS_CHINESE_NAME[item.toLowerCase()] ?? customCharts?.find((chart) => chart.chartType.toLowerCase() === item)?.chineseName ?? item;

        return (
          <Option key={item} value={item}>
            <Tooltip title={name} placement={'right'}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DownOutlined />
                <div style={{ marginLeft: '2px' }}>{name}</div>
              </div>
            </Tooltip>
          </Option>
        );
      })}
    </Select>
  );
};
