import type { ReactNode } from 'react';

export type ChartHeaderProps = {
  /** 图表标题 */
  title?: ReactNode;
  /** 图表描述 */
  description?: ReactNode;
  /** 图表工具栏 */
  toolbar?: ReactNode;
};

export type ChartHeaderRef = {
  /** 容器元素 */
  container: HTMLDivElement | null;
};
