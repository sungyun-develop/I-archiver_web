import { useState } from "react";
import styled from "./ChartSearching.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTimestamp, updatePVlist } from "../actions/actions";

import imgLeftArrow from "../img/left_arrow.png";

function ChartSearching() {
  const [PVlist, setPVlist] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [searchingName, setSearchingName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [lastList, setLastList] = useState([]);
  const [lastItems, setLastItems] = useState([]);
  const [strTime, setStrTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();

  const getList = async (name) => {
    const json = await (await fetch(`mgmt/bpl/getAllPVs?pv=*${name}*`)).json();
    return json;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsVisible(true);
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
    setIsVisible(false);
    console.log("request to archiver appliance");
    const formattedLastList = lastList.map((item) => item.replace(/:/g, "%3A"));
    dispatch(updatePVlist(formattedLastList));
    dispatch(updateTimestamp([strTime, endTime]));
  };

  const closedSearchingBox = () => {
    setIsVisible(false);
  };

  return (
    <div>
      <div className={styled.wrapSearchingForm}>
        <form onSubmit={handleFormSubmit}>
          <div className={styled.searchingForm}>
            <input
              type="text"
              placeholder="PV 이름을 검색해주세요"
              required
              onChange={handleChangeName}
            />
            <input type="submit" value="검색" required />
          </div>
          <div className={styled.timeselect}>
            <input
              type="datetime-local"
              required
              onChange={handleChangeStrTime}
            ></input>
            <input
              type="datetime-local"
              required
              onChange={handleChangeEndTime}
            ></input>
          </div>
        </form>
      </div>

      <div className={isVisible == true ? styled.PVsBox : styled.HiddenBox}>
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
          <div className={styled.wrapArrowBox}>
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
        </div>
        <div className={styled.BtnBox}>
          <button
            type="button"
            onClick={closedSearchingBox}
            className={styled.closeBtnBox}
          >
            <img
              src={imgLeftArrow}
              alt="left arrow"
              className={styled.closeBtn}
            ></img>
          </button>
          <button
            type="button"
            onClick={handleArchivedData}
            className={styled.requestBtn}
          >
            데이터 검색
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChartSearching;
