import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Row, Col } from 'antd';
import type { ForwardRefRenderFunction } from 'react';
import type { ChartHeaderProps, ChartHeaderRef } from './types';

import './index.css';

const ChartHeader: ForwardRefRenderFunction<ChartHeaderRef, ChartHeaderProps> = ({ title, description, toolbar }, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const prefixCls = 'auto-chart-header';

  useImperativeHandle(ref, () => ({
    container: container.current,
  }));

  if (!title && !description && !toolbar) {
    return null;
  }
  return (
    <div className={prefixCls} ref={container}>
      {title || toolbar ? (
        <Row justify="start" className={`${prefixCls}-main`}>
          <Col className={`${prefixCls}-title`}>{title}</Col>
          <Col className={`${prefixCls}-toolbar`} style={{ marginLeft: 24 }}>
            {toolbar}
          </Col>
        </Row>
      ) : null}
      {description && <Row className={`${prefixCls}-desc`}>{description}</Row>}
    </div>
  );
};

export default forwardRef(ChartHeader);
