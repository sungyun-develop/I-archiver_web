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
  svg,
  bin,
  range,
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

//insert to img
import gridImg from "../img/grid_layout.png";
import annotImg from "../img/annot.png";
import rightArrow from "../img/right_arrow.png";

function ZoomableLineChart({ data, id = "myZoomableLineChart", switching }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const svgStac0 = useRef();
  const svgStac1 = useRef();
  const svgStac2 = useRef();
  const svgGausian = useRef();

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

  const [colors, setColors] = useState([
    "red",
    "blue",
    "black",
    "green",
    "violet",
    "grey",
    "aqua",
  ]);

  //for stability stactics
  const [stabStrTime, setStabStrTime] = useState(0);
  const [stabEndTime, setStabEndTime] = useState(0);
  const [stabMean, setStabMean] = useState([]);
  const [stabStandard, setStabStandard] = useState([]);
  const [stabDiff, setStabDiff] = useState([]);
  const [stabData, setStabData] = useState([]);
  const [stablens, setStabLens] = useState(0);

  //visible svg
  const [svgVisible, setSvgVisible] = useState(false);

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

    svgRef.current.style.marginLeft = `${xDataSet.length * 100}`; // y-axis & data set 수 연동, 마진 생성

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
          //data가 없으면 루프 안돌도록!
          console.log("data input ok!");

          //multi data sampling 조절 적용
          sampledXSet = [];
          sampledYSet = [];
          sampledDataIdxSet = [];
          let meanArr = [];
          let standardArr = [];
          let resData = [];
          let diff = [];
          let lens = [];
          yDataSet.forEach((ySet, Idx) => {
            console.log("data확인중!!!!!!!!!");
            console.log(`${Idx}번째 데이터`);

            if (zoomedStr < xDataSet[Idx][0]) {
              strPoint = 0;
            } else {
              strPoint = xDataSet[Idx].findIndex(function (time) {
                return time === zoomedStr;
              });
              if (strPoint == -1) {
                let closedIndex = -1;
                let minDiff = Infinity;
                for (let i = 0; i < xDataSet[Idx].length; i++) {
                  const diff = Math.abs(xDataSet[Idx][i] - zoomedStr);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closedIndex = i;
                  }
                }
                strPoint = closedIndex;
              }
            }
            if (zoomedEnd > xDataSet[Idx][xDataSet[Idx].length - 1]) {
              endPoint = xDataSet[Idx].length - 1;
            } else {
              endPoint = xDataSet[Idx].findIndex(function (time) {
                return time === zoomedEnd;
              });
              if (endPoint == -1) {
                let closedIndex = -1;
                let minDiff = Infinity;
                for (let i = 0; i < xDataSet[Idx].length; i++) {
                  const diff = Math.abs(xDataSet[Idx][i] - zoomedEnd);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closedIndex = i;
                  }
                }
                endPoint = closedIndex;
              }
            }
            let slicedData = ySet.slice(strPoint, endPoint);
            let slicedIdx = xDataSet[Idx].slice(strPoint, endPoint);
            let newDataSet = { time: slicedIdx, value: slicedData };
            //sample data 생성
            //그리는 data가 늘어날때마다 sampling 수 조절
            const sampledRes = samplingData(
              newDataSet,
              2000 - yDataSet.length * 150
            );
            sampledXSet.push(sampledRes.sampleX);
            sampledYSet.push(sampledRes.sampleY);
            sampledDataIdxSet.push(sampledRes.sampleIndex);

            //통계처리를 위한 결과 filtering
            console.log("data filtering....");

            console.log(slicedIdx[0]);

            setStabStrTime(slicedIdx[0]);
            setStabEndTime(slicedIdx[slicedIdx.length - 1]);
            console.log(stabStrTime);
            console.log(stabEndTime);

            //중간값을 기준으로 절반이하의 값은 제거
            const middleVal = (max(slicedData) - min(slicedData)) / 2;

            const filteredData = slicedData.filter(
              (data) => data >= middleVal / 2
            ); // (평균/2) data 제거
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
            resData.push(resFilter);
            lens.push(resFilter.length);
          });
          setStabMean(meanArr);
          setStabStandard(standardArr);
          setStabDiff(diff);
          setStabData(resData);
          setStabLens(lens);
        }
      }

      //multi-data layer browsing

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
                (numIdx - dataIdx) * (maxVal * 0.5) +
                (numIdx - 1 - dataIdx) * (peakTopeak * 0.5),
              minVal -
                (dataIdx + 1) * (minVal * 0.7) -
                dataIdx * peakTopeak * 1.5,
            ])
            .range([50, height - 50]);
        } else {
          console.log("single data!");
          yScale = scaleLinear()
            .domain([maxVal + maxVal * 0.1, minVal - minVal * 0.1])
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

  useEffect(() => {
    drawAllGausian();
  }, [dimensions]);

  const drawAllGausian = () => {
    console.log("draw All Gausian datas");
    setSvgVisible(true);
    let mean = stabMean;
    let stdDeviation = stabStandard;
    let rowData = stabData;
    let { x, y, width, height } = svgGausian.current.getBoundingClientRect();

    const svg = select(svgGausian.current);

    //각 histogram refresh
    svg.selectAll("[class^='histograms-']").remove();
    //function
    rowData.forEach((data, idx) => {
      const maxd = max(data);
      const mind = min(data);

      const thresholdArr = range(
        mind,
        maxd + (maxd - mind) / 10,
        (maxd - mind) / 10
      );

      const histo = bin()
        .value((d) => d)
        .domain([mind - (maxd - mind) / 9, maxd + (maxd - mind) / 9])
        .thresholds(thresholdArr);

      const bins = histo(data);
      const size = width / rowData.length;
      console.log(size);
      const xScale = scaleLinear()
        .domain([mind, maxd])
        .range([idx * size + size / 20, (idx + 1) * size - size / 20]);
      const yScale = scaleLinear()
        .domain([0, max(bins, (d) => d.length)])
        .range([height, 20]);

      const xAxis = axisBottom(xScale);
      const yAxis = axisLeft(yScale);

      svg
        .selectAll(`.histograms-${idx}`)
        .data(bins)
        .enter()
        .append("rect")
        .attr("class", `histograms-${idx}`)
        .attr("x", (d) => xScale(d.x0))
        .attr("y", (d) => yScale(d.length))
        .attr("width", (d) => (xScale(d.x1) - xScale(d.x0)) / 1.5)
        .attr("height", (d) => height - yScale(d.length))
        .attr("fill", "steelblue");

      svg
        .select(`.x-axis-${idx}`)
        .attr("transform", `translate(0, ${height})`)
        .attr("font-size", `${size / 31}`)
        .attr("font-weight", "bold")
        .style("text-anchor", "middle")
        .call(xAxis);

      svg
        .select(`.y-axis-${idx}`)
        .attr("transform", `translate(${idx * size},0)`)
        .style("font-size", `${size / 31}`)
        .call(yAxis);
    });
  };

  //act on result button
  useEffect(() => {
    if (svgStac0.current) {
      const svg0 = select(svgStac0.current);
      const svg1 = select(svgStac1.current);
      const svg2 = select(svgStac2.current);

      const {
        x: s0X,
        y: s0Y,
        width: s0Width,
        height: s0Height,
      } = svgStac0.current.getBoundingClientRect();

      const {
        x: s1X,
        y: s1Y,
        width: s1Width,
        height: s1Height,
      } = svgStac1.current.getBoundingClientRect();

      const {
        x: s2X,
        y: s2Y,
        width: s2Width,
        height: s2Height,
      } = svgStac2.current.getBoundingClientRect();

      const xScale = scaleBand()
        .domain(dataKeys)
        .range([0, s0Width])
        .padding(0.3);
      const y0Scale = scaleLinear()
        .domain([0, max(stabMean) + max(stabMean) / 10])
        .range([s0Height, 0]);

      const y1Scale = scaleLinear()
        .domain([0, max(stabStandard) + max(stabStandard) / 10])
        .range([s1Height, 0]);

      const y2Scale = scaleLinear()
        .domain([0, max(stabDiff) + max(stabDiff) / 10])
        .range([s2Height, 0]);

      const xAxis = axisBottom(xScale).ticks(dataKeys.length);
      const y0Axis = axisLeft(y0Scale);
      const y1Axis = axisLeft(y1Scale);
      const y2Axis = axisLeft(y2Scale);

      //sv0 (mean chart) 생성
      svg0.selectAll(".meanResult").remove();
      svg0.selectAll(".tooltip").remove();
      svg0
        .selectAll(".meanResult")
        .data(stabMean)
        .enter()
        .append("rect")
        .attr("class", "meanResult")
        .attr("fill", (d, i) => colors[i])
        .attr("x", (d, i) => xScale(dataKeys[i]))
        .attr("y", (d) => y0Scale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => s0Height - y0Scale(d));
      svg0
        .selectAll(".tooltip")
        .data(stabMean)
        .join("text")
        .attr("class", "tooltip")
        .text((d, i) => stabMean[i].toFixed(1))
        .attr("x", (d, i) => xScale(dataKeys[i]) + xScale.bandwidth() / 2)
        .attr("y", (d) => y0Scale(d) - 2)
        .attr("font-size", "22px")
        .style("text-anchor", "middle");
      svg0
        .select(".x-axis-st0")
        .attr("transform", `translate(0, ${s0Height})`)
        .attr("font-size", `${s0Width / (stabMean.length * 10)}`)
        .attr("font-weight", "bold")
        .style("text-anchor", "middle")
        .call(xAxis);
      svg0
        .select(".y-axis-st0")
        .attr("transform", "translate(0,0)")
        .attr("font-size", `${s0Width / (stabMean.length * 18)}`)
        .attr("font-weight", "bold")
        .call(y0Axis);

      //sv1 (standard deviation chart) 생성
      svg1.selectAll(".meanResult").remove();
      svg1.selectAll(".tooltip").remove();
      svg1
        .selectAll(".meanResult")
        .data(stabStandard)
        .enter()
        .append("rect")
        .attr("class", "meanResult")
        .attr("fill", (d, i) => colors[i])
        .attr("x", (d, i) => xScale(dataKeys[i]))
        .attr("y", (d) => y1Scale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => s1Height - y1Scale(d));
      svg1
        .selectAll(".tooltip")
        .data(stabStandard)
        .join("text")
        .attr("class", "tooltip")
        .text((d, i) => stabStandard[i].toFixed(1))
        .attr("x", (d, i) => xScale(dataKeys[i]) + xScale.bandwidth() / 2)
        .attr("y", (d) => y1Scale(d) - 2)
        .attr("font-size", "22px")
        .style("text-anchor", "middle");
      svg1
        .select(".x-axis-st1")
        .attr("transform", `translate(0, ${s1Height})`)
        .attr("font-size", `${s1Width / (stabMean.length * 10)}`)
        .attr("font-weight", "bold")
        .style("text-anchor", "middle")
        .call(xAxis);
      svg1
        .select(".y-axis-st1")
        .attr("transform", "translate(0,0)")
        .attr("font-size", `${s1Width / (stabMean.length * 18)}`)
        .attr("font-weight", "bold")
        .call(y1Axis);

      //sv2 (standard deviation chart) 생성
      svg2.selectAll(".meanResult").remove();
      svg2.selectAll(".tooltip").remove();
      svg2
        .selectAll(".meanResult")
        .data(stabDiff)
        .enter()
        .append("rect")
        .attr("class", "meanResult")
        .attr("fill", (d, i) => colors[i])
        .attr("x", (d, i) => xScale(dataKeys[i]))
        .attr("y", (d) => y2Scale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => s2Height - y2Scale(d));
      svg2
        .selectAll(".tooltip")
        .data(stabDiff)
        .join("text")
        .attr("class", "tooltip")
        .text((d, i) => stabDiff[i].toFixed(1))
        .attr("x", (d, i) => xScale(dataKeys[i]) + xScale.bandwidth() / 2)
        .attr("y", (d) => y2Scale(d) - 2)
        .attr("font-size", "22px")
        .style("text-anchor", "middle");
      svg2
        .select(".x-axis-st2")
        .attr("transform", `translate(0, ${s2Height})`)
        .attr("font-size", `${s2Width / (stabMean.length * 10)}`)
        .attr("font-weight", "bold")
        .style("text-anchor", "middle")
        .call(xAxis);
      svg2
        .select(".y-axis-st2")
        .attr("transform", "translate(0,0)")
        .attr("font-size", `${s2Width / (stabMean.length * 18)}`)
        .attr("font-weight", "bold")
        .call(y2Axis);
    }
  }, [stabData, dimensions]);

  return (
    <React.Fragment>
      <div className={styled.chartRegion}>
        <div className={styled.chartTools}>
          <button type="button" onClick={changeBack}>
            <img src={gridImg} alt="grid 생성" className={styled.imgs} />
          </button>
          <button type="button" onClick={drawHorizonLine}>
            draw line
          </button>
          <button type="button" onClick={drawPeriod}>
            Period
          </button>
          <button type="button" onClick={addComment}>
            <img src={annotImg} className={styled.imgs} />
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
        <div className={styled.StabMotherBox}>
          <h1>안정도 통계</h1>
          <h2>표본 데이터 정보</h2>
          <div>
            <div className={styled.StabElement}>
              <div className={styled.StabTimeBox}>
                <p>표본 timestamp</p>
                <div className={styled.StabTimeSubBox}>
                  <div>
                    <p>시작 시간</p>
                    <p>{stabStrTime.toLocaleString()}</p>
                  </div>
                  <div>
                    <p>마지막 시간</p>
                    <p>{stabEndTime.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className={styled.StabCntBox}>
                <p>표본 갯수</p>
                <ul>
                  {dataKeys.map((data, idx) => (
                    <li>
                      {data} : {stablens[idx]}개
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={styled.stacticsWrap}>
          <div className={styled.stac0}>
            <h2>평균값</h2>
            <svg ref={svgStac0} className={styled.stac0_chart}>
              <g className="x-axis-st0" />
              <g className="y-axis-st0" />
            </svg>
          </div>
          <div className={styled.stac1}>
            <h2>표준편차</h2>
            <svg ref={svgStac1} className={styled.stac1_chart}>
              <g className="x-axis-st1" />
              <g className="y-axis-st1" />
            </svg>
          </div>
          <div className={styled.stac2}>
            <h2>평균에 대한 변동성 (max-min)/avg</h2>
            <svg ref={svgStac2} className={styled.stac2_chart}>
              <g className="x-axis-st2" />
              <g className="y-axis-st2" />
            </svg>
          </div>
        </div>
        <div className={styled.gausianBoxWrap}>
          <div className={styled.drawGausianBox}>
            <h2>데이터 별 히스토그램 확인(화살표 클릭!)</h2>
            <button
              type="button"
              onClick={drawAllGausian}
              className={styled.rightarrowBox}
            >
              <img
                src={rightArrow}
                alt="right arrow"
                className={styled.rightArrow}
              ></img>
            </button>
          </div>
          <svg ref={svgGausian} className={styled.allGausian}>
            {yDataSet.map((data, index) => (
              <g className={`x-axis-${index}`} />
            ))}
            {yDataSet.map((data, index) => (
              <g className={`y-axis-${index}`} />
            ))}
          </svg>
        </div>
        <h1>test interface...!!</h1>
      </div>
    </React.Fragment>
  );
}

export default ZoomableLineChart;
