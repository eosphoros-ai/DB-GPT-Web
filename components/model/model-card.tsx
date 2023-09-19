import React, { useState } from 'react';
import { IModelData } from '@/types/model';
import { useTranslation } from 'react-i18next';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { Tooltip, message } from 'antd';
import moment from 'moment';
import { apiInterceptors, stopModel } from '@/client/api';

interface Props {
  info: IModelData;
}

function ModelCard({ info }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  async function stopTheModel(info: IModelData) {
    if (loading) {
      return;
    }
    setLoading(true);
    const [, res] = await apiInterceptors(
      stopModel({
        host: info.host,
        port: info.port,
        model_name: info.model_name,
        model_type: info.model_type,
      }),
    );
    setLoading(false);
    if (res === true) {
      message.success(t('stop_model_success'));
    }
  }
  return (
    <div className="relative flex flex-col py-4 px-4 w-1/2 rounded-lg justify-between text-black bg-white border-gray-200 border hover:shadow-md dark:border-gray-600 dark:bg-black dark:text-white dark:hover:border-white transition-all">
      <div className="flex items-center">
        <div className="flex flex-col">
          {info.healthy && (
            <Tooltip title="Healthy">
              <SentimentSatisfiedAltIcon className="absolute top-4 right-4 text-3xl text-green-600" />
            </Tooltip>
          )}
          {!info.healthy && (
            <Tooltip title="Unhealthy">
              <SentimentVeryDissatisfiedIcon className="absolute top-4 right-4 text-3xl text-red-600" />
            </Tooltip>
          )}
          <Tooltip title="Stop Model">
            <StopCircleIcon
              className="absolute right-4 top-16 text-3xl text-orange-600 cursor-pointer"
              onClick={() => {
                stopTheModel(info);
              }}
            />
          </Tooltip>
          <h1 className="text-lg font-semibold">{info.model_name}</h1>
          <h3 className="text-sm text-gray-800 dark:text-gray-400">{info.model_type}</h3>
          <div className="text-sm mt-2">
            <p className="font-semibold">Host:</p>
            <p className="text-gray-600">{info.host}</p>
            <p className="font-semibold mt-2">Manage host:</p>
            <p className="text-gray-600">
              <span>{info.manager_host}:</span>
              <span>{info.manager_port}</span>
            </p>
            <p className="font-semibold mt-2">Last heart beat:</p>
            <p className="text-gray-600">{moment(info.last_heartbeat).format('YYYY-MM-DD HH:MM:SS')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelCard;
