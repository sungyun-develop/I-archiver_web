import { useRef, useEffect } from "react";
import * as d3 from "d3";
import styled from "./AdminPie.module.css";

function AdminPie({ data }) {
  const infos = [];
  for (const key in data) {
    let info = {
      label: key,
      value: data[key],
    };
    infos.push(info);
  }
  console.log(infos);

  const svgRef = useRef(null);

  const width = 320;
  const height = 320;

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
      .data(pieGenerator(infos))
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
          .attr("y", textY + 20)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text((d) => `${d.data.value}개`)
          .style("font-size", "25px")
          .style("fill", "white")
          .style("font-weight", "bold");

        d3.select(this)
          .append("text")
          .attr("class", "arc-admin")
          .attr("x", textX)
          .attr("y", textY - 20)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text((d) => d.data.label)
          .style("font-size", "25px")
          .style("fill", "white")
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
        d3.select(this).select(".arc-admin").remove();
        d3.select(this).select(".arc-percent").remove();

        d3.select(this)
          .select("path")
          .transition()
          .duration(200)
          .attr("d", arcGenerator.outerRadius(outerRadius)); // 원래 크기로 복구
      });

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    arc
      .append("path")
      .attr("d", arcGenerator)
      .style("fill", color)
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
  }, [data]);

  return (
    <div className={styled.wbody}>
      <h2>관리자별 관리 자산 수</h2>
      <div className={styled.piebody}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}

export default AdminPie;
