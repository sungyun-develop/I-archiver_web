import { useEffect, useRef } from "react";
import * as d3 from "d3";

function NetworkGraph() {
  const svgRef = useRef(null);
  const nodes = [
    { id: "BB#1", value: 5, fixed: true, x: 500, y: 0 },
    { id: "BB#2", value: 5, fixed: true, x: 250, y: 0 },
    { id: "10번", value: 1 },
    { id: "11번", value: 1 },
    { id: "12번", value: 1 },
    { id: "13번", value: 1 },
    { id: "100번", value: 1 },
    { id: "101번", value: 1 },
  ];
  const links = [
    { source: "BB#1", target: "BB#2" },
    { source: "BB#2", target: "BB#1" },
    { source: "10번", target: "BB#1" },
    { source: "10번", target: "BB#2" },
    { source: "11번", target: "BB#1" },
    { source: "11번", target: "BB#2" },
    { source: "12번", target: "BB#1" },
    { source: "12번", target: "BB#2" },
    { source: "13번", target: "BB#1" },
    { source: "13번", target: "BB#2" },
    { source: "100번", target: "BB#1" },
    { source: "100번", target: "BB#2" },
    { source: "101번", target: "BB#1" },
    { source: "101번", target: "BB#2" },
  ];
  useEffect(() => {
    const width = 1000;
    const height = 400;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();
    const link = svg
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "black")
      .attr("stroke-width", 1);
    const node = svg
      .selectAll("g")
      .data(nodes)
      .join("g")
      .each(function (d) {
        d3.select(this)
          .append("circle")
          .attr("r", d.value * 5)
          .attr("fill", "skyblue");
        d3.select(this)
          .append("text")
          .text((d) => d.id)
          .attr("x", -5)
          .attr("y", 5);
      });
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide().radius(function (d) {
          return d.value * 8;
        })
      )
      .force(
        "x",
        d3
          .forceX()
          .strength(0.1)
          .x((d) => (d.fixed ? d.x : null))
      ) // X 좌표 고정
      .force(
        "y",
        d3
          .forceY()
          .strength(0.1)
          .y((d) => (d.fixed ? d.y : null))
      ) // Y 좌표 고정
      .on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
        node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });
  }, [nodes, links]);

  return (
    <div>
      <h1>hi</h1>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default NetworkGraph;
