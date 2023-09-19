import { SupportModelParams } from '@/types/model';
import { Checkbox, Form, Input, InputNumber } from 'antd';

function ModelParams({ params }: { params: Array<SupportModelParams> | null }) {
  if (!params || params?.length < 1) {
    return null;
  }

  function renderItem(param: SupportModelParams) {
    switch (param.param_type) {
      case 'str':
        return <Input />;
      case 'int':
        return <InputNumber />;
      case 'bool':
        return <Checkbox />;
    }
  }
  return (
    <>
      {params?.map((param: SupportModelParams) => (
        <Form.Item
          key={param.param_name}
          label={<p className="whitespace-normal overflow-wrap-break-word">{param.description}</p>}
          name={param.param_name}
          initialValue={param.default_value}
          valuePropName={param.param_type === 'bool' ? 'checked' : 'value'}
          tooltip={param.description}
          rules={[{ required: param.required, message: `Please input ${param.description}` }]}
        >
          {renderItem(param)}
        </Form.Item>
      ))}
    </>
  );
}

export default ModelParams;
