import PropTypes from "prop-types";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function Chart({ data, timeKey, valueKey }) {
  return (
    <LineChart width={1000} height={500} data={data}>
      <XAxis dataKey={timeKey} interval={Math.floor(data.length / 5)} />{" "}
      <YAxis domain={["auto", "auto"]} />
      <Tooltip />
      <Line type="monotone" dataKey={valueKey} stroke="#4682B4" />
    </LineChart>
  );
}

Chart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Chart;
