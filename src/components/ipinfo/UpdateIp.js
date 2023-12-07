import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import styled from "./UpdateIp.module.css";

function UpdateIp() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const ip_address = location.state.ip_address;
  const mac = location.state.mac;
  const alivestatus = location.state.alivestatus;
  const name = location.state.name;
  const nameNumber = location.state.nameNumber;
  const admin = location.state.admin;
  const nameId = location.state.nameId;
  const localLocation = location.state.localLocation;
  const switchInfo = location.state.switchInfo;
  const sourceDIr = location.state.sourceDIr;
  const osInfo = location.state.osInfo;
  const hostname = location.state.hostname;
  const user = location.state.user;
  const password = location.state.password;
  const sshport = location.state.sshport;
  const security = location.state.security;
  const linkadd = location.state.linkadd;
  const summary = location.state.summary;

  const [allInfo, setAllInfo] = useState({
    ip_address: ip_address,
    mac: mac,
    ip_status: alivestatus,
    name: name,
    name_id: nameId,
    name_number: nameNumber,
    location: localLocation,
    link_address: linkadd,
    source_dir: sourceDIr,
    admin: admin,
    os_info: osInfo,
    hostname: hostname,
    user: user,
    password: password,
    sshport_info: sshport,
    applied_security: security,
    switch_info: switchInfo,
    summary: summary,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleInputClick = (e) => {
    const { name, checked } = e.target;
    setAllInfo((prevInfo) => ({ ...prevInfo, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://192.168.100.71:8000/getdb/update/${ip_address}/`,
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
    <div className={styled.UpdateBox}>
      <h1>IP : {ip_address} 수정</h1>
      <form onSubmit={handleSubmit} className={styled.formBox}>
        <div className={styled.defaultInfo}>
          <div>
            <h3>IP 주소</h3>
            <h3>{ip_address}</h3>
          </div>
          <div>
            <h3>MAC 주소</h3>
            <h3>{mac}</h3>
          </div>
          <div>
            <h3>IP 활성화 상태</h3>
            {alivestatus ? <h3>ON</h3> : <h3>OFF</h3>}
          </div>
        </div>
        <div className={styled.inputForm}>
          <div>
            <h3>자산명</h3>
            <input
              type="text"
              required
              name="name"
              defaultValue={name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>자산번호</h3>
            <input
              type="text"
              required
              name="name_number"
              defaultValue={nameNumber}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <h3>관리자</h3>
            <input
              type="text"
              required
              name="admin"
              defaultValue={admin}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>자산관리자로 입력해주세요</h3>
          </div>
          <div>
            <h3>자산 구분</h3>
            <select
              required
              name="name_id"
              defaultValue={nameId}
              onChange={handleInputChange}
            >
              <option defaultValue={nameId} disabled selected>
                구분 선택
              </option>
              <option value="EPICS IOC"> EPICS IOC</option>
              <option value="Windows PC">Windows PC</option>
              <option value="서버">서버</option>
              <option value="카메라">카메라</option>
              <option value="PLC">PLC</option>
              <option value="VME 보드">VME 보드</option>
              <option value="전원 장치">전원 장치</option>
              <option value="스위치">스위치</option>
              <option value="계측기">계측기</option>
              <option value="기타">기타</option>
              <option value="직접입력">직접입력</option>
            </select>
          </div>
          <div>
            <h3>설치 위치</h3>
            <input
              type="text"
              name="location"
              defaultValue={localLocation}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>예) 갤러리 102랙</h3>
          </div>
          <div>
            <h3>연결 스위치</h3>
            <input
              type="text"
              name="switch_info"
              defaultValue={switchInfo}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>예) L2#3_PO5</h3>
          </div>
          <div>
            <h3>소스파일 정보 </h3>
            <input
              type="text"
              name="source_dir"
              defaultValue={sourceDIr}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>
              예) /usr/local/epics/iocApps/iocName
            </h3>
          </div>
          <div>
            <h3>OS 정보</h3>
            <input
              type="text"
              name="os_info"
              defaultValue={osInfo}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>예) Centos9, Windows11 ....</h3>
          </div>
          <div>
            <h3>HOSTNAME</h3>
            <input
              type="text"
              name="hostname"
              defaultValue={hostname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>계정명</h3>
            <input
              type="text"
              name="user"
              defaultValue={user}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>
              SSH 접속이 가능한 계정으로 입력해주세요.
            </h3>
          </div>
          <div>
            <h3>비밀번호</h3>
            <input
              type="text"
              name="password"
              defaultValue={password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>SSH 포트</h3>
            <input
              type="text"
              name="sshport_info"
              defaultValue={sshport}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <h3>링크 정보</h3>
            <input
              type="text"
              name="link_address"
              defaultValue={linkadd}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>
              web 접속이 가능한 주소를 입력해주세요
            </h3>
          </div>
          <div>
            <h3>보안조치 여부</h3>
            <input
              type="checkbox"
              name="applied_security"
              defaultValue={security}
              onChange={handleInputClick}
            />
          </div>
          <div>
            <h3>비고</h3>
            <input
              type="text"
              name="summary"
              defaultValue={summary}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <input type="submit" value="등록" className={styled.submitBtn} />
      </form>
    </div>
  );
}

export default UpdateIp;
