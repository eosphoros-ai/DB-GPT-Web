import { Advice, AdvisorConfig, ChartId, Datum, FieldInfo, PureChartKnowledge } from '@antv/ava';
import { ReactNode } from 'react';

export type ChartType = ChartId | string;

export type Specification = Advice['spec'] | any;
export type RuleConfig = AdvisorConfig['ruleCfg'];

export type AutoChartProps = {
  data: Datum[];
  /** 首要指定的图表类型 */
  chartType?: ChartType;
  /** 控制哪些图表包括在推荐范围内，哪些排除掉 */
  scopeOfCharts?: {
    exclude?: string[];
    include?: string[];
  };
  /** 用户自定义的推荐规则 */
  ruleConfig?: RuleConfig;
};

export type ChartKnowledge = PureChartKnowledge & { toSpec?: any };

/** 自定义图表信息 */
export type CustomChart = {
  /** 唯一的图表类型/ID */
  chartType: ChartType;
  /** 图表知识，参照 AVA CKB */
  chartKnowledge: ChartKnowledge;
  /** 图表中文名 */
  chineseName?: string;
};

/** 基于 spec 生成图表配置的函数入参 */
export type GetChartConfigProps = {
  data: Datum[];
  spec: Specification;
  dataProps: FieldInfo[];
  chartType?: ChartType;
};

/** 自定义图表推荐配置 */
export type CustomAdvisorConfig = {
  /** 用户自定义的图表类型，包括图表基础信息，推荐逻辑等 */
  charts?: CustomChart[];
  /** 控制哪些图表包括在推荐范围内，哪些排除掉 */
  scopeOfCharts?: {
    exclude?: string[];
    include?: string[];
  };
  /** 用户自定义的推荐规则 */
  ruleConfig?: RuleConfig;
};

export type ChartSelectorProps = {
  /** 显示在列表里的待选图表 */
  optionalChartTypes?: ChartType[];
  /** 选择图表的回调 */
  onChartTypeChange?: (value: ChartType) => void;
  /** 自定义的图表，需要定义 类型（唯一 Id）、icon、中文名（显示名） */
  customCharts?: Pick<CustomChart, 'chartType' | 'chineseName'>[];
  /** 当前选中的图表类型 */
  chartType?: ChartType;
};

export type VisToolbarProps = {
  config?: {
    /** 标题 */
    title?: ReactNode;
    /** 特定图表类型对应的 toolbar 配置 */
    //configByChartType?: Record<ChartType, any>; //TODO
    /** 是否开启图表选择 */
    chartSelector?: boolean;
    /** 业务自定义的功能插槽，第一个在内置控件的左边，第二个在右边 */
    extra?: [ReactNode, ReactNode];
  };
  chartType?: ChartType;
  optionalChartTypes?: ChartType[];
  /** 工具栏操作的回调*/
  onSelectChange?: (params: { type: string; value: string }) => void;
};
