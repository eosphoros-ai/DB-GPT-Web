import { PropsWithChildren, useState } from 'react';
import { Upload, UploadProps, Button, message, UploadFile } from 'antd';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from '@/utils/ctx-axios';
import { IResponseModal } from '@/types';

interface ILoadResult {}

interface Props {
  convUid: string;
  chatMode: string;
  onComplete: (data: ILoadResult) => void;
}

function ExcelUpload({ children, convUid, chatMode, onComplete, ...props }: PropsWithChildren<Props & UploadProps>) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('doc_file', info.file as any);
      const { data, success, err_msg } = await axios.post<unknown, IResponseModal<ILoadResult>>(
        `/api/v1/chat/mode/params/file/load?conv_uid=${convUid}&chat_mode=${chatMode}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // onUploadProgress: function (progressEvent) {
          //   if (progressEvent.total) {
          //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          //   }
          // },
        },
      );
      if (!success) {
        message.error(err_msg);
        return;
      }
      console.log(data);
      onComplete(data);
    } catch (e: any) {
      message.error(e?.message || 'Upload Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Upload
      disabled={loading}
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
      {...props}
    >
      {children ? (
        children
      ) : (
        <Button type="primary" className="flex justify-center items-center">
          <FileUploadIcon fontSize="small" className="mr-1" />
          <span>Click to Upload</span>
        </Button>
      )}
    </Upload>
  );
}

export default ExcelUpload;
