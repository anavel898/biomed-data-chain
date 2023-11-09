// import { FontSizeOutlined } from "@ant-design/icons";
// import { useContractReader } from "eth-hooks";
// import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home() {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  //const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span className="bright" style={{ fontWeight: "bolder" }}>
          Welcome to BioMed Data Chain!
        </span>
      </div>
      <div style={{ margin: 32, fontWeight: "bold" }}>
        This is an application for sharing biomedical data between patients, researchers and doctors!
      </div>

      <div style={{ margin: 32 }}>
        To get started connect to a wallet containing your account registered on our network.
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>💭</span>
        Take a look at the{" "}
        <Link to="/about" target="_blank">
          "About"
        </Link>{" "}
        tab for more tips.
      </div>
    </div>
  );
}

export default Home;
