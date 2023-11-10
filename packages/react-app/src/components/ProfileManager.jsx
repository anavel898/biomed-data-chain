import { Button, Divider, Input } from "antd";
import React, { useState } from "react";
import { AddDataset, VisualizeProfile } from ".";

function ProfileManager({ currentProfileID, userRole, tx, writeContracts, bmdcContract }) {
  const [newProfileAddress, setNewProfileAddress] = useState();
  const [newProfileName, setNewProfileName] = useState();
  const [newProfileRole, setNewProfileRole] = useState();
  const [newInstitution, setNewInstitution] = useState();
  const [userID, setUserID] = useState();
  const [userForDelete, setUserForDelete] = useState();
  const [datasetID, setDatasetID] = useState("");

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginTop: 32 }}>
        <h4 className="justify">In this section you can manage profiles:</h4>
        {userRole == "controller" ? (
          <div>
            <h5 className="justify" style={{ marginTop: 10 }}>
              Create a new profile
            </h5>
            <Input
              style={{ marginTop: 8 }}
              placeholder="address"
              onChange={e => {
                setNewProfileAddress(e.target.value);
              }}
            />
            <Input
              style={{ marginTop: 8 }}
              placeholder="full name"
              onChange={e => {
                setNewProfileName(e.target.value);
              }}
            />
            <Input
              style={{ marginTop: 8 }}
              placeholder="role"
              onChange={e => {
                setNewProfileRole(e.target.value);
              }}
            />
            <Input
              style={{ marginTop: 8 }}
              placeholder="institution"
              onChange={e => {
                setNewInstitution(e.target.value);
              }}
            />
            <Button
              style={{ marginTop: 8 }}
              onClick={async () => {
                const transaction = tx(
                  writeContracts.YourContract.createProfile(
                    newProfileAddress,
                    newProfileName,
                    newProfileRole,
                    newInstitution,
                  ),
                );
                console.log(await transaction);
                setNewProfileAddress();
                setNewProfileName();
                setNewProfileRole();
                setNewInstitution();
              }}
            >
              Create profile
            </Button>
            <Divider />
            <AddDataset tx={tx} writeContracts={writeContracts} />
            <Divider />
          </div>
        ) : null}
        <VisualizeProfile userRole={userRole} bmdcContract={bmdcContract} />
        <Divider />
        {userRole != "processor" ? (
          <div>
            <h5 className="justify" style={{ marginTop: 10 }}>
              Delete a dataset
            </h5>
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
                const transaction = tx(writeContracts.YourContract.deleteDataset(userID, datasetID));
                console.log(await transaction);
              }}
            >
              Delete dataset
            </Button>
            <Divider />
          </div>
        ) : null}
        {userRole == "controller" ? (
          <div>
            <h5 className="justify" style={{ marginTop: 10 }}>
              Deactivate a profile
            </h5>
            <Input
              style={{ marginTop: 8 }}
              placeholder="profile ID"
              onChange={e => {
                setUserForDelete(e.target.value);
              }}
            />
            <Button
              style={{ marginTop: 8 }}
              onClick={async () => {
                const result = tx(writeContracts.YourContract.deactivateProfile(userForDelete));
                console.log(await result);
              }}
            >
              Deactivate profile
            </Button>
          </div>
        ) : (
          <div>
            <Button
              danger
              style={{ colorBgTextHover: "#ff4d4f" }}
              onClick={async () => {
                const result = tx(writeContracts.YourContract.deactivateProfile(currentProfileID));
                console.log(await result);
              }}
            >
              Deactivate your profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileManager;
