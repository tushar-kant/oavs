import React from 'react';
import {
  Treemap,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Group A', size: 400 },
  { name: 'Group B', size: 300 },
  { name: 'Group C', size: 300 },
  { name: 'Group D', size: 200 },
  { name: 'Group E', size: 400 },
  { name: 'Group F', size: 300 },
  { name: 'Group G', size: 200 },
  { name: 'Group H', size: 100 },
];

const TreeMapComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
        data={data}
        dataKey="size"
        aspectRatio={1}
        stroke="#fff"
        fill="#8884d8"
      >
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length > 0) {
              return (
                <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
                  <p>{`Name: ${payload[0].name}`}</p>
                  <p>{`Size: ${payload[0].size}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default TreeMapComponent;
