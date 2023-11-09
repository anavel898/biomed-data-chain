import { Menu } from "antd";

import "antd/dist/antd.css";
import { useBalance, useContractLoader, useUserProviderAndSigner } from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import { Account, Header } from "./components";
import { NETWORKS } from "./constants";
import externalContracts from "./contracts/external_contracts";

import deployedContracts from "./contracts/hardhat_contracts.json";
import { getRPCPollTime, Transactor, Web3ModalSetup } from "./helpers";
import { Home, About, Profile, Manager } from "./views";
import { useStaticJsonRPC, useGasPrice } from "./hooks";

const { ethers } = require("ethers");

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, goerli, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature

const web3Modal = Web3ModalSetup();

class UserDataset {
  constructor(url, name) {
    this.url = url;
    this.name = name;
  }
}

class UserProfile {
  constructor(ID, address, fullName, createdBy, role, institution, status, pendingRequests, ownedData, accessibleData) {
    this.ID = ID;
    this.address = address;
    this.fullName = fullName;
    this.createdBy = createdBy;
    this.role = role;
    this.institution = institution;
    this.status = status;
    this.pendingRequests = pendingRequests;
    this.ownedData = ownedData;
    this.accessibleData = accessibleData;
  }
}

function App(props) {
  const networkOptions = [initialNetwork.name];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);

  // Sensible pollTimes depending on the provider you are using
  const localProviderPollingTime = getRPCPollTime(localProvider);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "FastGasPrice", localProviderPollingTime);
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address, localProviderPollingTime);

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // 🧫 DEBUG 👨🏻‍🔬

  const [profile, changeProfile] = useState({});

  useEffect(() => {
    if (DEBUG && address && selectedChainId && yourLocalBalance && readContracts && writeContracts) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);

      getProfile().then(response => {
        changeProfile(response);
      });

      console.log("👩‍💼 profile info loaded for current address");
    }
  }, [address, selectedChainId, yourLocalBalance, readContracts, writeContracts, localChainId]);

  const loadWeb3Modal = useCallback(async () => {
    //const provider = await web3Modal.connect();
    const provider = await web3Modal.requestProvider();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
    //automatically connect if it is a safe app
    const checkSafeApp = async () => {
      if (await web3Modal.isSafeApp()) {
        loadWeb3Modal();
      }
    };
    checkSafeApp();
  }, [loadWeb3Modal]);

  const abi = deployedContracts[31337][0].contracts.YourContract.abi;
  const contractAddress = deployedContracts[31337][0].contracts.YourContract.address;
  const bmdcContract = new ethers.Contract(contractAddress, abi, userSigner);

  async function getProfile() {
    const newProfileInfo = await bmdcContract.initProfile();
    const newProfile = new UserProfile(
      newProfileInfo[0].toString(),
      newProfileInfo[1],
      newProfileInfo[2],
      newProfileInfo[3],
      newProfileInfo[4],
      newProfileInfo[5],
      newProfileInfo[6],
      newProfileInfo[7],
      newProfileInfo[8],
      newProfileInfo[9],
    );

    return newProfile;
  }

  // function removes empty elements from the list obtained from blockchain.
  // In case of data list empty element is empty string
  // In case of requests list empty element is "0"
  function getCleanList(uncleanList, content) {
    let cleanList = [];
    if (uncleanList == undefined) {
      return cleanList;
    } else if (content == "data") {
      for (let i = 0; i < uncleanList.length; i++) {
        if (uncleanList[i] != "") {
          cleanList.push(uncleanList[i]);
        }
      }
      return cleanList;
    } else if (content == "requests") {
      for (let i = 0; i < uncleanList.length; i++) {
        if (uncleanList[i].toString() != "0") {
          cleanList.push(uncleanList[i]);
        }
      }
      return cleanList;
    }
  }

  async function getLinksToOwnedDatasets(datasetsList) {
    let urlList = [];
    let cidList = [];
    if (datasetsList == undefined || datasetsList.length == 0) {
      return [urlList, cidList];
    } else {
      const IPFSgatewayAddress = "131.154.97.125:8080";
      for (let i = 0; i < datasetsList.length; i++) {
        const transaction = await bmdcContract.getDataset(datasetsList[i]);
        cidList.push(transaction[0]);
        const url = `http://${IPFSgatewayAddress}/ipfs/${transaction[0]}?filename=${datasetsList[i]}.${transaction[1]}&download=true`; //url begins with IP of the created private IPFS network gateway
        const newDataset = new UserDataset(url, datasetsList[i]);
        urlList.push(newDataset);
      }
      return [urlList, cidList];
    }
  }

  // unlike getLinksToOwnedDatasets() this function does not return CIDs
  async function getLinksToAccessibleDatasets(accessibleList) {
    let urlList = [];
    if (accessibleList == undefined || accessibleList.length == 0) {
      return urlList;
    } else {
      for (let i = 0; i < accessibleList.length; i++) {
        const transaction = await bmdcContract.getDataset(accessibleList[i]);
        const url = `http://131.154.97.125:8080/ipfs/${transaction[0]}?filename=${accessibleList[i]}.${transaction[1]}&download=true`;
        const newDataset = new UserDataset(url, accessibleList[i]);
        urlList.push(newDataset);
      }
      return urlList;
    }
  }

  const [linksToOwned, setOwned] = useState([]);
  const [cidsOfOwned, setCIDs] = useState([]);
  const [linksToAccessible, setAccessible] = useState([]);

  useEffect(async () => {
    if (profile.length != 0) {
      const [urlsList, cidsList] = await getLinksToOwnedDatasets(getCleanList(profile.ownedData, "data"));
      setOwned(urlsList);
      setCIDs(cidsList);
      setAccessible(await getLinksToAccessibleDatasets(getCleanList(profile.accessibleData, "data")));
    }
  }, [profile]);

  return (
    <div className="App">
      <Header>
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1 }}>
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
          </div>
        </div>
      </Header>

      <Menu style={{ textAlign: "center", marginTop: 20 }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/about">
          <Link to="/about">About</Link>
        </Menu.Item>
        <Menu.Item key="/profile">
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="/manager">
          <Link to="/manager">Manage profile and data access</Link>
        </Menu.Item>
      </Menu>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/profile">
          <Profile
            address={address}
            contract={bmdcContract}
            ID={profile.ID}
            fullName={profile.fullName}
            createdBy={profile.createdBy}
            userRole={profile.role}
            userInstitution={profile.institution}
            status={profile.status}
            listOfPendingRequests={getCleanList(profile.pendingRequests, "requests")}
            listOfOwnedDatasets={getCleanList(profile.ownedData, "data")}
            linksToOwned={linksToOwned}
            linksToAccessible={linksToAccessible}
            cidsOfOwned={cidsOfOwned}
          />
        </Route>
        <Route path="/about">
          <About address={address} ID={profile.ID} status={profile.status} role={profile.role} />
        </Route>
        <Route path="/manager">
          <Manager
            tx={tx}
            writeContracts={writeContracts}
            currUserRole={profile.role}
            currProfileID={profile.ID}
            currUserStatus={profile.status}
            address={address}
            bmdcContract={bmdcContract}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
