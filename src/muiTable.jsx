import React, { useRef, useState } from 'react';
import MaterialTable from 'material-table';
import { ThemeProvider, createTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const theme = createTheme({
  direction: 'ltr', // or 'rtl' for right-to-left languages
  // Add other theme configurations as needed
});

const TreeTable = () => {
  const data = [
    {
      id: '1',
      name: 'Parent 1',
      children: [],
    },
    // Add more nodes as needed
  ];
  const tableRef = useRef(null);
  const theme = createTheme({
    direction: 'ltr', // or 'rtl' for right-to-left languages
    // Add other theme configurations as needed
  });
  // Function to fetch child data
  const fetchChildData = async (nodeId) => {
    // Replace this with your actual API call
    const response = await fetch(`/api/child-data/${nodeId}`);
    const childData = await response.json();
    return childData;
  };

  const [tableData, setTableData] = useState(data);

  // Function to handle expanding a node
  const handleExpand = async (nodeId) => {
    console.log('Expanding node:', nodeId);
    // const childData = await fetchChildData(nodeId);
    const childData = {
      id: '2',
      name: 'child 1',
      children: [],
    };
    // Update the state to include the fetched child data
    setTableData((prevData) => {
      return prevData.map((node) => {
        if (node.id === nodeId) {
          return { ...node, children: childData };
        }
        return node;
      });
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        title='Tree Data Table'
        data={tableData}
        columns={[
          {
            title: 'Expand',
            field: 'expand',
            render: (rowData) => (
              <ExpandMoreIcon
                onClick={() => {
                  if (rowData.children) {
                    handleExpand(rowData.id);
                  }
                }}
              />
            ),
            sorting: false,
            filtering: false,
            width: 48,
          },
          { title: 'Name', field: 'name' },
          // Add more columns as needed
        ]}
        detailPanel={(rowData) => {
          console.log('Rendering detail panel for:', rowData);
          return (
            <div>
              {/* Render child data here */}
              {rowData.children &&
                rowData.children.map((child) => (
                  <div key={child.id}>{child.name}</div>
                ))}
            </div>
          );
        }}
      />
    </ThemeProvider>
  );
};

export default TreeTable;
