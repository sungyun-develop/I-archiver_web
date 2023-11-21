import React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "./ChartTest.module.css";
import ZoomableLineChart from "../components/ZoomableLineChart";
import ChartSearching from "../components/ChartSearching";
import { useSelector } from "react-redux";
import axios from "axios";

axios.defaults.withCredentials = true;

function ChartTest() {
  const svgRef = useRef(null);
  const [data, setData] = useState(
    Array.from({ length: 500 }, () => Math.round(Math.random() * 100))
  );
  const [working, setWorking] = useState(0);

  const timestamp = useSelector((state) => state.timestamp.data);
  const pvlist = useSelector((state) => state.searchingList.data);
  const [dataList, setDataList] = useState({});

  const getAPI = async () => {
    const json = await (
      await fetch(
        `http://192.168.100.178:17668/retrieval/data/getData.json?pv=RFQ%3AAmp&from=2023-03-03T05%3A00%3A00.000Z&to=2023-03-03T10%3A00%3A00.000Z`
      )
    ).json();
    const data = json[0].data;
  };
  useEffect(() => {
    getAPI();
  }, [data]);

  useEffect(() => {
    console.log("updated data!");
    console.log(timestamp);
    const urls = pvlist.map((item) => {
      return `/retrieval/data/getData.json?pv=${item}&from=${timestamp[0]}&to=${timestamp[1]}`;
    });

    const fetchData = async () => {
      try {
        const responses = await Promise.all(urls.map((url) => axios.get(url)));
        const data = [];
        console.log(responses);
        responses.forEach((response, index) => {
          const key = pvlist[index].replace(/%3A/g, ":");
          const x = response.data[0].data.map(
            (item, idx) => response.data[0].data[idx].secs
          );
          const y = response.data[0].data.map(
            (item, idx) => response.data[0].data[idx].val
          );
          data[key] = { x, y };
        });

        setDataList(data);
        if (working == 0) {
          setWorking(1);
        } else {
          setWorking(0);
        }
        console.log(working);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [timestamp, pvlist]);

  return (
    <React.Fragment>
      <h1>Zoomable Chart Test입니다.</h1>
      <h2>D3.js 연습</h2>
      <ChartSearching />
      <ZoomableLineChart data={dataList} switching={working} />
    </React.Fragment>
  );
}

export default ChartTest;
