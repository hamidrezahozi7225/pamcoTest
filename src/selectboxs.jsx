import React, { useState } from 'react';
import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

// Static hierarchical data
const staticData = [
  {
    title: 'Parent 1',
    value: 'parent1',
    key: '0-0',
    // children: [
    //   { title: 'Child 1', value: 'child1', key: '0-0-0' },
    //   { title: 'Child 2', value: 'child2', key: '0-0-1' },
    // ],
  },
  {
    title: 'Parent 2',
    value: 'parent2',
    key: '0-1',
    // children: [
    //   { title: 'Child 3', value: 'child3', key: '0-1-0' },
    //   { title: 'Child 4', value: 'child4', key: '0-1-1' },
    // ],
  },
];

const TreeSelectComponent = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [treeData, setTreeData] = useState(staticData);

  const onTreeExpand = (keys) => {
    setExpandedKeys(keys);
  };

  const fetchChildNodes = (parentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate fetching child nodes
        const childNodes = [
          { title: 'Child 1', value: 'child1', key: `${parentId}-0` },
          { title: 'Child 2', value: 'child2', key: `${parentId}-1` },
        ];
        resolve(childNodes);
      }, 1000); // Simulate a delay
    });
  };

  const onLoadData = async (node) => {
    const { key } = node;
    const childNodes = await fetchChildNodes(key);
    // Update the treeData state to include the new child nodes
    setTreeData((prevTreeData) => {
      const newTreeData = [...prevTreeData];
      const nodeIndex = newTreeData.findIndex((n) => n.value === key);
      if (nodeIndex > -1) {
        newTreeData[nodeIndex].children = childNodes;
      }
      return newTreeData;
    });
  };

  const onChange = (value) => {
    console.log(value); // value is the key of the selected node
  };

  // Function to recursively render TreeNode components
  const renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} value={item.value} key={item.key}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  const filterTreeNode = (inputValue, treeNode) => {
    // Check if the node's title contains the search input value
    return treeNode.title.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <TreeSelect
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder='Please select'
      allowClear
      treeDefaultExpandAll={false}
      treeExpandedKeys={expandedKeys}
      onTreeExpand={onTreeExpand}
      onChange={onChange}
      filterTreeNode={filterTreeNode}
      showSearch
      loadData={onLoadData}
    >
      {renderTreeNodes(treeData)}
    </TreeSelect>
  );
};

export default TreeSelectComponent;
