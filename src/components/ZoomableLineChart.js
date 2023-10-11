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
  minIndex,
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
import { updateTimestamp } from "../actions/actions";

function ZoomableLineChart({ data, id = "myZoomableLineChart", switching }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const svgStac0 = useRef();
  const svgStac1 = useRef();
  const svgStac2 = useRef();
  const wrapperStac = useRef();
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

  const dataLength = Object.keys(data).length;

  const [tempData, setTempData] = useState([]);

  const [xDataSet, setxDataSet] = useState([]);
  const [yDataSet, setyDataSet] = useState([]);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  //for stability stactics
  const [stabMean, setStabMean] = useState([]);
  const [stabStandard, setStabStandard] = useState([]);
  const [stabDiff, setStabDiff] = useState([]);
  const [stabData, setStabData] = useState([]);

  useEffect(() => {
    if (dataLength !== 0) {
      setDataKeys(Object.keys(data));
      setDataValues(Object.values(data));
      setTempData(Object.values(data)[0].y);
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
    svgRef.current.style.marginLeft = `${xDataSet.length * 100}`;

    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    if (xDataSet.length > 0) {
      console.log("data input!");

      //start spot
      const subData = { time: xDataSet[0], value: yDataSet[0] };
      let sampledData = samplingData(subData, 2000);

      let sampledX = sampledData.sampleX;
      let sampledTempData = sampledData.sampleY;
      let sampledDataIdx = sampledData.sampleIndex;

      let sampledXSet = [];
      let sampledYSet = [];
      let sampledDataIdxSet = [];
      let newsampledData;
      xDataSet.forEach((xData, dataIdx) => {
        const subData = { time: xData, value: yDataSet[dataIdx] };
        newsampledData = samplingData(subData, 2000);
        sampledXSet.push(newsampledData.sampleX);
        sampledYSet.push(newsampledData.sampleY);
        sampledDataIdxSet.push(newsampledData.sampleIndex);
      });

      // scales + line generator
      const xScale = scaleTime()
        .domain([sampledXSet[0][0], sampledXSet[0][sampledX.length - 1]])
        .range([20, width - 20]);

      setStartTime(sampledXSet[0][0]);
      setEndTime(sampledXSet[0][sampledXSet[0].length - 1]);

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

          //multi data sampling 조절 적용
          sampledXSet = [];
          sampledYSet = [];
          sampledDataIdxSet = [];
          let meanArr = [];
          let standardArr = [];
          let resData = [];
          let diff = [];
          yDataSet.forEach((ySet, Idx) => {
            let slicedData = ySet.slice(strPoint, endPoint);
            let slicedIdx = xDataSet[Idx].slice(strPoint, endPoint);
            let newDataSet = { time: slicedIdx, value: slicedData };
            //sample data 생성
            const sampledRes = samplingData(newDataSet, 2000);
            sampledXSet.push(sampledRes.sampleX);
            sampledYSet.push(sampledRes.sampleY);
            sampledDataIdxSet.push(sampledRes.sampleIndex);

            //통계처리를 위한 결과 filtering
            console.log("data filtering....");
            const meanVal =
              slicedData.reduce((sum, value) => sum + value, 0) /
              slicedData.length;

            const filteredData = slicedData.filter((data) => data >= meanVal);
            const newmeanVal =
              filteredData.reduce((sum, value) => sum + value, 0) /
              filteredData.length;
            const squaredDiff = filteredData.map((val) =>
              Math.pow(val - newmeanVal, 2)
            );
            const variance =
              squaredDiff.reduce((acc, val) => acc + val, 0) /
              squaredDiff.length;
            const standardDev = Math.sqrt(variance);
            const threshold = standardDev * 2; // 정규분포 95% 신뢰도
            const resFilter = filteredData.filter(
              (data) => Math.abs(data - newmeanVal) <= threshold
            );
            //data export to stactics
            //평균
            const resMean =
              resFilter.reduce((sum, value) => sum + value, 0) /
              resFilter.length;
            //편차제곱
            const resSquaredDiff = resFilter.map((val) =>
              Math.pow(val - resMean, 2)
            );
            //분산
            const resVariance =
              resSquaredDiff.reduce((acc, val) => acc + val, 0) /
              resSquaredDiff.length;
            //표준편차
            const resStandard = Math.sqrt(resVariance);
            const resMax = max(resFilter);
            const resMin = min(resFilter);
            const resDiffavg = ((resMax - resMin) / resMean) * 100;
            meanArr.push(resMean);
            standardArr.push(resStandard);
            diff.push(resDiffavg);
          });
          console.log(meanArr);
          console.log(standardArr);
          console.log(diff);

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

      //multi-data layer browsing
      const colors = [
        "red",
        "blue",
        "black",
        "green",
        "violet",
        "grey",
        "aqua",
      ];

      svg.selectAll(".axis-title").remove();
      sampledXSet.forEach((xData, dataIdx) => {
        console.log("multi layer data browsing");

        let sampledx = xData;
        let sampledy = sampledYSet[dataIdx];
        let sampledIdx = sampledDataIdxSet[dataIdx];

        const minVal = min(sampledy);
        const maxVal = max(sampledy);
        const peakTopeak = maxVal - minVal;
        const numIdx = sampledXSet.length;

        //peak to peak and idx 정보 적용 data browsing shifting
        //domain 영역 offset 값 필수
        let yScale;
        if (numIdx > 1) {
          console.log("multi-data!");
          yScale = scaleLinear()
            .domain([
              maxVal +
                (numIdx - dataIdx) * (maxVal / (numIdx * numIdx) + peakTopeak) -
                dataIdx * (maxVal / numIdx),
              minVal - dataIdx * (maxVal / numIdx + peakTopeak),
            ])
            .range([50, height - 50]);
        } else {
          console.log("single data!");
          yScale = scaleLinear()
            .domain([maxVal, minVal])
            .range([50, height - 50]);
        }

        const lineGenerator = line()
          .x((d, index) => xScale(sampledx[index]))
          .y((d) => yScale(d))
          .curve(curveCardinal);

        svgContent
          .selectAll(`.dataLines-${dataIdx}`)
          .data([sampledy])
          .join("path")
          .attr("class", `dataLines-${dataIdx}`)
          .attr("stroke", colors[dataIdx])
          .attr("fill", "none")
          .attr("d", lineGenerator);

        const yAxis = axisLeft(yScale);

        svg
          .select(`.y-axis-${dataIdx}`)
          .attr("transform", `translate(-${dataIdx * 90},0)`)
          .style("font-size", "14px")
          .call(yAxis);
        svg
          .select(`.y-axis-${dataIdx}`)
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", `translate(-65, ${height / 2})rotate(-90)`)
          .attr("text-anchor", "middle")
          .style("fill", `${colors[dataIdx]}`)
          .style("font-weight", "bold")
          .style("font-size", "16px")
          .text(`${dataKeys[dataIdx]}`);
      });

      // render the line
      console.log(height);

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

          svg
            .append("text")
            .attr("class", "time-tooltip")
            .attr("text-anchor", "middle")
            .attr("font-size", "20px");
        })
        .on("mousemove", (event) => {
          const mouseX =
            event.pageX -
            xDataSet.length * 320 +
            (xDataSet.length - 1) * 220 -
            (width / event.pageX) * 90;

          const mouseY = event.pageY - 1252;

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

          const timeVal = xScale.invert(mouseX);
          const formattedTimeVal = timeVal.toLocaleString();
          svg
            .select(".time-tooltip")
            .attr("x", mouseX)
            .attr("y", 1200)
            .text(formattedTimeVal);
        })
        .on("mouseleave", () => {
          svg.select(".y-hover").remove();
          svg.select(".x-hover").remove();
          svg.select(".time-tooltip").remove();
        });

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

  const addPastData = () => {
    console.log("call the data");
    console.log(startTime);
    console.log(endTime);
    const delta = (endTime - startTime) / 4;
    const adjustedStartTime = new Date(
      startTime.getTime() - delta
    ).toISOString();
    const encodedStartTime = encodeURIComponent(adjustedStartTime);

    const adjustedEndTime = endTime.toISOString();
    const encodedEndTime = encodeURIComponent(adjustedEndTime);
    dispatch(updateTimestamp([encodedStartTime, encodedEndTime]));
  };

  const addRearData = () => {
    console.log("call the data");
    console.log(startTime);
    console.log(endTime);
    const delta = (endTime - startTime) / 4;
    const adjustedStartTime = startTime.toISOString();
    const encodedStartTime = encodeURIComponent(adjustedStartTime);
    const adjustedEndTime = new Date(endTime.getTime() + delta).toISOString();
    const encodedEndTime = encodeURIComponent(adjustedEndTime);

    dispatch(updateTimestamp([encodedStartTime, encodedEndTime]));
  };

  const resStactics = () => {
    console.log("안정도 결과");
    const svg0 = select(svgStac0.current);
    const svg0Content = svg0.select(".content");
    const svg1 = select(svgStac1.current);
    const svg1Content = svg1.select(".content");
    const svg2 = select(svgStac2.current);
    const svg2Content = svg2.select(".content");
  };

  return (
    <React.Fragment>
      <div className={styled.chartRegion}>
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
          <button type="button" onClick={addPastData}>
            add past
          </button>
          <button type="button" onClick={addRearData}>
            add rear
          </button>
        </div>
        <div ref={wrapperRef} className={styled.chartWrap}>
          <svg ref={svgRef} className={styled.chart}>
            <defs>
              <clipPath id={id}>
                <rect x="0" y="0" width="100%  " height="100%" />
              </clipPath>
            </defs>
            <g className="content" clipPath={`url(#${id})`}></g>
            <g className="x-axis" />

            {yDataSet.map((data, index) => (
              <g className={`y-axis-${index}`} />
            ))}
          </svg>
        </div>
        {modalState && <AnnotModal isOpen={isOpen} pickedItem={pickedAnnot} />}
        <div>
          <p>end</p>
          <h2>안정도 통계</h2>
          <button type="button" onClick={resStactics}>
            결과 확인
          </button>
        </div>
        <div ref={wrapperStac}>
          <svg ref={svgStac0}></svg>
          <svg ref={svgStac1}></svg>
          <svg ref={svgStac2}></svg>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ZoomableLineChart;
