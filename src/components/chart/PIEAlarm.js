import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import styled from "./PIEAlarm.module.css";

function PIEAlarm({ data }) {
  const colors = ["#0088FE", "#DD2c00", "#F4A460", "#3CB371", "#C71585"];

  return (
    <div className={styled.chartBody}>
      <ul className={styled.list}>
        {data.map((item) => (
          <li>
            {item.name} : {item.value}
          </li>
        ))}
      </ul>

      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={100}
          outerRadius={150}
          cx="50%"
          cy="50%"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

PIEAlarm.propTypes = {
  data: PropTypes.array.isRequired,
};

export default PIEAlarm;
