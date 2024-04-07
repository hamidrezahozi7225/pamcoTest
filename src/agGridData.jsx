'use strict';

import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
]);

const createFakeServer = (fakeServerData) => {
  const fakeServer = {
    data: fakeServerData,
    getData: function (request) {
      function extractRowsFromData(groupKeys, data) {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.children,
              employeeId: d.employeeId,
              employeeName: d.employeeName,
              employmentType: d.employmentType,
              jobTitle: d.jobTitle,
            };
          });
        }
        var key = groupKeys[0];
        for (var i = 0; i < data.length; i++) {
          if (data[i].employeeId === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].children.slice()
            );
          }
        }
      }
      return extractRowsFromData(request.groupKeys, this.data);
    },
  };
  return fakeServer;
};

const createServerSideDatasource = (fakeServer) => {
  const dataSource = {
    getRows: (params) => {
      console.log('ServerSideDatasource.getRows: params = ', params);
      var allRows = fakeServer.getData(params.request);
      var request = params.request;
      var doingInfinite = request.startRow != null && request.endRow != null;
      var result = doingInfinite
        ? {
            rowData: allRows.slice(request.startRow, request.endRow),
            rowCount: allRows.length,
          }
        : { rowData: allRows };
      console.log('getRows: result = ', result);
      setTimeout(() => {
        params.success(result);
      }, 200);
    },
  };
  return dataSource;
};

const TreeGridExample = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: 'employeeId', hide: true },
    { field: 'employeeName', hide: true },
    { field: 'jobTitle' },
    { field: 'employmentType' },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      width: 240,
      flex: 1,
      sortable: false,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      field: 'employeeName',
      cellRendererParams: {
        innerRenderer: (params) => {
          // display employeeName rather than group key (employeeId)
          return params.data.employeeName;
        },
      },
    };
  }, []);
  const isServerSideGroupOpenByDefault = useCallback((params) => {
    // open first two levels by default
    return params.rowNode.level < 2;
  }, []);
  const isServerSideGroup = useCallback((dataItem) => {
    // indicate if node is a group
    return dataItem.group;
  }, []);
  const getServerSideGroupKey = useCallback((dataItem) => {
    // specify which group key to use
    return dataItem.employeeId;
  }, []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/small-tree-data.json')
      .then((resp) => resp.json())
      .then((data) => {
        var fakeServer = createFakeServer(data);
        var datasource = createServerSideDatasource(fakeServer);
        params.api.setGridOption('serverSideDatasource', datasource);
      });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={'ag-theme-quartz-dark'}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          rowModelType={'serverSide'}
          treeData={true}
          isServerSideGroupOpenByDefault={isServerSideGroupOpenByDefault}
          isServerSideGroup={isServerSideGroup}
          getServerSideGroupKey={getServerSideGroupKey}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};
export default TreeGridExample;
