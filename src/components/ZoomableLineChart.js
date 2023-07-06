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
  scaleTime,
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

function ZoomableLineChart({ data, id = "myZoomableLineChart", switching }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  console.log("code working on");
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

  //input data formatting
  const [dataKeys, setDataKeys] = useState([]);
  const [dataValues, setDataValues] = useState([]);

  console.log(data);
  const dataLength = Object.keys(data).length;
  console.log(dataLength);
  console.log("----");
  const [tempData, setTempData] = useState([]);

  const [xDataSet, setxDataSet] = useState([]);
  const [yDataSet, setyDataSet] = useState([]);

  useEffect(() => {
    if (dataLength !== 0) {
      setDataKeys(Object.keys(data));
      setDataValues(Object.values(data));
      setTempData(Object.values(data)[0].y);
      console.log(Object.keys(data).length);
      console.log(Object.keys(data));
      console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}");
      let xSet = [];
      let ySet = [];
      const dataSet = Object.values(data).map((idx) => {
        console.log(idx);
        xSet.push(idx.x);
        ySet.push(idx.y);
      });

      const timeStamps = xSet.map((array) => {
        return array.map((item) => {
          const utcTime = new Date(item * 1000);
          return utcTime;
        });
      });

      //dataset to array
      setxDataSet(timeStamps);
      setyDataSet(ySet);
    }
  }, [dataLength, switching]);

  useEffect(() => {
    console.log("updatedContent!");
    if (updatedContent.length > 0) {
      const selectedIdx = updatedContent[0];

      const oldContent = annotationGrp[selectedIdx];
      console.log(oldContent);
      oldContent[0].color = updatedContent[1];
      oldContent[0].note.title = updatedContent[3];
      oldContent[0].note.label = updatedContent[4];

      annotationGrp[selectedIdx] = oldContent;
    }
  }, [updatedContent]);

  const samplingData = (inpData, sampleSize) => {
    const size = inpData.time.length;

    if (size > sampleSize) {
      const step = Math.floor(size / sampleSize);

      const sampleX = [];
      const sampleY = [];
      const sampleIndex = [];

      for (let i = 0; i < size; i += step) {
        sampleX.push(inpData.time[i]);
        sampleY.push(inpData.value[i]);
        sampleIndex.push(i);
      }
      return { sampleX, sampleY, sampleIndex };
    } else {
      return {
        sampleX: inpData.time,
        sampleY: inpData.value,
        sampleIndex: Array.from({ length: data.length }, (_, i) => i),
      };
    }
  };

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    console.log(xDataSet.length);
    if (xDataSet.length > 0) {
      console.log("data input!");
      const subData = { time: xDataSet[0], value: yDataSet[0] };
      let sampledData = samplingData(subData, 2000);

      let sampledX = sampledData.sampleX;
      let sampledTempData = sampledData.sampleY;
      let sampledDataIdx = sampledData.sampleIndex;

      // scales + line generator
      const xScale = scaleTime()
        .domain([sampledX[0], sampledX[sampledX.length - 1]])
        .range([20, width - 20]);

      //when it is worked at the zooming.
      if (currentZoomState) {
        const newXScale = currentZoomState.rescaleX(xScale);
        setZoomPos(newXScale.domain()[0]);
        xScale.domain(newXScale.domain());
        const zoomedStr = Math.floor(newXScale.domain()[0]);
        const zoomedEnd = Math.floor(newXScale.domain()[1]);

        //get the sampling result whenever the zoom is acted.
        let strPoint = xDataSet[0][0];
        let endPoint = xDataSet[0][xDataSet[0].length - 1];
        if (
          zoomedStr > xDataSet[0][0] ||
          zoomedEnd < xDataSet[0][xDataSet[0].length - 1]
        ) {
          if (zoomedStr < xDataSet[0][0]) {
            strPoint = 0;
          } else {
            strPoint = xDataSet[0].findIndex(function (time) {
              return time === zoomedStr;
            });
            if (strPoint == -1) {
              let closedIndex = -1;
              let minDiff = Infinity;
              for (let i = 0; i < xDataSet[0].length; i++) {
                const diff = Math.abs(xDataSet[0][i] - zoomedStr);
                if (diff < minDiff) {
                  minDiff = diff;
                  closedIndex = i;
                }
              }
              strPoint = closedIndex;
            }
          }
          if (zoomedEnd > xDataSet[0][xDataSet[0].length - 1]) {
            endPoint = xDataSet[0].length - 1;
          } else {
            endPoint = xDataSet[0].findIndex(function (time) {
              return time === zoomedEnd;
            });
            if (endPoint == -1) {
              let closedIndex = -1;
              let minDiff = Infinity;
              for (let i = 0; i < xDataSet[0].length; i++) {
                const diff = Math.abs(xDataSet[0][i] - zoomedEnd);
                if (diff < minDiff) {
                  minDiff = diff;
                  closedIndex = i;
                }
              }
              endPoint = closedIndex;
            }
          }

          const strIdx = sampledDataIdx[strPoint];
          const endIdx = sampledDataIdx[endPoint] + 1;

          const newTempData = tempData.slice(strPoint, endPoint);
          const newTempX = xDataSet[0].slice(strPoint, endPoint);
          const subNewTemp = { time: newTempX, value: newTempData };

          sampledData = samplingData(subNewTemp, 2000);
          sampledX = sampledData.sampleX;
          sampledTempData = sampledData.sampleY;
          sampledDataIdx = sampledData.sampleIndex;
          console.log("data 가우시안 계산");
          console.log(newTempData.length);
          const data_mean =
            newTempData.reduce((sum, value) => sum + value, 0) /
            newTempData.length;
          console.log(data_mean);
        }
      }

      const min_val = min(sampledTempData);
      const max_val = max(sampledTempData);
      const delta = max_val - min_val;

      const yScale = scaleLinear()
        .domain([min(sampledTempData) - delta / 4, max(sampledTempData)])
        .range([height - 70, 70]);

      const lineGenerator = line()
        .x((d, index) => xScale(sampledX[index]))
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
          const mouseY = event.pageY - 1280;

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
        .data([sampledTempData])
        .join("path")
        .attr("class", "myLine")
        .attr("stroke", "blue")
        .attr("fill", "none")
        .attr("d", lineGenerator);

      const maxData = max(sampledTempData);
      const minData = min(sampledTempData);

      svgContent
        .selectAll(".myDot")
        .data(sampledTempData)
        .join("circle")
        .attr("class", "myDot")
        .attr("stroke", "black")
        .attr("r", 7)
        .attr("fill", (d) =>
          d === maxData || d === minData ? "red" : "yellow"
        )
        .attr("cx", (value, index) => {
          return xScale(sampledX[index]);
        })
        .attr("cy", (value) => {
          if (Math.abs(maxData - minData) > 1) {
            if (value < 1) {
              return -9999;
            } else {
              return yScale(value);
            }
          } else {
            return yScale(value);
          }
        })
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
            .attr("width", 110)
            .attr("height", 25)
            .attr("fill", "orange")
            .attr("opacity", 0.6);

          svgContent.select(`.myDot:nth-child(${index + 2})`).attr("r", 12);
          svgContent
            .selectAll(".tooltip")
            .data([value])
            .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
            .attr("class", "tooltip")
            .text((d) => {
              if (Math.abs(d) < 0.001 || Math.abs(d) > 10000) {
                return d.toExponential(2);
              } else {
                return d.toFixed(2);
              }
            })
            .attr("x", 45)
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
          const mouseY = event.pageY - 1280;
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
        .scaleExtent([0.9, 20])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", (event) => {
          const zoomState = event.transform;
          setCurrentZoomState(zoomState);
        });

      svg.call(zoomBehavior);
    } else {
      console.log("no data");
    }
  }, [
    currentZoomState,
    xDataSet,
    yDataSet,
    dimensions,
    comment,
    modalState,
    updatedContent,
  ]);

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, tempData.length - 1])
      .range([20, width - 20]);

    const yScale = scaleLinear()
      .domain([0, max(tempData)])
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
      <div>
        <p>end</p>
      </div>
    </React.Fragment>
  );
}

export default ZoomableLineChart;
