import { PropsWithChildren, useState } from 'react';
import { Upload, UploadProps, Button, message, UploadFile, Tooltip, Progress, ProgressProps } from 'antd';
import { LinkOutlined, SelectOutlined, UploadOutlined } from '@ant-design/icons';
import { apiInterceptors, postChatModeParamsFileLoad } from '@/client/api';

interface Props {
  convUid: string;
  chatMode: string;
  model: string;
  onComplete?: () => void;
}

function ExcelUpload({ convUid, model, chatMode, onComplete, ...props }: PropsWithChildren<Props & UploadProps>) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [percent, setPercent] = useState<number>();
  const [uploadState, setUploadState] = useState<ProgressProps['status']>();

  const onChange: UploadProps['onChange'] = async (info) => {
    if (!info) {
      message.error('Please select the *.(csv|xlsx|xls) file');
      return;
    }
    if (!/\.(csv|xlsx|xls)$/.test(info.file.name ?? '')) {
      message.error('File type must be csv, xlsx or xls');
      return;
    }

    setFileList([info.file]);
  };

  const onUpload = async () => {
    setLoading(true);
    setUploadState('normal');
    try {
      const formData = new FormData();
      formData.append('doc_file', fileList[0] as any);
      const [err] = await apiInterceptors(
        postChatModeParamsFileLoad({
          convUid,
          chatMode,
          data: formData,
          model,
          config: {
            /** timeout 1h */
            timeout: 1000 * 60 * 60,
            onUploadProgress: (progressEvent) => {
              const progress = Math.ceil((progressEvent.loaded / (progressEvent.total || 0)) * 100);
              setPercent(progress);
            },
          },
        }),
      );
      if (err) return;
      message.success('success');
      setUploadState('success');
      onComplete?.();
    } catch (e: any) {
      setUploadState('exception');
      message.error(e?.message || 'Upload Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full flex items-start">
        <Tooltip placement="topLeft" title="Files cannot be changed after upload">
          <Upload
            disabled={loading}
            className="mr-1"
            beforeUpload={() => false}
            fileList={fileList}
            name="file"
            accept=".csv,.xlsx,.xls"
            multiple={false}
            onChange={onChange}
            showUploadList={{
              showDownloadIcon: false,
              showPreviewIcon: false,
              showRemoveIcon: false,
            }}
            itemRender={() => <></>}
            {...props}
          >
            <Button className="flex justify-center items-center dark:bg-[#4e4f56] dark:text-gray-200" disabled={loading} icon={<SelectOutlined />}>
              Select File
            </Button>
          </Upload>
        </Tooltip>
        <Button
          type="primary"
          loading={loading}
          className="flex justify-center items-center"
          disabled={!fileList.length}
          icon={<UploadOutlined />}
          onClick={onUpload}
        >
          {loading ? (percent === 100 ? 'Analysis' : 'Uploading') : 'Upload'}
        </Button>
      </div>
      {!!fileList.length && (
        <div className="mt-2 text-gray-500 text-sm flex items-center">
          <LinkOutlined className="mr-2" />
          <span>{fileList[0]?.name}</span>
        </div>
      )}
      {typeof percent === 'number' && <Progress className="mb-0" percent={percent} size="small" status={uploadState} />}
    </>
  );
}

export default ExcelUpload;
