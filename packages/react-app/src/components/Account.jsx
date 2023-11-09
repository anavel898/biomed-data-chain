import { Button } from "antd";
import React from "react";

import Address from "./Address";

export default function Account({ address, minimized, web3Modal, loadWeb3Modal, logoutOfWeb3Modal }) {
  let accountButtonInfo;
  if (web3Modal?.cachedProvider) {
    accountButtonInfo = { name: "Logout", action: logoutOfWeb3Modal };
  } else {
    accountButtonInfo = { name: "Connect", action: loadWeb3Modal };
  }

  const display = !minimized && <span>{address && <Address address={address} fontSize={20} />}</span>;

  return (
    <div style={{ display: "flex" }}>
      {display}
      {web3Modal && (
        <Button style={{ marginLeft: 8 }} shape="round" onClick={accountButtonInfo.action}>
          {accountButtonInfo.name}
        </Button>
      )}
    </div>
  );
}
