import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import styled from "./DetailInfo.module.css";

function DetailInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const ip_address = location.state.ip;
  const id = location.state.id + 1;

  //mac address
  const [mac, setMac] = useState("");
  //ip alive status
  const [alivestatus, setAlivestatus] = useState(0);
  //자산명
  const [name, setName] = useState("");
  //자산번호
  const [nameNumber, setNameNumber] = useState("");
  //관리자
  const [admin, setAdmin] = useState("");
  //자산 구분
  const [nameId, setNameId] = useState("");
  //설치 위치
  const [localLocation, setLocalLocation] = useState("");
  //switch info
  const [switchInfo, setSwitchInfo] = useState("");
  //소스파일 info
  const [sourceDIr, setSourceDir] = useState("");
  //os info
  const [osInfo, setOsInfo] = useState("");
  //hostname
  const [hostname, setHostname] = useState("");
  //user name
  const [user, setUser] = useState("");
  //password
  const [password, setPassword] = useState("");
  //ssh port
  const [sshport, setSshport] = useState("");
  //security 조치 여부
  const [security, setSecurity] = useState(0);
  //link address
  const [linkadd, setLinkadd] = useState("");
  //summary
  const [summary, setSummary] = useState("");
  //write time
  const [writeTime, setWriteTime] = useState("");

  const getDetail = async () => {
    try {
      const json = await (
        await fetch(`http://127.0.0.1:8000/getdb/${ip_address}/`)
      ).json();
      setMac(json.mac);
      setAlivestatus(json.ip_status);
      setName(json.name);
      setNameNumber(json.name_number);
      setAdmin(json.admin);
      setNameId(json.name_id);
      setLocalLocation(json.location);
      setSwitchInfo(json.switch_info);
      setSourceDir(json.source_dir);
      setOsInfo(json.os_info);
      setHostname(json.hostname);
      setUser(json.user);
      setPassword(json.password);
      setSshport(json.sshport_info);
      setSecurity(json.applied_security);
      setLinkadd(json.link_address);
      setSummary(json.summary);
      let time = new Date(json.write_time);
      let day = ["일", "월", "화", "수", "목", "금", "토"];
      let date =
        time.getFullYear() +
        "년" +
        (time.getMonth() + 1) +
        "월" +
        time.getDate() +
        "일" +
        day[time.getDay()] +
        "요일  " +
        time.getHours() +
        "시" +
        time.getMinutes() +
        "분" +
        time.getSeconds() +
        "초 ";

      setWriteTime(date);
    } catch (error) {
      console.error(`네트워크 에러 발생 응답이 없음 : ${error}`);
    }
  };

  const deleteId = async () => {
    try {
      const json = await axios.delete(
        `http://127.0.0.1:8000/getdb/delete/${ip_address}`
      );
      console.log("Item deleted sucessfully:", json.data);
      navigate("/networklist/");
    } catch (error) {
      console.error("Network Check!!:", error);
    }
  };

  useEffect(() => {
    getDetail();
  }, [location]);

  const handleDeleteCall = () => {
    const userConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (userConfirmed) {
      console.log("삭제합니다...");
      deleteId();
    }
  };

  const handleUpdateCall = () => {
    console.log("data 수정");
    navigate("/networklist/update", {
      state: {
        ip_address: ip_address,
        mac: mac,
        alivestatus: alivestatus,
        name: name,
        nameNumber: nameNumber,
        admin: admin,
        nameId: nameId,
        localLocation: localLocation,
        switchInfo: switchInfo,
        sourceDIr: sourceDIr,
        osInfo: osInfo,
        hostname: hostname,
        user: user,
        password: password,
        sshport: sshport,
        security: security,
        linkadd: linkadd,
        summary: summary,
      },
    });
  };

  return (
    <div className={styled.InfoBox}>
      <span className={styled.subject}>{ip_address} 세부 정보</span>
      <ul className={styled.InfoDetail}>
        <li>
          <span>업데이트 시간</span> : {writeTime}
        </li>
        <li>
          <span>IP 주소</span> : {ip_address}
        </li>
        <li>
          <span>ID</span> : {id}
        </li>
        <li>
          <span>MAC 주소</span> : {mac}
        </li>
        <li>
          <span>IP 활성화 상태</span> : {alivestatus}
        </li>
        <li>
          <span>자산명</span> : {name}
        </li>
        <li>
          <span>자산번호</span> : {nameNumber}
        </li>
        <li>
          <span>자산구분</span> : {nameId}
        </li>
        <li>
          <span>관리자</span> : {admin}
        </li>
        <li>
          <span>위치</span> : {localLocation}
        </li>
        <li>
          <span>스위치 정보</span> : {switchInfo}
        </li>
        <li>
          <span>소스 경로</span> : {sourceDIr}
        </li>
        <li>
          <span>OS</span> : {osInfo}
        </li>
        <li>
          <span>HOSTNAME</span> : {hostname}
        </li>
        <li>
          <span>user명</span> : {user}
        </li>
        <li>
          <span>비밀번호</span> : {password}
        </li>
        <li>
          <span>SSH PORT</span> : {sshport}
        </li>
        <li>
          <span>보안조치 여부</span> : {security}
        </li>
        <li>
          <span>링크 접속</span> : {linkadd}
        </li>
        <li>
          <span>비고</span> : {summary}
        </li>
      </ul>
      <div className={styled.buttonBox}>
        <button
          type="input"
          className={styled.modifyBtn}
          onClick={handleUpdateCall}
        >
          수정
        </button>
        <button
          type="input"
          className={styled.deleteBtn}
          onClick={handleDeleteCall}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default DetailInfo;
