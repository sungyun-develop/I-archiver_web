import PropTypes from "prop-types";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function Chart({ data, timeKey, valueKey }) {
  return (
    <LineChart width={700} height={300} data={data}>
      <XAxis dataKey={timeKey} interval={Math.floor(data.length / 10)} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={valueKey} stroke="#8884d8" />
    </LineChart>
  );
}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Chart;
