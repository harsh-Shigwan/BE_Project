import React from "react";
import Upload from "../artifacts/contracts/Upload.sol/Upload.json";
import "./Home.css";
import FileUpload from "./FileUpload";
import Display from "./Display";
import Model from "./Model";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
const Home = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contactAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
        const contract = new ethers.Contract(
          contactAddress,
          Upload.abi,
          signer
        );
      // console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.log("No Ethereum Provider found");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <div>
    {!modalOpen && (
      <button className="share" onClick={() => setModalOpen(true)}>
        Share
      </button>
    )}
    {modalOpen && (
      <Model setModalOpen={setModalOpen} contract={contract}></Model>
    )}
    <div className="App">
      <h1 style={{ color: "white" }}>Health Record Management System</h1>
      <div class="bg"></div>
      <div class="bg bg2"></div>
      <div class="bg bg3"></div>

      <p style={{ color: "white" }}>
        Account : {account ? account : "Not Connected"}{" "}
      </p>
      <FileUpload
        account={account}
        contract={contract}
        provider={provider}
      ></FileUpload>

      <Display
        account={account}
        contract={contract}
        provider={provider}
      ></Display>
    </div>
    </div>
  );
};

export default Home;
