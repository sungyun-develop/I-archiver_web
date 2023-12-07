import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import plcImg from "./../../img/plc.png";
import iocImg from "./../../img/IOC.png";
import desktopImg from "./../../img/desktop.png";
import serverImg from "./../../img/server.png";
import vmeImg from "./../../img/vme.png";
import cameraImg from "./../../img/cctv.png";
import psImg from "./../../img/ps.png";
import switchImg from "./../../img/switch.png";
import oscImg from "./../../img/osc.png";
import etcImg from "./../../img/saw.png";
import centosImg from "./../../img/centos.png";
import windowImg from "./../../img/windows.png";

import styled from "./AllipList.module.css";

function AllipList() {
  const getIpState = useSelector((state) => state.ipinfo);
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const [registerList, setRegisterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleDetailClick = (idx, item) => {
    console.log(item);
    console.log(idx);
    navigate("/networklist/detailinfo", {
      state: { ip: item, id: idx },
    });
  };

  const getDbonpaging = async (page) => {
    try {
      setLoading(true);
      console.log("호출 page는");
      console.log(page);
      const json = await (
        await fetch(
          `http://192.168.100.71:8000/getdb/pagecall?page=${page}&status=${getIpState.data}`
        )
      ).json();
      console.log(json);
      const data = json.data.map((item) => ({
        ip_address: item.ip_address,
        name: item.name,
        id: item.name_id,
        os: item.os_info,
        admin: item.admin,
        num: item.id,
      }));
      setRegisterList((prevList) => [...prevList, ...data]);
      if (data.length < 20) {
        setHasMore(false);
        return;
      }
    } catch (error) {
      console.error("Error 발생", error);
    } finally {
      setLoading(false);
    }
  };

  const getspecificList = async () => {
    setHasMore(true);
    try {
      const json = await (
        await fetch(
          `http://192.168.100.71:8000/getdb/pagecall?page=1&status=${getIpState.data}`
        )
      ).json();
      const data = json.data.map((item) => ({
        ip_address: item.ip_address,
        name: item.name,
        id: item.name_id,
        os: item.os_info,
        admin: item.admin,
        num: item.id,
      }));
      console.log(data);
      if (data.length < 20) {
        setHasMore(false);
      }

      setRegisterList(data);
    } catch (error) {
      console.error("Error 발생", error);
    }
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    //끝에 도달하면 true return
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
      if (hasMore) {
        setPageNum((prevPage) => prevPage + 1);
      } else {
        console.log("are you here?");
        setPageNum((prevPage) => prevPage);
      }
    }
  };

  useEffect(() => {
    console.log("scrolll");
    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("scrolll endddddddddd");
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (hasMore) {
      getDbonpaging(pageNum);
    }
  }, [pageNum]);

  useEffect(() => {
    getspecificList();
    setPageNum(1);
  }, [getIpState.data]);

  return (
    <div className={styled.registerBox}>
      {registerList.map((item, idx) => (
        <div
          key={idx}
          onClick={() => handleDetailClick(idx, item.ip_address)}
          className={styled.ipCard}
        >
          <h3>{item.ip_address}</h3>
          <h3>{item.name}</h3>
          <h3>{item.admin}</h3>
          {item.id === "PLC" ? (
            <img src={plcImg} className={styled.imgs}></img>
          ) : item.id === "EPICS IOC" ? (
            <img src={iocImg} className={styled.imgs}></img>
          ) : item.id === "Windows PC" ? (
            <img src={desktopImg} className={styled.imgs}></img>
          ) : item.id === "서버" ? (
            <img src={serverImg} className={styled.imgs}></img>
          ) : item.id === "VME 보드" ? (
            <img src={vmeImg} className={styled.imgs}></img>
          ) : item.id === "카메라" ? (
            <img src={cameraImg} className={styled.imgs}></img>
          ) : item.id === "전원 장치" ? (
            <img src={psImg} className={styled.imgs}></img>
          ) : item.id === "스위치" ? (
            <img src={switchImg} className={styled.imgs}></img>
          ) : item.id === "계측기" ? (
            <img src={oscImg} className={styled.imgs}></img>
          ) : item.id === "기타" ? (
            <img src={etcImg} className={styled.imgs}></img>
          ) : (
            ""
          )}
          {item.os.startsWith("Centos") ? (
            <img src={centosImg} className={styled.osimgs}></img>
          ) : item.os.startsWith("Windows") ? (
            <img src={windowImg} className={styled.osimgs2}></img>
          ) : (
            ""
          )}
          <h2 className={styled.godetail}>Detail...</h2>
        </div>
      ))}
    </div>
  );
}

export default AllipList;
