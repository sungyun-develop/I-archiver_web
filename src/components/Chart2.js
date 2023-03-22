import PropTypes from "prop-types";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

function Chart2({ data }) {
  return (
    <LineChart width={1000} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="label" />
      <YAxis domain={[0, 20]} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="RFQ" stroke="#8884d8" />
      <Line type="monotone" dataKey="DTL22" stroke="#A52A2A" />
      <Line type="monotone" dataKey="DTL23" stroke="#00FF00" />
      <Line type="monotone" dataKey="DTL24" stroke="#FF4500" />
    </LineChart>
  );
}

Chart2.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.arrayOf(PropTypes.number).isRequired,
      data1: PropTypes.arrayOf(PropTypes.number).isRequired,
      data2: PropTypes.arrayOf(PropTypes.number).isRequired,
      data3: PropTypes.arrayOf(PropTypes.number).isRequired,
      data4: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
};

export default Chart2;
