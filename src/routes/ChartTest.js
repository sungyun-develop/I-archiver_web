import {
  axisBottom,
  axisRight,
  select,
  line,
  curveCardinal,
  scaleLinear,
} from "d3";
import { useEffect, useRef, useState } from "react";
import styled from "./ChartTest.module.css";

function ChartTest() {
  const svgRef = useRef(null);
  const [data, setData] = useState([25, 30, 45, 60, 20, 50, 75]);

  const getAPI = async () => {
    const json = await (
      await fetch(
        `http://192.168.100.178:17668/retrieval/data/getData.json?pv=RFQ%3AAmp&from=2023-03-03T05%3A00%3A00.000Z&to=2023-03-03T10%3A00%3A00.000Z`
      )
    ).json();
    const data = json[0].data;
  };
  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300]);

    const yScale = scaleLinear().domain([0, 75]).range([150, 0]);
    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index + 1);
    svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);

    const yAxis = axisRight(yScale);
    svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "green");

    getAPI();
  }, [data]);
  return (
    <div>
      <h1>Zoomable Chart Test입니다.</h1>
      <h2>D3.js 연습</h2>
      <svg ref={svgRef} className={styled.svg}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br />
      <br />
      <br />
      <br />
      <button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </button>
      <button onClick={() => setData(data.filter((value) => value < 10))}>
        Filter data
      </button>
    </div>
  );
}

export default ChartTest;
