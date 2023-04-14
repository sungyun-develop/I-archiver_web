import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import Chart from "../components/chart/Chart";

function Home() {
  const [getBeamCurr, setGetBeamCurr] = useState([]);
  const getAPI = async () => {
    const json = await (
      await fetch(
        `http://192.168.100.178:17668/retrieval/data/getData.json?pv=RFQ%3AAmp&from=2023-03-03T05%3A00%3A00.000Z&to=2023-03-03T10%3A00%3A00.000Z`
      )
    ).json();

    setGetBeamCurr(json[0].data);
  };
  useEffect(() => {
    getAPI();
    const intervalld = setInterval(() => {
      getAPI();
    }, 5000);
    return () => clearInterval(intervalld);
  }, []);

  const minutesGrouping = getBeamCurr.reduce((acc, curr) => {
    const minute = Math.floor(curr.secs + 1 / 60);

    if (acc[minute]) {
      acc[minute].push(curr);
    } else {
      acc[minute] = [curr];
    }
    return acc;
  }, {});

  const minuteData = Object.entries(minutesGrouping).map(([minute, group]) => {
    const valSum = group.reduce((sum, curr) => sum + curr.val, 0);
    const valAvg = valSum / group.length;

    const secs = Math.max(...group.map(({ secs }) => secs));

    return { minute, val: valAvg, secs };
  });
  console.log(minuteData);

  const timeKey = "x";
  const valueKey = "y";

  const drawGraph = minuteData.map((index) => ({
    x: new Date(index.secs * 1000 + 9 * 60 * 60 * 1000)
      .toISOString()
      .substr(11, 8),
    y: index.val,
  }));

  return (
    <div>
      <h1>Archiver Appliance Browser</h1>
      <h3>archiver api 호출</h3>
      <input type="text"></input>
      <Chart data={drawGraph} timeKey={timeKey} valueKey={valueKey} />
    </div>
  );
}

export default Home;
