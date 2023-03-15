import PropTypes from "prop-types";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function Chart2({ data }) {
  return (
    <LineChart width={700} height={300} data={data}>
      <XAxis />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="data" stroke="#8884d8" />
    </LineChart>
  );
}

Chart2.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Chart2;
