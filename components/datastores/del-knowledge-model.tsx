import React from 'react';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Modal, Button, Box, Typography, Divider, ModalDialog } from '@/lib/mui';
import { message } from 'antd';

import { sendSpacePostRequest } from '@/utils/request';

interface IProps {
  isDeleteKnowledgeSpaceModalShow: boolean;
  setIsDeleteKnowledgeSpaceModalShow: (isDeleteKnowledgeSpaceModalShow: boolean) => void;
  setKnowledgeSpaceList: (list: Array<any>) => void;
  knowledgeSpaceToDelete: { name: string };
}

export default function DelKnowledgeModel(props: IProps) {
  const { isDeleteKnowledgeSpaceModalShow, setIsDeleteKnowledgeSpaceModalShow, setKnowledgeSpaceList, knowledgeSpaceToDelete } = props;

  return (
    <Modal open={isDeleteKnowledgeSpaceModalShow} onClose={() => setIsDeleteKnowledgeSpaceModalShow(false)}>
      <ModalDialog variant="outlined" role="alertdialog" aria-labelledby="alert-dialog-modal-title" aria-describedby="alert-dialog-modal-description">
        <Typography
          id="alert-dialog-modal-title"
          component="h2"
          startDecorator={<WarningRoundedIcon style={{ color: 'rgb(205, 32, 41)' }} />}
          sx={{ color: 'black' }}
        >
          Confirmation
        </Typography>
        <Divider />
        <Typography id="alert-dialog-modal-description" textColor="text.tertiary" sx={{ fontWeight: '500', color: 'black' }}>
          Sure to delete {knowledgeSpaceToDelete?.name}?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
          <Button variant="outlined" color="neutral" onClick={() => setIsDeleteKnowledgeSpaceModalShow(false)}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="danger"
            onClick={async () => {
              setIsDeleteKnowledgeSpaceModalShow(false);
              const res = await sendSpacePostRequest(`/knowledge/space/delete`, {
                name: knowledgeSpaceToDelete?.name,
              });
              if (res.success) {
                message.success('success');
                const data = await sendSpacePostRequest('/knowledge/space/list', {});
                if (data.success) {
                  setKnowledgeSpaceList(data.data);
                }
              } else {
                message.error(res.err_msg || 'failed');
              }
            }}
          >
            Yes
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
