import { useState } from "react";
import styled from "./ChartSearching.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTimestamp, updatePVlist } from "../actions/actions";

function ChartSearching() {
  const [PVlist, setPVlist] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [searchingName, setSearchingName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastList, setLastList] = useState([]);
  const [lastItems, setLastItems] = useState([]);
  const [strTime, setStrTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const dispatch = useDispatch();

  const getList = async (name) => {
    const json = await (await fetch(`mgmt/bpl/getAllPVs?pv=*${name}*`)).json();
    return json;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const result = await getList(searchingName);
    setSelectedList(result);
    setSelectedItems([]);
  };

  const handleChangeName = (event) => {
    setSearchingName(event.target.value);
  };

  const handleItemClick = (item) => {
    console.log(item);
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItems) => selectedItems !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectedPVClick = () => {
    console.log("send");
    const deleteOverlap = Array.from(new Set([...lastList, ...selectedItems]));
    setLastList(deleteOverlap);
    setLastItems("");
  };

  const handlelastItemClick = (item) => {
    if (lastItems.includes(item)) {
      setLastItems(lastItems.filter((lastItems) => lastItems !== item));
    } else {
      setLastItems([...lastItems, item]);
    }
  };

  const handleDeletePV = () => {
    console.log("out");
    const filterdList = lastList.filter((item) => !lastItems.includes(item));
    setLastList(filterdList);
  };

  const handleChangeStrTime = (event) => {
    console.log(event.target.value);
    const time = event.target.value;
    const formattedTime = new Date(time).toISOString();
    const encodedTime = encodeURIComponent(formattedTime);
    setStrTime(encodedTime);
  };

  const handleChangeEndTime = (event) => {
    console.log(event.target.value);
    const time = event.target.value;
    const formattedTime = new Date(time).toISOString();
    const encodedTime = encodeURIComponent(formattedTime);
    setEndTime(encodedTime);
  };

  const handleArchivedData = () => {
    console.log("request to archiver appliance");
    const formattedLastList = lastList.map((item) => item.replace(/:/g, "%3A"));
    dispatch(updatePVlist(formattedLastList));
    dispatch(updateTimestamp([strTime, endTime]));
  };

  return (
    <div>
      <form className={styled.searchingForm} onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="PV 이름을 검색해주세요"
          required
          onChange={handleChangeName}
        />
        <input type="submit" value="검색" required />
      </form>
      <div className={styled.timeselect}>
        <input type="datetime-local" onChange={handleChangeStrTime}></input>
        <input type="datetime-local" onChange={handleChangeEndTime}></input>
      </div>
      <div className={styled.searchingBoxBody}>
        <ul className={styled.searchingResultBox}>
          {selectedList.map((item, index) => {
            if (index < 20) {
              return (
                <li
                  key={index}
                  onClick={(event) => handleItemClick(item, event)}
                  className={
                    selectedItems.includes(item) ? styled.selectedItem : ""
                  }
                >
                  {item}
                </li>
              );
            }
            return null;
          })}
        </ul>
        <div className={styled.arrowBox}>
          <div
            className={styled.rightArrow}
            onClick={handleSelectedPVClick}
            type="button"
          ></div>
          <div
            className={styled.leftArrow}
            onClick={handleDeletePV}
            type="button"
          ></div>
        </div>
        <ul className={styled.selectedResult}>
          {lastList.map((item, index) => (
            <li
              key={index}
              onClick={(event) => handlelastItemClick(item, event)}
              className={lastItems.includes(item) ? styled.selectedItem : ""}
            >
              {item}
            </li>
          ))}
        </ul>
        <div>
          <button type="button" onClick={handleArchivedData}>
            데이터 검색
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChartSearching;
