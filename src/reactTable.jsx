import * as React from 'react';

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table';
import { useTree, CellTree } from '@table-library/react-table-library/tree';
import {
  findNodeById,
  recursiveMergeInsert,
} from '@table-library/react-table-library/common';
import { useTheme } from '@table-library/react-table-library/theme';
import {
  DEFAULT_OPTIONS,
  getTheme,
} from '@table-library/react-table-library/material-ui';
// import { getData } from './server';

const needsToFetch = (nodes, id) => {
  const item = findNodeById(nodes, id);

  return item && item.nodes && !item.nodes.length;
};

// Define static data

// TODO pageInfo -> ...rest
const insertTree = (targetId, nodes, pageInfo) => (state) => {
  if (!targetId) {
    return {
      pageInfo,
      nodes: [...state.nodes, ...nodes],
    };
  }

  return {
    pageInfo: state.pageInfo,
    nodes: state.nodes.map(recursiveMergeInsert(targetId, nodes, { pageInfo })),
  };
};

const ReactTable = ({ direction }) => {
  const [data, setData] = React.useState({
    nodes: [],
  });

  const [rotate, setRotate] = React.useState(false);

  const materialTheme = getTheme({
    ...DEFAULT_OPTIONS,
    highlightOnHover: true,
  });
  let customTheme;
  if (direction == 'rtl') {
    const transform = !rotate ? 0 : 0;
    customTheme = {
      Table: `
        --data-table-library_grid-template-columns:  70px repeat(5, minmax(0, 1fr));
        margin: 16px 0px;
        border-radius:5px;
        direction:rtl
      `,
      Header: `
        background-color: #fafafa;
        padding: 100px 0;
        position:absolute;
        .th{
          background-color: #dddddd;
        }
        .css-1p8xf1s-HEADER_CELL_CONTAINER_STYLE-HeaderCell{
          text-align:right
        }
      `,
      Row: `
        padding:20px;
        .css-lfhggw div{
          transform:rotate(${transform})
        }`,
    };
  } else {
    customTheme = {
      Table: `
        --data-table-library_grid-template-columns:  70px repeat(5, minmax(0, 1fr));
        margin: 16px 0px;
        border-radius:5px;
      `,
      Header: `
        background-color: #fafafa;
        padding: 100px 0;
        position:absolute;
        .th{
          background-color: #dddddd;
        }
        
      `,
      Row: `
        padding:20px
        
      `,
    };
  }

  const theme = useTheme([materialTheme, customTheme]);

  const doGet = React.useCallback(async (params) => {
    // const { nodes } = await getData(params);

    setData(insertTree(params.id, nodes));
  }, []);

  React.useEffect(() => {
    setData({
      nodes: [],
    });

    doGet({
      isShallow: true,
    });
  }, []);

  const [loadingIds, setLoadingIds] = React.useState([]);

  const tree = useTree(data, {
    onChange: onTreeChange,
  });

  async function onTreeChange(action, state) {
    if (state.ids.length == 0) {
      setRotate(false);
    } else {
      setRotate(true);
    }

    if (action.type !== 'ADD_BY_ID') return;
    if (!needsToFetch(data.nodes, action.payload.id)) return;

    const params = {
      id: action.payload.id,
      isShallow: true,
      nested: true,
    };

    setLoadingIds(loadingIds.concat(action.payload.id));
    await doGet(params);
    setLoadingIds(loadingIds.filter((id) => id !== action.payload.id));
  }

  return (
    <Table data={data} tree={tree} theme={theme}>
      {(tableList) => (
        <>
          <Header>
            <HeaderRow>
              <HeaderCell>Task</HeaderCell>
              <HeaderCell>Deadline</HeaderCell>
              <HeaderCell>Type</HeaderCell>
              <HeaderCell>Complete</HeaderCell>
              <HeaderCell>Tasks</HeaderCell>
            </HeaderRow>
          </Header>

          <Body>
            {tableList.map((item) => {
              const showLoading = loadingIds.includes(item.id);

              return (
                <React.Fragment key={item.id}>
                  <Row item={item} style={{ backgroundColor: '#3071e1' }}>
                    <CellTree item={item}>{item.name}</CellTree>
                    <Cell>{item.deadline}</Cell>
                    <Cell>{item.type}</Cell>
                    <Cell>{item.isComplete.toString()}</Cell>
                    <Cell>{item.hasChild?.length}</Cell>
                  </Row>

                  {showLoading && (
                    <div
                      style={{
                        marginLeft: `${8 + item.treeXLevel * 20}px`,
                      }}
                    >
                      Loading ...
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </Body>
        </>
      )}
    </Table>
  );
};

export default ReactTable;
