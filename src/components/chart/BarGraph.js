import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import PropTypes from "prop-types";

function BarGraph({ data }) {
  return (
    <BarChart width={700} height={400} data={data}>
      <XAxis dataKey="name" />
      <YAxis domain={[0, 30]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" barSize={150} fill="#8884d8" />
    </BarChart>
  );
}

BarGraph.propTypes = {
  data: PropTypes.array.isRequired,
};

export default BarGraph;
