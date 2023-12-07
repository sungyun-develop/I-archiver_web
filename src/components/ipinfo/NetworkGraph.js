import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateipinfo } from "../../actions/actions";
import * as d3 from "d3";
import styled from "./NetworkGraph.module.css";
import AdminPie from "./forgraph/AdminPie";
import IdsBar from "./forgraph/IdsBar";

function NetworkGraph({ data }) {
  const ids = data.map(function (item) {
    return item.name_id;
  });
  const ids_val = {};
  for (const v of ids) {
    ids_val[v] = ids_val[v] ? ids_val[v] + 1 : 1;
  }
  const admins = data.map(function (item) {
    return item.admin;
  });
  const admins_val = {};
  for (const v of admins) {
    admins_val[v] = admins_val[v] ? admins_val[v] + 1 : 1;
  }

  const svgRef = useRef(null);
  const dispatch = useDispatch();
  const nodes = [
    { id: "BB#1", value: 10, fixed: true, x: 110, y: 440 },
    { id: "BB#2", value: 10, fixed: true, x: 1030, y: 440 },
    { id: "10번", value: 6, fixed: true, x: 10, y: 290 },
    { id: "11번", value: 6, fixed: true, x: 610, y: 260 },
    { id: "12번", value: 6, fixed: true, x: 1170, y: 290 },
    { id: "13번", value: 6, fixed: true, x: 10, y: 620 },
    { id: "100번", value: 6, fixed: true, x: 610, y: 650 },
    { id: "101번", value: 6, fixed: true, x: 1170, y: 620 },
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
    const width = 1300;
    const height = 1000;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    svg
      .append("text")
      .attr("x", 250)
      .attr("y", 70)
      .attr("fill", "#2828cd")
      .attr("text-anchor", "middle")
      .style("font-size", "40px")
      .style("font-weight", "bold")
      .text("양성자가속기 네트워크망");

    svg
      .append("text")
      .attr("x", 660)
      .attr("y", 70)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .style("font-weight", "bold")
      .text("(대역별 정보 확인은 클릭)");

    const link = svg
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => {
        return d.target.id === "BB#1" && d.source.id != "BB#2"
          ? "#f5af64"
          : d.target.id === "BB#2" && d.source.id != "BB#1"
          ? "green"
          : "black";
      })
      .attr("stroke-width", (d) =>
        d.target.id === "BB#1" && d.source.id === "BB#2" ? 10 : 4
      )
      .attr("stroke-dasharray", (d) =>
        d.target.id === "BB#1" && d.source.id === "BB#2" ? "10,10" : "none"
      );
    const node = svg
      .selectAll("g")
      .data(nodes)
      .join("g")
      .each(function (d) {
        d3.select(this)
          .append("rect")
          .attr("width", d.value * 20)
          .attr("height", d.value * 20)
          .style("stroke", "#a0a0ff")
          .style("stroke-width", 5)
          .attr("fill", "#46649b")
          .on("mouseover", function () {
            d3.select(this).attr("fill", "#91b9f5").style("cursor", "pointer");
          })
          .on("mouseout", function () {
            d3.select(this).attr("fill", "#46649b").style("cursor", "default");
          })
          .on("click", function () {
            handleClickList(d.id);
          });
        d3.select(this)
          .append("text")
          .text((d) => d.id)
          .attr("x", d.value * 10)
          .attr("y", d.value * 10 + 5)
          .style("text-anchor", "middle")
          .style("font-size", "22px")
          .style("fill", "#6fffc4")
          .on("mouseover", function () {
            d3.select(this).style("cursor", "pointer");
          })
          .on("mouseout", function () {
            d3.select(this).style("cursor", "default");
          })
          .on("click", function () {
            handleClickList(d.id);
          });
      });
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => {
            return d.source.id === "BB#1" || d.source.id === "BB#2"
              ? 440
              : d.source.id === "11번" || d.source.id === "100번"
              ? 350
              : 550;
          })
      )
      .force(
        "x",
        d3.forceX().x((d) => (d.fixed ? d.x : null))
      ) // X 좌표 고정
      .force(
        "y",
        d3.forceY().y((d) => (d.fixed ? d.y : null))
      ) // Y 좌표 고정
      .on("tick", () => {
        link
          .attr("x1", (d) => d.source.x + d.source.value * 10)
          .attr("y1", (d) => d.source.y + d.source.value * 10)
          .attr("x2", (d) => d.target.x + d.source.value * 10)
          .attr("y2", (d) => d.target.y + d.source.value * 10);
        node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });
  }, []);

  const exportNumbers = (name) => {
    const numberOnly = name.replace(/[^0-9]/g, "");
    return numberOnly;
  };
  const handleClickList = (name) => {
    console.log(name);
    console.log("call the list");
    let selectedpoint = 0;
    if (name != "BB#1" && name != "BB#2") {
      if (exportNumbers(name) === "10") {
        selectedpoint = 1;
      } else if (exportNumbers(name) === "11") {
        selectedpoint = 2;
      } else if (exportNumbers(name) === "12") {
        selectedpoint = 3;
      } else if (exportNumbers(name) === "13") {
        selectedpoint = 4;
      } else if (exportNumbers(name) === "100") {
        selectedpoint = 5;
      } else if (exportNumbers(name) === "101") {
        selectedpoint = 6;
      }
    }
    dispatch(updateipinfo(selectedpoint));
    console.log(selectedpoint);
  };

  return (
    <div className={styled.wbody}>
      <svg ref={svgRef} className={styled.graphBox}></svg>

      <div className={styled.stacticsBody}>
        <AdminPie data={admins_val} />
        <IdsBar data={ids_val} />
      </div>
    </div>
  );
}

export default NetworkGraph;
