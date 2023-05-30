import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  min,
  curveCardinal,
  axisBottom,
  axisLeft,
  zoom,
  axisRight,
  axisTop,
  scaleBand,
} from "d3";
import * as d3Annotation from "d3-svg-annotation";
import useResizeObserver from "./useResizeObserver";
import styled from "./ZoomableLineChart.module.css";
import "./Zoom.css";
import MakeAnnotations from "../components/analysisTools/MakeAnnotation";
import AnnotModal from "./annotation/AnnotModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setModalstate } from "../actions/actions";

function ZoomableLineChart({ data, id = "myZoomableLineChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();

  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  const [showGrid, setShowGrid] = useState(0);
  const [comment, setComment] = useState(0);

  const [zoomPos, setZoomPos] = useState(0);
  const [annotationGrp, setAnnotationGrp] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pickedAnnot, setPickedAnnot] = useState([]);
  const modalState = useSelector((state) => state.modalstate);
  const updatedContent = useSelector((state) => state.annotContent.data);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("updatedContent!");
    console.log(updatedContent);
    if (updatedContent.length > 0) {
      const selectedIdx = updatedContent[0];

      const oldContent = annotationGrp[selectedIdx];
      console.log(oldContent);
      oldContent[0].color = updatedContent[1];
      oldContent[0].note.title = updatedContent[3];
      oldContent[0].note.label = updatedContent[4];

      console.log(oldContent[0]);
      annotationGrp[selectedIdx] = oldContent;
    }
  }, [updatedContent]);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([20, width - 20]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      setZoomPos(newXScale.domain()[0]);
      xScale.domain(newXScale.domain());
    }

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height - 70, 70]);

    const lineGenerator = line()
      .x((d, index) => xScale(index))
      .y((d) => yScale(d))
      .curve(curveCardinal);

    // render the line
    svg
      .on("mouseenter", () => {
        svg
          .append("line")
          .attr("class", "x-hover")
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("pointer-events", "none");
        svg
          .append("line")
          .attr("class", "y-hover")
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .attr("pointer-events", "none");
      })
      .on("mousemove", (event) => {
        const mouseX = event.pageX - 70;
        const mouseY = event.pageY - 585;

        svg
          .select(".x-hover")
          .attr("x1", 0)
          .attr("y1", mouseY)
          .attr("x2", width)
          .attr("y2", mouseY)
          .attr("opacity", 1);

        svg
          .select(".y-hover")
          .attr("x1", mouseX)
          .attr("y1", 0)
          .attr("x2", mouseX)
          .attr("y2", height)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => {
        svg.select(".y-hover").remove();
        svg.select(".x-hover").remove();
      });

    svgContent
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "blue")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    const maxData = max(data);
    const minData = min(data);

    svgContent
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 7)
      .attr("fill", (d) => (d === maxData || d === minData ? "red" : "yellow"))
      .attr("cx", (value, index) => {
        console.log(`${index} : ${xScale(index)}`);
        return xScale(index);
      })
      .attr("cy", yScale)
      .on("mouseenter", (event, value) => {
        const index = svgContent
          .selectAll(".myDot")
          .nodes()
          .indexOf(event.target);

        svgContent
          .selectAll(".box")
          .data([value])
          .join("rect")
          .attr("class", "box")
          .attr("x", 0)
          .attr("y", yScale(value) - 21)
          .attr("width", 60)
          .attr("height", 25)
          .attr("fill", "orange")
          .attr("opacity", 0.6);

        svgContent.select(`.myDot:nth-child(${index + 2})`).attr("r", 12);
        svgContent
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", 29)
          .attr("text-anchor", "middle")
          .attr("font-size", "25px")
          .transition()
          .attr("y", yScale(value))
          .attr("opacity", 1);
      })
      .on("mouseleave", (event, value) => {
        const index = svgContent
          .selectAll(".myDot")
          .nodes()
          .indexOf(event.target);
        svgContent.select(".tooltip").remove();
        svgContent.select(`.myDot:nth-child(${index + 2})`).attr("r", 7);
        svgContent.select(".box").remove();
      })
      .transition()
      .attr("height", (value) => 150 - yScale(value));

    //tools

    svg.on("click", (event, value) => {
      console.log(comment);
      if (comment == 1) {
        const mouseX = event.pageX - 70;
        const mouseY = event.pageY - 585;
        const dataIndex = Math.round(xScale.invert(mouseX));
        const dataX = xScale(dataIndex);

        const type = d3Annotation.annotationCalloutElbow;
        const annotations = [
          {
            note: {
              label: "example text",
              bgPadding: 20,
              title: "example title",
            },
            x: dataX,
            y: mouseY,
            dx: 50,
            dy: 50,
            idx: dataIndex,
            id: annotationGrp.length,
            connector: { end: "arrow" },
            color: "#808080",
          },
        ];

        const makeAnnotations = d3Annotation
          .annotation()
          .editMode(true)
          .type(type)
          .annotations(annotations);

        svgContent
          .append("g")
          .attr("class", "commentBoxs")
          .datum(annotations[0])
          .call(makeAnnotations);

        setAnnotationGrp((pre) => [...pre, annotations]);

        setComment(0);
      }
    });

    if (annotationGrp.length !== 0) {
      const updatedAnnotations = annotationGrp.map((d) => ({
        ...d[0],
        x: xScale(d[0].idx),
      }));

      const type = d3Annotation.annotationCalloutElbow;
      const makeAnnotations = d3Annotation
        .annotation()
        .editMode(true)
        .type(type)
        .annotations(updatedAnnotations)
        .on("dragend", (annotation) => {
          console.log("drag");
          const { x, y, dx, dy } = annotation;
          const idx = Math.round(xScale.invert(x));
          const updatedAnnotations = annotationGrp.map((d, index) => {
            if (index == annotation.id) {
              return [
                {
                  ...d[0],
                  x: x,
                  y: y,
                  idx: idx,
                  dx: dx,
                  dy: dy,
                },
              ];
            } else {
              return [d[0]];
            }
          });

          setAnnotationGrp(updatedAnnotations);
        })
        .on("noteclick", (annotation) => {
          console.log("noteclick!!");
          console.log(annotationGrp[annotation.id]);
          setPickedAnnot([annotation.id, annotation.note, annotation.color]);
          dispatch(setModalstate(true));
          setIsOpen(true);
        });

      // 기존 annotation 그룹 제거
      svgContent.selectAll(".commentBoxs").remove();

      // 새로운 annotation 그룹 생성
      svgContent
        .append("g")
        .attr("class", "commentBoxs")
        .datum(updatedAnnotations[0])
        .call(makeAnnotations);
    }

    // axes
    const xAxis = axisBottom(xScale);

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([0.9, 10])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);
  }, [currentZoomState, data, dimensions, comment, modalState, updatedContent]);

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([20, width - 20]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height - 70, 70]);

    //draw a grid lines
    const xGrid = axisTop(xScale)
      .tickFormat("")
      .tickSize(height)
      .tickSizeOuter(0)
      .tickValues(xScale.ticks().filter((d, i) => i > 0))
      .ticks(5);

    const yGrid = axisRight(yScale)
      .tickFormat("")
      .tickSize(width)
      .tickSizeOuter(0)
      .ticks(5);

    svgContent.selectAll(".x-grid").remove();
    svgContent.selectAll(".y-grid").remove();
    if (showGrid == 1) {
      svgContent
        .append("g")
        .attr("class", "x-grid")
        .attr("transform", `translate(0, ${height})`)
        .call(xGrid);
      svgContent.append("g").attr("class", "y-grid").call(yGrid);
    } else {
      svgContent.select(".x-grid").remove();
      svgContent.select(".y-grid").remove();
    }
  }, [dimensions, showGrid]);

  const changeBack = () => {
    if (showGrid == 0) {
      setShowGrid(1);
    } else {
      setShowGrid(0);
    }
  };

  const drawHorizonLine = () => {};
  const drawPeriod = () => {};
  const addComment = () => {
    if (comment == 0) {
      setComment(1);
    } else {
      setComment(0);
    }
  };

  return (
    <React.Fragment>
      <div ref={wrapperRef} className={styled.chartWrap}>
        <div>
          <button type="button" onClick={changeBack}>
            show grid
          </button>
          <button type="button" onClick={drawHorizonLine}>
            draw line
          </button>
          <button type="button" onClick={drawPeriod}>
            Period
          </button>
          <button type="button" onClick={addComment}>
            add Comment
          </button>
        </div>
        <svg ref={svgRef} className={styled.chart}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
      {modalState && <AnnotModal isOpen={isOpen} pickedItem={pickedAnnot} />}
    </React.Fragment>
  );
}

export default ZoomableLineChart;
