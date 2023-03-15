import React, { useEffect, useState } from "react";
import Chart2 from "../components/Chart2";

function CaData() {
  const [getPV, setGetPV] = useState(0);
  const [testArray, setTestArray] = useState([]);
  const [chartData, setChartData] = useState([]);
  const getAPI = async () => {
    const json = await (await fetch("http://192.168.101.167:3000/data")).json();

    setGetPV(json.pv_value1);
    const strArray = json.array_pv0;
    const toArray = strArray.split(",");
    setTestArray(toArray);
  };
  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 100);
    return () => clearInterval(intervalld);
  }, []);

  const drawGraph =
    testArray.length > 0
      ? testArray.map((value, index) => ({
          label: `${index + 1}`,
          data: value,
        }))
      : [];

  return (
    <div>
      <h2>Hello</h2>
      <h3>{getPV}</h3>
      <p>{testArray}</p>
      <Chart2 data={drawGraph} />
    </div>
  );
}

export default CaData;
