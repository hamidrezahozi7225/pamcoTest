import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

import ReactTable from './reactTable';
import Sync from './sync';
import DataGrid from './dataGrid';
import TreeGridExample from './agGridData';
import TreeTable from './muiTable';
import CustomSelect from './selectboxs';
import MyTreeSelect from './select1';

export default function App() {
  return (
    <div style={{ padding: '3px' }}>
      {/* <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
        /> */}
      {/* <ThemeProvider theme={defaultMaterialTheme}>
        <TreeTable data={data} columns={columns} />
      </ThemeProvider> */}
      {/* <TreeGridExample /> */}
      {/* <ReactTable direction='rtl' /> */}
      {/* <Sync /> */}
      {/* <DataGrid /> */}
      {/* <TreeGridExample /> */}
      {/* <TreeTable /> */}
      <CustomSelect />
      {/* <MyTreeSelect /> */}
    </div>
  );
}
