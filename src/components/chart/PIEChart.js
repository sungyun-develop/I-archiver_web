import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function PIEChart({ data }) {
  const colors = ["#0088FE", "#DD2c00"];
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={100}
        outerRadius={150}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <text x={200} y={200} textAnchor="middle">
        {`${((data[1].value / data[0].value) * 100).toFixed(1)}%`}
      </text>
    </PieChart>
  );
}

PIEChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default PIEChart;
