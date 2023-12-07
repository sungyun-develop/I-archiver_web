import * as d3 from "d3";
import { collapseToast } from "react-toastify";
import { useEffect, useRef } from "react";
import styled from "./PieChartforIP.module.css";

function PieChartforIP({ data }) {
  const svgRef = useRef(null);
  console.log(data);
  const tens = data.filter((ip) => ip.startsWith("192.168.10."));
  const elevens = data.filter((ip) => ip.startsWith("192.168.11."));
  const twelves = data.filter((ip) => ip.startsWith("192.168.12."));
  const thirteen = data.filter((ip) => ip.startsWith("192.168.13."));
  const hundred = data.filter((ip) => ip.startsWith("192.168.100."));
  const hundredone = data.filter((ip) => ip.startsWith("192.168.101."));

  const stactics = [
    {
      label: "10번대역",
      value: tens.length,
      color: "#429F6B",
      percent: (tens.length / data.length) * 100,
    },
    {
      label: "11번대역",
      value: elevens.length,
      color: "#4646cd",
      percent: (elevens.length / data.length) * 100,
    },
    {
      label: "12번대역",
      value: twelves.length,
      color: "#28e7ff",
      percent: (twelves.length / data.length) * 100,
    },
    {
      label: "13번대역",
      value: thirteen.length,
      color: "#ff7493",
      percent: (thirteen.length / data.length) * 100,
    },
    {
      label: "100번대역",
      value: hundred.length,
      color: "#ffa887",
      percent: (hundred.length / data.length) * 100,
    },
    {
      label: "101번대역",
      value: hundredone.length,
      color: "#9a7745",
      percent: (hundredone.length / data.length) * 100,
    },
  ];
  const width = 300;
  const height = 300;

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const innerRadius = 50;
    const outerRadius = Math.min(width, height) / 2 - 2;
    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pieGenerator = d3
      .pie()
      .padAngle(0.03)
      .value((d) => d.value);

    const arc = svg
      .selectAll()
      .data(pieGenerator(stactics))
      .enter()
      .append("g")
      .attr("class", "arc-group")
      .on("mouseenter", function (event, d) {
        const centroid = arcGenerator.centroid(d);
        const textX = centroid[0];
        const textY = centroid[1];

        svg
          .selectAll(".arc-group")
          .transition()
          .duration(200)
          .style("opacity", 0.6);

        d3.select(this).transition().duration(200).style("opacity", 1);

        d3.select(this)
          .append("text")
          .attr("class", "arc-number")
          .attr("x", textX)
          .attr("y", textY)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text((d) => `${d.data.value}개`)
          .style("font-size", "25px")
          .style("fill", "white")
          .style("font-weight", "bold");

        d3.select(this)
          .append("text")
          .attr("class", "arc-percent")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text((d) => `${d.data.percent.toFixed(2)}%`)
          .style("font-size", "27px")
          .style("font-weight", "bold");

        d3.select(this)
          .select("path")
          .transition()
          .duration(500)
          .attr("d", arcGenerator.outerRadius(outerRadius + 30));
      })
      .on("mouseleave", function (event, d) {
        svg
          .selectAll(".arc-group")
          .transition()
          .duration(200)
          .style("opacity", 1);
        d3.select(this).select(".arc-number").remove();
        d3.select(this).select(".arc-percent").remove();

        d3.select(this)
          .select("path")
          .transition()
          .duration(200)
          .attr("d", arcGenerator.outerRadius(outerRadius)); // 원래 크기로 복구
      });

    arc
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", (d) => d.data.color)
      .style("stroke", "#ffffff")
      .style("stroke-width", 0)
      .append("title")
      .text((d) => d.data.label);

    arc
      .transition()
      .duration(1000)
      .select("path")
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = interpolate(t);
          return arcGenerator(d);
        };
      });

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .selectAll("g")
      .data(stactics)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(200, ${i * 35})`);
    legend
      .append("circle")
      .attr("r", 10)
      .attr("cy", -100)
      .style("fill", (d) => d.color);
    legend
      .append("text")
      .attr("x", 15)
      .attr("y", -100)
      .attr("font-size", "25px")
      .attr("dy", ".33em")
      .text((d) => d.label);
  }, [data]);

  return <svg ref={svgRef} className={styled.chart}></svg>;
}

export default PieChartforIP;
