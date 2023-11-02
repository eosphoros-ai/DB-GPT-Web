import React from 'react';

import { ChartHeader } from '../chart-header';

import { ChartSelector } from './chart-selector';

import type { VisToolbarProps } from '../types';

export const VisToolbar: React.FC<VisToolbarProps> = ({ config, optionalChartTypes, onSelectChange, chartType }) => {
  const toolbar = () => {
    return (
      <>
        {config?.extra?.[0]}
        {config?.chartSelector ? (
          <ChartSelector
            optionalChartTypes={optionalChartTypes}
            onChartTypeChange={(value) => {
              onSelectChange?.({ type: 'chartSelector', value: value });
            }}
            chartType={chartType}
          />
        ) : null}
        {config?.extra?.[1]}
      </>
    );
  };
  if (config) {
    return <ChartHeader title={config?.title} toolbar={toolbar()} />;
  } else {
    return null;
  }
};
