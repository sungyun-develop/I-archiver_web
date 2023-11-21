import { useState, useEffect } from "react";
import styled from "./NetWorkList.module.css";
import CreateIp from "../components/ipinfo/CreateIp";
import { useNavigate } from "react-router-dom";
import { indexOf } from "lodash";

function NetWorkList() {
  const [newIplist, setNewIplist] = useState([]);
  const [newIpinfo, setNewIpInfo] = useState([]);
  const [djanIplist, setDjanIplist] = useState([]);
  const [needRegister, setNeedRegister] = useState([]);
  const [callUpdate, setCallUpdate] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const navigate = useNavigate();

  const getAPI = async () => {
    const json = await (await fetch(`http://127.0.0.1:8000/nmsinfo`)).json();
    console.log(json);
    setNewIpInfo(json);
    setNewIplist(
      json.map(function (item) {
        return item.ip_address;
      })
    );
  };

  const getIpdb = async () => {
    const json = await (await fetch("http://127.0.0.1:8000/getdb")).json();

    setDjanIplist(
      json.map(function (item) {
        return item.ip_address;
      })
    );
  };

  const updateInfo = async (id, newData) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/getdb/update/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );
      if (!response.ok) {
        throw new Error(`no response :: ${response.status}`);
      }
      const updateData = await response.json();
      console.log(updateData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAPI();
    getIpdb();
    console.log(newIplist);
    console.log(djanIplist);
    console.log("----");
    let newlist = [];
    newIplist.map((item) => {
      if (djanIplist.includes(item) == false) {
        newlist.push(item);
      }
    });
    setNeedRegister(newlist);
  }, [refresh]);

  useEffect(() => {
    updateInfo();
  }, [callUpdate]);

  const handleRefresh = () => {
    setRefresh(1);
  };

  const handleRegister = (info) => {
    console.log("new ip");
    console.log(info.item);
    console.log(info.idx);
    let ip_address = info.item;
    let idx = newIplist.indexOf(ip_address);
    let mac = newIpinfo[idx].mac;
    let ip_status = newIpinfo[idx].ip_alive_status;
    navigate("/networklist/registerip", {
      state: { ip: ip_address, mac: mac, status: ip_status },
    });
  };

  const handleDetailClick = (idx, item) => {
    console.log(item);
    console.log(idx);
    navigate("/networklist/detailinfo", {
      state: { ip: item, id: idx },
    });
  };

  return (
    <div>
      <h1>ip 목록</h1>
      <button onClick={handleRefresh}>refresh</button>
      <div className={styled.ipBox}>
        <div className={styled.newBox}>
          <h2> 신규 등록 IP 리스트</h2>
          <div className={styled.newBoxList}>
            <ul>
              {needRegister.map((item, idx) => (
                <li key={idx} onClick={() => handleRegister({ item, idx })}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2>등록된 IP 리스트</h2>
          <ul>
            {djanIplist.map((item, idx) => (
              <li key={idx} onClick={() => handleDetailClick(idx, item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NetWorkList;
