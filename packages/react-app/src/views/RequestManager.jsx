import { Button, Divider, Input } from "antd";
import React, { useState } from "react";

class requestForm {
  constructor(requestInfoAsList) {
    this.requestID = requestInfoAsList[0].toString();
    this.requestMadeTo = requestInfoAsList[1].toString();
    this.requester = requestInfoAsList[2].toString();
    this.dataset = requestInfoAsList[3];
    this.status = requestInfoAsList[4];
    this.purpose = requestInfoAsList[5];
  }
}

function RequestManager({ userRole, tx, writeContracts, bmdcContract }) {
  const [ownerID, setOwnerID] = useState();
  const [datasetID, setDatasetID] = useState("");
  const [purpose, setPurpose] = useState();
  const [request, setRequestForm] = useState({});
  const [requestReadError, setRequestReadError] = useState(false);
  const [requestID, setRequestID] = useState();

  if (!(userRole == "subject" || userRole == "controller" || userRole == "processor")) {
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
        <div>
          <h4 className="justify">In this section you can manage requests:</h4>
          <text>ERROR: UNRECOGNIZED USER ROLE OF CONNECTED PROFILE</text>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div
          style={{
            border: "1px solid #cccccc",
            padding: 16,
            width: 800,
            margin: "auto",
            marginTop: 32,
          }}
        >
          <h4 className="justify">In this section you can manage requests:</h4>
          {userRole != "subject" ? (
            <div>
              <h5 className="justify" style={{ marginTop: 10 }}>
                Request access to a dataset. Please provide a short description of the request purpose
              </h5>
              <Input
                style={{ marginTop: 8 }}
                placeholder="owner ID"
                onChange={e => {
                  setOwnerID(e.target.value);
                }}
              />
              <Input
                style={{ marginTop: 8 }}
                placeholder="dataset ID"
                onChange={e => {
                  setDatasetID(e.target.value);
                }}
              />
              <Input
                style={{ marginTop: 8 }}
                placeholder="request purpose"
                onChange={e => {
                  setPurpose(e.target.value);
                }}
              />
              <Button
                style={{ marginTop: 8 }}
                onClick={async () => {
                  const transaction = tx(writeContracts.YourContract.requestAccess(ownerID, datasetID, purpose));
                  console.log(await transaction);
                }}
              >
                Request access
              </Button>
              <Divider />
            </div>
          ) : null}
          <h5 className="justify" style={{ marginTop: 10 }}>
            See a request form
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
              try {
                const transaction = await bmdcContract.getRequest(requestID);
                console.log(await transaction);
                // setRequestForm([
                //   transaction[0].toString(),
                //   transaction[1].toString(),
                //   transaction[2].toString(),
                //   transaction[3],
                //   transaction[4],
                //   transaction[5],
                // ]);
                setRequestForm(new requestForm(transaction));
                setRequestReadError(false);
              } catch (error) {
                setRequestReadError(true);
                console.log(error);
              }
            }}
          >
            Get request
          </Button>
          {Object.keys(request).length === 0 && !requestReadError ? null : requestReadError ? (
            <div style={{ marginTop: 8 }}>There was an error while reading from the blockchain.</div>
          ) : request.requestID == "0" ? (
            <div style={{ marginTop: 8 }}>Request does not exist </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              <div className="justify" style={{ margin: 8 }}>
                REQUEST ID: {request.requestID}
              </div>
              <div className="justify" style={{ margin: 8 }}>
                REQUEST MADE TO: {request.requestMadeTo}
              </div>
              <div className="justify" style={{ margin: 8 }}>
                REQUEST MADE BY: {request.requester}
              </div>
              <div className="justify" style={{ margin: 8 }}>
                REQUESTED DATASET: {request.dataset}
              </div>
              <div className="justify" style={{ margin: 8 }}>
                REQUEST STATUS: {request.status ? "resolved" : "unresolved"}
              </div>
              <div className="justify" style={{ margin: 8 }}>
                PURPOSE OF REQUEST: {request.purpose}
              </div>
            </div>
          )}
        </div>
        <div style={{ paddingBottom: 20 }}></div>
      </div>
    );
  }
}

export default RequestManager;
