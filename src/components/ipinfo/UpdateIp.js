import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

  const allInfo = [
    {
      ip_address: ip_address,
      mac: mac,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  };

  const handleInputClick = (e) => {
    const { name, checked } = e.target;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/getdb/update/${ip_address}`,
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
                value={name}
                onChange={handleInputChange}
              />
            </li>
            <li>
              자산번호 :{" "}
              <input
                type="text"
                required
                name="name_number"
                value={nameNumber}
                onChange={handleInputChange}
              />
            </li>
            <li>
              관리자 :{" "}
              <input
                type="text"
                required
                name="admin"
                value={admin}
                onChange={handleInputChange}
              />
            </li>
            <li>
              구분 :{" "}
              <select
                required
                name="name_id"
                value={nameId}
                onChange={handleInputChange}
              >
                <option value={nameId} disabled selected>
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
                value={localLocation}
                onChange={handleInputChange}
              />
            </li>
            <li>
              연결 스위치 :{" "}
              <input
                type="text"
                name="switch_info"
                value={switchInfo}
                onChange={handleInputChange}
              />
            </li>
            <li>
              소스파일 정보 :{" "}
              <input
                type="text"
                name="source_dir"
                value={sourceDIr}
                onChange={handleInputChange}
              />
            </li>
            <li>
              OS 정보 :{" "}
              <input
                type="text"
                name="os_info"
                value={osInfo}
                onChange={handleInputChange}
              />
            </li>
            <li>
              hostname :{" "}
              <input
                type="text"
                name="hostname"
                value={hostname}
                onChange={handleInputChange}
              />
            </li>
            <li>
              계정명 :{" "}
              <input
                type="text"
                name="user"
                value={user}
                onChange={handleInputChange}
              />
            </li>
            <li>
              비밀번호 :{" "}
              <input
                type="text"
                name="password"
                value={password}
                onChange={handleInputChange}
              />
            </li>
            <li>
              SSH PORT :{" "}
              <input
                type="text"
                name="sshport_info"
                value={sshport}
                onChange={handleInputChange}
              />
            </li>
            <li>
              보안조치 여부 :{" "}
              <input
                type="checkbox"
                name="applied_security"
                value={security}
                onChange={handleInputClick}
              />
            </li>
            <li>
              링크 :{" "}
              <input
                type="text"
                name="link_address"
                value={linkadd}
                onChange={handleInputChange}
              />
            </li>
            <li>
              비고 :{" "}
              <input
                type="text"
                name="summary"
                value={summary}
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
