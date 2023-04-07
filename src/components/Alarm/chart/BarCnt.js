import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import PropTypes from "prop-types";

function BarCnt({ data, width, height }) {
  return (
    <BarChart width={Number(width)} height={Number(height)} data={data}>
      <XAxis dataKey="name" padding={{ left: 10, right: 10 }} />
      <YAxis padding={{ top: 20 }} />
      <Tooltip />

      <Bar dataKey="value" barSize={100} fill="#87CEFA" />
    </BarChart>
  );
}

BarCnt.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
};

export default BarCnt;
