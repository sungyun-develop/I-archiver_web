import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "./CollapseMac.module.css";

function CollapseMac() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  const ip_address = location.state.ip;
  const old_mac = location.state.old_mac;
  const new_mac = location.state.new_mac;
  const [isHovered, setIsHovered] = useState(false);
  const [btnIsHovered, setBtnIsHovered] = useState(false);

  const [allInfo, setAllInfo] = useState({
    ip_status: "",
    name: "",
    name_id: "",
    name_number: "",
    location: "",
    link_address: "",
    source_dir: "",
    admin: "",
    os_info: "",
    hostname: "",
    user: "",
    password: "",
    sshport_info: "",
    applied_security: "",
    switch_info: "",
    summary: "",
    write_time: "",
  });

  const getDetail = async () => {
    try {
      const json = await (
        await fetch(`http://127.0.0.1:8000/getdb/${ip_address}/`)
      ).json();

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
      setAllInfo({
        ip_address: ip_address,
        mac: new_mac,
        ip_status: json.ip_status,
        name: json.name,
        name_id: json.name_id,
        name_number: json.name_number,
        location: json.location,
        link_address: json.link_address,
        source_dir: json.source_dir,
        admin: json.admin,
        os_info: json.os_info,
        hostname: json.hostname,
        user: json.user,
        password: json.password,
        sshport_info: json.sshport_info,
        applied_security: json.applied_security,
        switch_info: json.switch_info,
        summary: json.summary,
      });
    } catch (error) {
      console.error(`네트워크 에러 발생 응답이 없음 : ${error}`);
    }
  };
  useEffect(() => {
    getDetail();
    console.log("aaaa");
    console.log(allInfo);
  }, [location]);

  const handleUpdate = () => {
    console.log("MAC 주소 최신화");
    const userConfirmed = window.confirm("정말로 변경하시겠습니까?");
    if (userConfirmed) {
      console.log("MAC 주소를 업데이트 합니다...");
      updateCall();
    }
  };

  const handleGoHome = () => {
    navigate("/networklist/");
  };

  const updateCall = async () => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/getdb/update/${ip_address}/`,
        allInfo,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/networklist/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styled.BodyBox}>
      <div className={styled.commentBox}>
        <h1>IP는 동일하나 MAC 주소가 다른 자산입니다.</h1>
        <h2>확인 후 MAC 주소 업데이트를 진행해주세요.</h2>
      </div>
      <h1 className={styled.ipAdd}>IP주소 : {ip_address}</h1>
      <div>
        <div className={styled.collapseMacBox}>
          <div
            className={`${styled.newMacBox}  ${
              isHovered ? styled.newBoxisHovered : ""
            }`}
            onMouseEnter={() => setBtnIsHovered(true)}
            onMouseLeave={() => setBtnIsHovered(false)}
          >
            <h2>변경된 MAC 주소</h2>
            <h2>{new_mac}</h2>
          </div>
          <div
            className={styled.oldMacBox}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h2>기존 MAC 주소</h2>
            <h2>{old_mac}</h2>
            <h2
              className={isHovered ? styled.goHome : styled.noHome}
              onClick={handleGoHome}
            >
              홈으로 나갈까요?
            </h2>
          </div>
        </div>
        <h2 className={btnIsHovered ? styled.callUpdate : styled.noneCall}>
          최신화 요청을 해주세요!
        </h2>
        <div className={styled.infos}>
          <div>
            <h3>자산명</h3>
            <h3>{allInfo.name}</h3>
          </div>
          <div>
            <h3>자산번호</h3>
            <h3>{allInfo.name_number}</h3>
          </div>
          <div>
            <h3>자산구분</h3>
            <h3>{allInfo.name_id}</h3>
          </div>
        </div>
      </div>
      <button type="input" className={styled.updateBtn} onClick={handleUpdate}>
        최신화
      </button>
    </div>
  );
}

export default CollapseMac;
