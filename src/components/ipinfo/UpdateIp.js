import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

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
    <div>
      <div>
        <h1>IP : {ip_address} 수정</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            <li>IP 주소 : {ip_address}</li>
            <li>MAC 주소 : {mac}</li>
            <li>IP 활성화 여부 : {alivestatus}</li>
            <li>
              자산명 :{" "}
              <input
                type="text"
                required
                name="name"
                defaultValue={name}
                onChange={handleInputChange}
              />
            </li>
            <li>
              자산번호 :{" "}
              <input
                type="text"
                required
                name="name_number"
                defaultValue={nameNumber}
                onChange={handleInputChange}
              />
            </li>
            <li>
              관리자 :{" "}
              <input
                type="text"
                required
                name="admin"
                defaultValue={admin}
                onChange={handleInputChange}
              />
            </li>
            <li>
              구분 :{" "}
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
                <option value="기타">기타</option>
                <option value="직접입력">직접입력</option>
              </select>
            </li>
            <li>
              설치 위치 :{" "}
              <input
                type="text"
                name="location"
                defaultValue={localLocation}
                onChange={handleInputChange}
              />
            </li>
            <li>
              연결 스위치 :{" "}
              <input
                type="text"
                name="switch_info"
                defaultValue={switchInfo}
                onChange={handleInputChange}
              />
            </li>
            <li>
              소스파일 정보 :{" "}
              <input
                type="text"
                name="source_dir"
                defaultValue={sourceDIr}
                onChange={handleInputChange}
              />
            </li>
            <li>
              OS 정보 :{" "}
              <input
                type="text"
                name="os_info"
                defaultValue={osInfo}
                onChange={handleInputChange}
              />
            </li>
            <li>
              hostname :{" "}
              <input
                type="text"
                name="hostname"
                defaultValue={hostname}
                onChange={handleInputChange}
              />
            </li>
            <li>
              계정명 :{" "}
              <input
                type="text"
                name="user"
                defaultValue={user}
                onChange={handleInputChange}
              />
            </li>
            <li>
              비밀번호 :{" "}
              <input
                type="text"
                name="password"
                defaultValue={password}
                onChange={handleInputChange}
              />
            </li>
            <li>
              SSH PORT :{" "}
              <input
                type="text"
                name="sshport_info"
                defaultValue={sshport}
                onChange={handleInputChange}
              />
            </li>
            <li>
              보안조치 여부 :{" "}
              <input
                type="checkbox"
                name="applied_security"
                defaultValue={security}
                onChange={handleInputClick}
              />
            </li>
            <li>
              링크 :{" "}
              <input
                type="text"
                name="link_address"
                defaultValue={linkadd}
                onChange={handleInputChange}
              />
            </li>
            <li>
              비고 :{" "}
              <input
                type="text"
                name="summary"
                defaultValue={summary}
                onChange={handleInputChange}
              />
            </li>
          </ul>
          <input type="submit" value="등록" />
        </form>
      </div>
    </div>
  );
}

export default UpdateIp;
