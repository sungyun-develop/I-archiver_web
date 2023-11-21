import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "./CreateIp.module.css";
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function CreateIp() {
  const navigate = useNavigate();
  const location = useLocation();
  const ip_address = location.state.ip;
  const mac = location.state.mac;
  const ip_status = location.state.status;
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(0);

  const [allInfo, setAllInfo] = useState({
    ip_address: ip_address,
    mac: mac,
    ip_status: ip_status,
    name: "",
    name_number: "",
    admin: "",
    name_id: "",
    location: "",
    switch_info: "",
    source_dir: "",
    os_info: "",
    hostname: "",
    user: "",
    password: "",
    sshport_info: "",
    applied_security: false,
    link_address: "",
    summary: "",
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
    console.log(allInfo);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/getdb",
        allInfo,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowMessage(0);
      navigate("/networklist/");
    } catch (error) {
      console.error("Error", error);
      let errormsg = error.response.data;
      let key = Object.keys(errormsg)[0];
      let msg = errormsg[key][0];
      if (msg === "iplist all with this ip address already exists.") {
        msg = "이미 등록되어 있습니다..";
      } else if (msg === "This field may not be blank.") {
        msg = `${key} 를 채워주세요`;
      } else {
        console.log(msg);
      }
      setMessage(msg);
      setShowMessage(1);
    }
  };

  return (
    <div>
      <h1>IP : {ip_address} 등록</h1>
      {showMessage && <h1 className={styled.Errmsg}>{message}</h1>}
      <form onSubmit={handleSubmit}>
        <ul>
          <li>IP 주소 : {ip_address}</li>
          <li>MAC 주소 : {mac}</li>
          <li>IP 활성화 여부 : {ip_status}</li>
          <li>
            자산명 :{" "}
            <input
              type="text"
              required
              name="name"
              value={allInfo.name}
              onChange={handleInputChange}
            />
          </li>
          <li>
            자산번호 :{" "}
            <input
              type="text"
              required
              name="name_number"
              value={allInfo.name_number}
              onChange={handleInputChange}
            />
          </li>
          <li>
            관리자 :{" "}
            <input
              type="text"
              required
              name="admin"
              value={allInfo.admin}
              onChange={handleInputChange}
            />
          </li>
          <li>
            구분 :{" "}
            <select
              required
              name="name_id"
              value={allInfo.name_id}
              onChange={handleInputChange}
            >
              <option value=" " disabled selected>
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
              value={allInfo.location}
              onChange={handleInputChange}
            />
          </li>
          <li>
            연결 스위치 :{" "}
            <input
              type="text"
              name="switch_info"
              value={allInfo.switch_info}
              onChange={handleInputChange}
            />
          </li>
          <li>
            소스파일 정보 :{" "}
            <input
              type="text"
              name="source_dir"
              value={allInfo.source_dir}
              onChange={handleInputChange}
            />
          </li>
          <li>
            OS 정보 :{" "}
            <input
              type="text"
              name="os_info"
              value={allInfo.os_info}
              onChange={handleInputChange}
            />
          </li>
          <li>
            hostname :{" "}
            <input
              type="text"
              name="hostname"
              value={allInfo.hostname}
              onChange={handleInputChange}
            />
          </li>
          <li>
            계정명 :{" "}
            <input
              type="text"
              name="user"
              value={allInfo.user}
              onChange={handleInputChange}
            />
          </li>
          <li>
            비밀번호 :{" "}
            <input
              type="text"
              name="password"
              value={allInfo.password}
              onChange={handleInputChange}
            />
          </li>
          <li>
            SSH PORT :{" "}
            <input
              type="text"
              name="sshport_info"
              value={allInfo.sshport_info}
              onChange={handleInputChange}
            />
          </li>
          <li>
            보안조치 여부 :{" "}
            <input
              type="checkbox"
              name="applied_security"
              onChange={handleInputClick}
            />
          </li>
          <li>
            링크 :{" "}
            <input
              type="text"
              name="link_address"
              value={allInfo.link_address}
              onChange={handleInputChange}
            />
          </li>
          <li>
            비고 :{" "}
            <input
              type="text"
              name="summary"
              value={allInfo.summary}
              onChange={handleInputChange}
            />
          </li>
        </ul>
        <input type="submit" value="등록" />
      </form>
    </div>
  );
}

export default CreateIp;
