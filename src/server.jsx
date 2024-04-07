import React, { useState } from 'react';
import MaterialTable from 'material-table';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  direction: 'ltr', // or 'rtl' for right-to-left languages
  // Add other theme configurations as needed
});

const TreeTable = () => {
  const data = [
    {
      id: '1',
      name: 'Parent 1',
      children: [
        { id: '1.1', name: 'Child 1' },
        { id: '1.2', name: 'Child 2' },
      ],
    },
    // Add more nodes as needed
  ];

  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowExpand = (rowData) => {
    const currentIndex = expandedRows.indexOf(rowData.id);
    const newExpandedRows = [...expandedRows];

    if (currentIndex === -1) {
      newExpandedRows.push(rowData.id);
    } else {
      newExpandedRows.splice(currentIndex, 1);
    }

    setExpandedRows(newExpandedRows);
  };

  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        title='Tree Data Table'
        data={data}
        columns={[
          { title: 'Name', field: 'name' },
          // Add more columns as needed
        ]}
        options={{
          rowStyle: (rowData) => ({
            backgroundColor: expandedRows.includes(rowData.id)
              ? '#EEE'
              : '#FFF',
          }),
        }}
        actions={[
          {
            icon: 'expand_more',
            tooltip: 'Expand',
            onClick: (event, rowData) => handleRowExpand(rowData),
          },
        ]}
        components={{
          Row: (props) => {
            const { data } = props;
            if (expandedRows.includes(data.id)) {
              return (
                <>
                  <props.components.Row {...props} />
                  {data.children &&
                    data.children.map((child) => (
                      <tr key={child.id}>
                        <td colSpan={props.columns.length}>{child.name}</td>
                      </tr>
                    ))}
                </>
              );
            }
            return <props.components.Row {...props} />;
          },
        }}
      />
    </ThemeProvider>
  );
};

export default TreeTable;
