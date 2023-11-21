import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
      setWriteTime(json.write_time);
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
    <div>
      <h1>Detail Info</h1>
      <ul>
        <li>업데이트 시간 : {writeTime}</li>
        <li>IP 주소 : {ip_address}</li>
        <li>ID : {id}</li>
        <li>MAC 주소 : {mac}</li>
        <li>IP 활성화 상태 : {alivestatus}</li>
        <li>자산명 : {name}</li>
        <li>자산번호 : {nameNumber}</li>
        <li>자산구분 : {nameId}</li>
        <li>관리자 : {admin}</li>
        <li>위치 : {localLocation}</li>
        <li>스위치 정보 : {switchInfo}</li>
        <li>소스 경로 : {sourceDIr}</li>
        <li>OS : {osInfo}</li>
        <li>HOSTNAME : {hostname}</li>
        <li>user명 : {user}</li>
        <li>비밀번호 : {password}</li>
        <li>SSH PORT : {sshport}</li>
        <li>보안조치 여부 : {security}</li>
        <li>링크 접속 : {linkadd}</li>
        <li>비고 : {summary}</li>
      </ul>
      <div>
        <button type="input" onClick={handleUpdateCall}>
          modify
        </button>
        <button type="input" onClick={handleDeleteCall}>
          delete
        </button>
      </div>
    </div>
  );
}

export default DetailInfo;
