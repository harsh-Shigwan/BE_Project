import React, { useState } from "react";
import "./Display.css";
const Display = ({ account, contract }) => {
  const [data, setData] = useState("");
 
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address")?.value; // Gets input value
    console.log("Address:", Otheraddress);

    if (Otheraddress) {
      dataArray = await contract.display(Otheraddress);
      console.log(dataArray);
    } else {
      dataArray = await contract.display(account);
    }

    const isEmpty = Object.keys(dataArray).length === 0;
    if (!isEmpty) {
      const str = dataArray.toString();
      const str_array = str.split(",");
      // console.log(str_array);
      // console.log(str);
      const images = str_array.map((item, i) => {
        return (
          <a href={item} key={i} target="_blank">
            <img
              key={i}
              src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
              alt="new"
              className="image-list"
            ></img>
          </a>
        );
      });
      setData(images);
    } else {
      alert("No image to display");
    }
  };
  return (
    <div>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </div>
  );
};

export default Display;
