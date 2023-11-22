import * as React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

const Alert = ({ message, type }) => {
  const { enqueueSnackbar } = useSnackbar();
  console.log('reach here');
  return (
    <SnackbarProvider maxSnack={3}>
      {enqueueSnackbar({message},{type})};
    </SnackbarProvider>
  );
}

export default Alert;