import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import PropTypes from "prop-types";

function BarGraph({ data, width, height }) {
  return (
    <BarChart width={Number(width)} height={Number(height)} data={data}>
      <XAxis dataKey="name" />
      <YAxis domain={[0, 30]} />
      <Tooltip />

      <Bar dataKey="value" barSize={150} fill="#8884d8" />
    </BarChart>
  );
}

BarGraph.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
};

export default BarGraph;
