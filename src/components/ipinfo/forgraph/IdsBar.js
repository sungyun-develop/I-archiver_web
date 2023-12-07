import { useEffect, useRef } from "react";
import * as d3 from "d3";
import styled from "./IdsBar.module.css";

function IdsBar({ data }) {
  const svgRef = useRef(null);
  const infos = [];
  const ids = [];
  const values = [];
  for (const key in data) {
    let info = {
      label: key,
      value: data[key],
    };
    infos.push(info);
    ids.push(info.label);
    values.push(info.value);
  }

  const width = 900;
  const height = 350;

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    d3.selectAll(".barchart").remove();
    d3.selectAll(".x-axis").remove();
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleBand().domain(ids).range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values)])
      .range([height, 70]);
    const xAxis = d3.axisBottom(xScale).ticks(ids.length);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    console.log(infos);

    const bars = svg
      .selectAll(".barchart")
      .data(infos, (d) => d.label)
      .enter()
      .append("rect")
      .attr("class", "barchart")
      .attr("x", (d) => xScale(d.label) + xScale.bandwidth() / 5)
      .attr("y", (d) => height)
      .attr("width", xScale.bandwidth() / 1.5)
      .attr("height", 0)
      .attr("fill", color)
      .on("mouseover", function (event, d) {
        svg
          .selectAll(".barchart")
          .transition()
          .duration(200)
          .style("opacity", 0.6);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("width", xScale.bandwidth() / 1)
          .attr("x", xScale(d.label))
          .style("opacity", 1);

        svg
          .append("text")
          .attr("class", "bar-text")
          .attr("x", xScale(d.label) + xScale.bandwidth() / 2)
          .attr("y", yScale(d.value))
          .attr("dy", "-0.35em")
          .attr("text-anchor", "middle")
          .text(`${d.value}개`)
          .style("font-size", "25px")
          .style("fill", "gray")
          .style("font-weight", "bold");
      })
      .on("mouseout", function (event, d) {
        svg
          .selectAll(".barchart")
          .transition()
          .duration(200)
          .style("opacity", 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr("width", xScale.bandwidth() / 1.5)
          .attr("x", xScale(d.label) + xScale.bandwidth() / 5);

        d3.select(".bar-text").remove();
      })
      .transition()
      .duration(1500)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => height - yScale(d.value));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .style("font-size", "15px")
      .attr("font-weight", "bold")
      .style("text-anchor", "middle")
      .call(xAxis);
  }, [data]);

  return (
    <div className={styled.wbody}>
      <h2>항목별 자산 수</h2>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default IdsBar;
