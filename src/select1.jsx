import React, { useState } from 'react';
import { TreeSelect } from 'antd';
// import 'antd/dist/antd.css'; // Import Ant Design styles

const { TreeNode } = TreeSelect;

const MyTreeSelect = () => {
  const [treeData, setTreeData] = useState([]);

  // Simulate an API call to fetch child nodes
  const fetchChildNodes = async (parentId) => {
    // Replace this with your actual API call
    const response = await fetch(
      `https://your-api.com/child-nodes/${parentId}`
    );
    const data = await response.json();
    return data;
  };

  // This function is called when a node is expanded
  const onLoadData = async (node) => {
    const { id } = node;
    const childNodes = await fetchChildNodes(id);
    // Update the treeData state to include the new child nodes
    setTreeData((prevTreeData) => {
      const newTreeData = [...prevTreeData];
      const nodeIndex = newTreeData.findIndex((n) => n.id === id);
      if (nodeIndex > -1) {
        newTreeData[nodeIndex].children = childNodes;
      }
      return newTreeData;
    });
  };

  return (
    <TreeSelect
      treeData={treeData}
      loadData={onLoadData}
      placeholder='Please select'
      treeDefaultExpandAll
    />
  );
};

export default MyTreeSelect;
