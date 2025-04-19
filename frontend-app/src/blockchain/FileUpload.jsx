import React, { useState } from "react";
import "./FileUpload.css";
import axios from "axios";
const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No Image Selected");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `2557ea3e03e238c15b9d`,
            pinata_secret_api_key: `725eff06efffb62482b932c8a9617fb1a125df2b4d5a5bff3f031bd5a233262a`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.add(account, ImgHash);
        alert("Image Uploaded Successfully");
        setFileName("No Image Selected");
        setFile(null);
      } catch (e) {
        console.log(e);
        console.log("Error response data:", e.response?.data);
      }
    }
  };
  const retriveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
   // console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retriveFile}
        ></input>
        <span className="textArea">Image : {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
