import { useState, useEffect, createContext, useContext } from "react";
import styled from "./NetWorkList.module.css";
import CreateIp from "../components/ipinfo/CreateIp";
import { useNavigate, Link } from "react-router-dom";
import { indexOf } from "lodash";
import Loading from "../components/Loading";
import noresultImg from "./../img/noresult.png";

import axios from "axios";
import PingTest from "../components/ipinfo/PingTest";
import NetworkGraph from "../components/ipinfo/NetworkGraph";

export const LoadingContext = createContext();

function NetWorkList() {
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [newIplist, setNewIplist] = useState([]);
  const [newIpinfo, setNewIpInfo] = useState([]);
  const [djanIplist, setDjanIplist] = useState([]);
  const [djanIpInfo, setDjanIpInfo] = useState([]);
  const [collapseIplist, setCollapseIplist] = useState([]);
  const [macInfo, setMacInfo] = useState([]);
  const [needRegister, setNeedRegister] = useState([]);
  const [oldIplist, setOldIplist] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const [ipcheck, setIpcheck] = useState("");
  const [pingRes, setPingRes] = useState(false);
  const [responseTm, setResponseTm] = useState("");
  const [pingTest, setPingTest] = useState(false);

  const [requestSearching, setRequestSearching] = useState(false);
  const [searchingRes, setSearchingRes] = useState(false);
  const [notRegister, setNotRegister] = useState(false);
  const [notManaging, setNotManaging] = useState(false);

  const navigate = useNavigate();

  const getAPI = async () => {
    try {
      const json = await (await fetch(`http://127.0.0.1:8000/nmsinfo`)).json();
      console.log(json);
      setNewIpInfo(json);
      setNewIplist(
        json.map(function (item) {
          return item.ip_address;
        })
      );
      console.log(newIplist.length);
      setLoading(false);
    } catch (error) {
      console.error(`Error check:`, error);
      setLoading(false);
    }
  };

  const getIpdb = async () => {
    try {
      const json = await (await fetch("http://127.0.0.1:8000/getdb")).json();
      setDjanIpInfo(json);
      setDjanIplist(
        json.map(function (item) {
          return item.ip_address;
        })
      );
      setLoading2(false);
    } catch (error) {
      console.error(`Error check:`, error);
      setLoading2(false);
    }
  };

  useEffect(() => {
    getAPI();
    getIpdb();
    setLoading3(false);
    let newlist = [];
    let oldlist = [];
    let collapselist = [];
    let maclist = [];
    newIplist.map((item, idx) => {
      if (djanIplist.includes(item) == false) {
        newlist.push(item);
      } else if (djanIplist.includes(item) == true) {
        let djidx = djanIplist.indexOf(item);
        if (newIpinfo[idx].mac != djanIpInfo[djidx].mac) {
          collapselist.push(item);
          maclist.push({
            old_mac: djanIpInfo[djidx].mac,
            new_mac: newIpinfo[idx].mac,
          });
        }
      }
    });
    djanIplist.map((item) => {
      if (newIplist.includes(item) == false) {
        oldlist.push(item);
      }
    });
    setNeedRegister(newlist);
    setCollapseIplist(collapselist);
    setMacInfo(maclist);
    setOldIplist(oldlist);
    //MAC 충돌 IP 찾기 (IP는 같으나 MAC이 다른 경우 )
  }, [refresh, loading, loading2]);

  const handleRefresh = () => {
    setRefresh(1);
  };

  const handleRegister = (info) => {
    console.log("new ip");
    console.log(info);
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

  const handleValidateInput = (event) => {
    const value = event.target.value;
    const regex = /^[0-9.]*$/;
    if (regex.test(value)) {
      setIpcheck(value);
    }
  };

  const handleSearching = (event) => {
    event.preventDefault();
    console.log("검색 중...");
    setRequestSearching(true);

    const janList = djanIplist.includes(ipcheck);
    const newList = newIplist.includes(ipcheck);
    console.log(newIplist);
    console.log(janList);
    console.log(newList);
    if (janList == true || newList == true) {
      console.log("ok");
      setSearchingRes(true);
      //janList에 false는 장고db에 없다는 뜻
      if (janList == false) {
        console.log("등록되지 않는 IP입니다");
        setNotRegister(true);
        setNotManaging(false);
        //newlist에 false는 장고db에는 있으나 뉴 리스트에 없는 IP
      } else if (newList == false) {
        console.log("현재 관리되지 않는 IP입니다");
        setNotRegister(false);
        setNotManaging(true);
      } else {
        setNotManaging(false);
        setNotRegister(false);
      }
    } else {
      console.log("no list");
      setSearchingRes(false);
    }
  };

  const handleIpCheck = (event) => {
    event.preventDefault();
    setLoading3(true);
    setPingTest(true);

    axios
      .get(`http://127.0.0.1:8000/nmsinfo/check-ping/${ipcheck}/`)
      .then((response) => {
        console.log("응답...........");
        console.log(response.data.message);
        const regex = /[^0-9.]/g;
        const msg = response.data.message;
        if (response.data.success == true) {
          console.log("수신 성공");
          const result = msg.replace(regex, "");
          console.log(result);

          setResponseTm(
            `${(parseFloat(result) * Math.pow(10, 6)).toFixed(3).toString()}ns`
          );
          if (isNaN(responseTm)) {
            setPingRes(false);
          } else {
            setPingRes(true);
          }
        } else {
          setPingRes(false);
          setResponseTm("---");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading3(false);
      });
  };

  const handleGoDetail = () => {
    let idx = djanIplist.indexOf(ipcheck);
    handleDetailClick(idx, ipcheck);
  };

  const handleCollapse = (idx, item) => {
    console.log("collapse MAC");
    console.log(idx);
    console.log(item);
    console.log(macInfo[idx]);
    navigate("/networklist/collapse", {
      state: {
        ip: item,
        old_mac: macInfo[idx].old_mac,
        new_mac: macInfo[idx].new_mac,
      },
    });
  };

  return (
    <div>
      {loading || loading2 || loading3 ? (
        <Loading />
      ) : (
        <div>
          <h1>ip 목록</h1>
          <button onClick={handleRefresh}>refresh</button>

          <div>
            <div className={styled.ipBox}>
              <div className={styled.newBox}>
                <h2> 신규 IP 목록 (등록필요)</h2>
                <h3>
                  <span className={styled.dataNumber}>
                    {needRegister.length}
                  </span>
                  개의 신규IP가 있습니다.
                </h3>
                <div className={styled.newBoxList}>
                  <ul className={styled.ipList}>
                    {needRegister.map((item, idx) => (
                      <li
                        className={styled.ipItem}
                        data-hover={item}
                        key={idx}
                        onClick={() => handleRegister({ item, idx })}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styled.newBox2}>
                <h2>NMS에서 관리되지 않는 IP 목록</h2>
                <h3>
                  <span className={styled.dataNumber}>{oldIplist.length}</span>
                  개의 관리되지 않는 IP가 있습니다.
                </h3>
                <div className={styled.newBoxList}>
                  <ul className={styled.ipList}>
                    {oldIplist.map((item, idx) => (
                      <li
                        className={styled.ipItem}
                        data-hover={item}
                        key={idx}
                        onClick={() => handleDetailClick(idx, item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styled.newBox3}>
                <h2>MAC 충돌 IP 목록</h2>
                <h3>
                  <span className={styled.dataNumber}>
                    {collapseIplist.length}
                  </span>
                  개의 MAC 정보 변경 IP가 있습니다.
                </h3>
                <div className={styled.newBoxList}>
                  <ul className={styled.ipList}>
                    {collapseIplist.map((item, idx) => (
                      <li
                        className={styled.ipItem}
                        data-hover={item}
                        key={idx}
                        onClick={() => handleCollapse(idx, item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <form className={styled.ipSearchingBox} onSubmit={handleSearching}>
          <input
            type="text"
            placeholder="IP 검색, 사용가능 여부 확인"
            value={ipcheck}
            required
            onChange={handleValidateInput}
          />
          <input type="submit" />
        </form>
        <div>
          <div
            className={requestSearching ? styled.showSearching : styled.noShow}
          >
            <LoadingContext.Provider value={{ loading3, setLoading3 }}>
              <PingTest ip_address={ipcheck} />
            </LoadingContext.Provider>
            <div>
              {searchingRes ? (
                notRegister ? (
                  <div>
                    <h3 className={styled.usingIp}>
                      사용중인 <span>IP</span>입니다.
                    </h3>
                    <h3>IP 등록이 필요합니다. 등록하시겠어요?</h3>
                    <h3>
                      등록하려면,{" "}
                      <span
                        className={styled.registerClick}
                        onClick={() => handleRegister({ item: ipcheck })}
                      >
                        여기를 클릭
                      </span>
                    </h3>
                  </div>
                ) : notManaging ? (
                  <div>
                    <h3 className={styled.usingIp}>
                      DB에 등록되었지만 현재 사용하지 않습니다.
                    </h3>
                    <h3>
                      Update나 수정을 원하시면{" "}
                      <span
                        className={styled.registerClick}
                        onClick={handleGoDetail}
                      >
                        여기를 클릭
                      </span>
                    </h3>
                  </div>
                ) : (
                  <div>
                    <h3 className={styled.usingIp}>
                      DB에 등록된 <span>IP</span>입니다.
                    </h3>
                    <h3>
                      세부 정보를 확인하고 싶다면,{" "}
                      <span
                        className={styled.registerClick}
                        onClick={handleGoDetail}
                      >
                        여기를 클릭
                      </span>
                    </h3>
                  </div>
                )
              ) : (
                <div>
                  <img src={noresultImg}></img>
                  <h3>검색 결과가 없습니다...</h3>
                </div>
              )}
            </div>
          </div>
        </div>
        <h1>aaa</h1>
      </div>
      <div>
        <NetworkGraph />
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
  );
}

export default NetWorkList;
