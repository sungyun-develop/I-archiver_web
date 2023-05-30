import React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "./ChartTest.module.css";
import ZoomableLineChart from "../components/ZoomableLineChart";
import ChartSearching from "../components/ChartSearching";

function ChartTest() {
  const svgRef = useRef(null);
  const [data, setData] = useState(
    Array.from({ length: 500 }, () => Math.round(Math.random() * 100))
  );

  const getAPI = async () => {
    const json = await (
      await fetch(
        `http://192.168.100.178:17668/retrieval/data/getData.json?pv=RFQ%3AAmp&from=2023-03-03T05%3A00%3A00.000Z&to=2023-03-03T10%3A00%3A00.000Z`
      )
    ).json();
    const data = json[0].data;
  };
  useEffect(() => {
    getAPI();
  }, [data]);

  return (
    <React.Fragment>
      <h1>Zoomable Chart Test입니다.</h1>
      <h2>D3.js 연습</h2>
      <ChartSearching />
      <ZoomableLineChart data={data} />
      <button
        onClick={() => setData([...data, Math.round(Math.random() * 100)])}
      >
        Add data
      </button>
    </React.Fragment>
  );
}

export default ChartTest;
