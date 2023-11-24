import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "./CreateIp.module.css";
import axios from "axios";
import ximg from "../../img/ximg.png";

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
    name: " ",
    name_number: "-",
    admin: " ",
    name_id: " ",
    location: "-",
    switch_info: "-",
    source_dir: "-",
    os_info: "-",
    hostname: "-",
    user: "-",
    password: "-",
    sshport_info: "-",
    applied_security: false,
    link_address: "-",
    summary: "-",
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
    <div className={styled.CreateBox}>
      <h1>IP정보 등록하기</h1>
      {!!showMessage && (
        <div className={styled.Errmsg}>
          <img src={ximg}></img>
          <h1>{message}</h1>
        </div>
      )}
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
            {ip_status ? <h3>ON</h3> : <h3>OFF</h3>}
          </div>
        </div>
        <div className={styled.inputForm}>
          <div>
            <h3>
              자산명<span>*</span>
            </h3>
            <input
              type="text"
              required
              name="name"
              value={allInfo.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>자산번호</h3>
            <input
              type="text"
              name="name_number"
              value={allInfo.name_number}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>
              관리자<span>*</span>
            </h3>
            <input
              type="text"
              required
              name="admin"
              value={allInfo.admin}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>자산관리자로 입력해주세요</h3>
          </div>
          <div>
            <h3>
              자산 구분<span>*</span>
            </h3>
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
          </div>
          <div>
            <h3>설치 위치</h3>
            <input
              type="text"
              name="location"
              value={allInfo.location}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>예) 갤러리 102랙</h3>
          </div>
          <div>
            <h3>연결된 스위치</h3>
            <input
              type="text"
              name="switch_info"
              value={allInfo.switch_info}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>예) L2#3_PO5</h3>
          </div>
          <div>
            <h3>소스파일 정보</h3>
            <input
              type="text"
              name="source_dir"
              value={allInfo.source_dir}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>
              예) /usr/local/epics/iocApps/iocName
            </h3>
          </div>
          <div>
            <h3>OS </h3>
            <input
              type="text"
              name="source_dir"
              value={allInfo.source_dir}
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
              value={allInfo.hostname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>사용자 계정</h3>
            <input
              type="text"
              name="user"
              value={allInfo.user}
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
              value={allInfo.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>SSH PORT</h3>
            <input
              type="text"
              name="sshport_info"
              value={allInfo.sshport_info}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <h3>링크 주소</h3>
            <input
              type="text"
              name="link_address"
              value={allInfo.link_address}
              onChange={handleInputChange}
              className={styled.includeDesc}
            />
            <h3 className={styled.description}>
              web 접속이 가능한 주소를 입력해주세요
            </h3>
          </div>
          <div className={styled.security}>
            <h3>보안조치 적용?</h3>
            <input
              type="checkbox"
              name="applied_security"
              onChange={handleInputClick}
            />
          </div>
          <div>
            <h3>비고</h3>
            <input
              type="text"
              name="summary"
              value={allInfo.summary}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <input className={styled.submitBtn} type="submit" value="등록" />
      </form>
    </div>
  );
}

export default CreateIp;
