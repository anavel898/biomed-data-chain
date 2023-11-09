import { Button, Input } from "antd";
import React, { useState } from "react";
const { create } = require("ipfs-http-client");

const ipfs = create({
  host: "localhost",
  port: "5001",
  protocol: "http",
});
let version;
try {
  version = ipfs.version();
} catch (error) {
  console.log("IPFS error", error);
  version = undefined;
}

function AddDataset({ tx, writeContracts }) {
  const [file, setFile] = useState();
  const [userID, setUserID] = useState();
  const [datasetID, setDatasetID] = useState();
  const [extension, setExtension] = useState();

  const addOptions = {
    pin: true,
  };

  return (
    <div>
      <input
        type="file"
        onChange={e => {
          const myFile = e.target.files[0];
          setFile(myFile);
        }}
      />
      <Input
        style={{ marginTop: 8 }}
        placeholder="file extension"
        onChange={e => {
          setExtension(e.target.value);
        }}
      />
      <Input
        style={{ marginTop: 8 }}
        placeholder="profile ID"
        onChange={e => {
          setUserID(e.target.value);
        }}
      />
      <Input
        style={{ marginTop: 8 }}
        placeholder="dataset ID"
        onChange={e => {
          setDatasetID(e.target.value);
        }}
      />
      <Button
        style={{ marginTop: 8 }}
        onClick={async () => {
          try {
            const added = await ipfs.add(file, addOptions);
            const cid = added.cid.toString();
            console.log("File uploaded to IPFS with CID:", cid);
            const transaction = tx(writeContracts.YourContract.addDataset(userID, datasetID, cid, extension));
            console.log(await transaction);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Add Dataset
      </Button>
    </div>
  );
}

export default AddDataset;
