import { Button, Divider, Input } from "antd";
import React, { useState } from "react";

function ConsentManager({ tx, writeContracts, userRole }) {
  const [requestID, setRequestID] = useState();
  const [consentID, setConsentID] = useState();

  if (userRole != "subject") {
    return null;
  } else {
    return (
      <div
        style={{
          border: "1px solid #cccccc",
          padding: 16,
          width: 800,
          margin: "auto",
          marginTop: 32,
        }}
      >
        <h4 className="justify">In this section you can manage consents:</h4>
        <h5 className="justify" style={{ marginTop: 10 }}>
          Accept request for data access
        </h5>
        <Input
          style={{ marginTop: 8 }}
          placeholder="request ID"
          onChange={e => {
            setRequestID(e.target.value);
          }}
        />
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            const transaction = tx(writeContracts.YourContract.acceptConsentRequest(requestID));
            console.log(await transaction);
          }}
        >
          Accept request
        </Button>
        <Divider />
        <h5 className="justify" style={{ marginTop: 10 }}>
          Refuse request for data access
        </h5>
        <Input
          style={{ marginTop: 8 }}
          placeholder="request ID"
          onChange={e => {
            setRequestID(e.target.value);
          }}
        />
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            const transaction = tx(writeContracts.YourContract.denyConsent(requestID));
            console.log(await transaction);
          }}
        >
          Refuse request
        </Button>
        <Divider />
        <h5 className="justify" style={{ marginTop: 10 }}>
          Revoke consent
        </h5>
        <Input
          style={{ marginTop: 8 }}
          placeholder="consent form ID"
          onChange={e => {
            setConsentID(e.target.value);
          }}
        />
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            const transaction = tx(writeContracts.YourContract.revokeConsent(consentID));
            console.log(await transaction);
          }}
        >
          Revoke consent
        </Button>
      </div>
    );
  }
}

export default ConsentManager;
