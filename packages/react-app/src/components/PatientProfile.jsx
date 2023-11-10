import { Button } from "antd";
import React, { useState, useEffect } from "react";
import CommonProfile from "./CommonProfile";

class consentForm {
  constructor(consentFormAsList, requester) {
    this.consentID = consentFormAsList[0].toString();
    this.ownerID = consentFormAsList[1].toString();
    this.ownerAddress = consentFormAsList[2];
    this.datasetID = consentFormAsList[3];
    this.consentRequestID = consentFormAsList[4].toString();
    this.consentPurpose = consentFormAsList[5];
    this.requesterID = consentFormAsList[6].toString();
    this.requesterName = requester;
    consentFormAsList[7] ? (this.valid = "valid") : (this.valid = "revoked");
  }
}

class datasetObject {
  constructor(datasetID, CID) {
    this.datasetID = datasetID;
    this.CID = CID;
  }
}

function createListOfDatasetObjects(idsList, cidsList) {
  let listOfObjects = [];
  idsList.forEach((id, index) => {
    const cid = cidsList[index];
    const obj = new datasetObject(id, cid);
    listOfObjects.push(obj);
  });
  return listOfObjects;
}

function PatientProfile({
  contract,
  ID,
  address,
  name,
  createdBy,
  role,
  institution,
  status,
  listOfPendingRequests,
  listOfOwnedDatasets,
  linksToOwned,
  cidsOfOwned,
}) {
  const [formsButtonClicked, click] = useState(false);
  const [consentForms, addConsentForms] = useState([{}]);
  const [cidButtonClicked, cidClick] = useState(false);
  const [datasetObjects, addDatasetObjects] = useState([{}]);

  useEffect(() => {
    click(false);
    cidClick(false);
    addConsentForms([{}]);
    addDatasetObjects([{}]);
  }, [address]);

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 10 }}>
        <h2>Patient profile</h2>
        <CommonProfile
          ID={ID}
          name={name}
          address={address}
          role={role}
          createdBy={createdBy}
          institution={institution}
          status={status}
          listOfPendingRequests={listOfPendingRequests}
        />
        {linksToOwned.length == 0 ? (
          <div className="justify" style={{ margin: 32 }}>
            <b>Owned datasets IDs: </b>
            No owned datasets
          </div>
        ) : (
          <div className="justify" style={{ margin: 32 }}>
            <b>Owned datasets IDs: </b>
            {linksToOwned.map(element => (
              <a href={element.url} target="_blank" rel="noreferrer">
                {element.name + " "}
              </a>
            ))}
          </div>
        )}
      </div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 32 }}>
        <h3 className="justify">Here you can visualize consent forms associated to your profile</h3>
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            const result = await contract.getConsentForms();
            let arrayOfConsents = [];
            for (let i = 0; i < result.length; i++) {
              const requester = await contract.getProfileToSubj(result[i][6]);
              const requesterName = requester[2];
              //   const newConsentForm = new consentForm(
              //     result[i][0].toString(),
              //     result[i][1].toString(),
              //     result[i][2],
              //     result[i][3],
              //     result[i][4].toString(),
              //     result[i][5],
              //     result[i][6].toString(),
              //     requesterName,
              //     result[i][7],
              //   );
              const newConsentForm = new consentForm(result[i], requesterName);
              arrayOfConsents.push(newConsentForm);
            }
            {
              arrayOfConsents.length != 0
                ? addConsentForms(arrayOfConsents)
                : console.log(`PROFILE DOESN'T HAVE CONSENT FORMS`);
            }
            click(true);
          }}
        >
          Get forms
        </Button>
      </div>
      {!formsButtonClicked ? (
        <div style={{ paddingBottom: 20 }}></div>
      ) : consentForms[0].consentID == undefined ? (
        <div style={{ marginTop: 8 }}>THERE ARE NO CONSENT FORMS GENERATED FROM THIS PROFILE</div>
      ) : (
        <div>
          <div style={{ margin: 8 }}>
            <h2>Your consent forms</h2>
          </div>
          <div className="table" style={{ margin: 8 }}>
            <table
              className="table"
              style={{ margin: 8, width: "80%", border: "1px solid black", position: "relative" }}
            >
              <thead style={{ margin: 8, border: "1px solid black" }}>
                <tr>
                  <th style={{ border: "1px solid black" }}>consent ID</th>
                  <th style={{ border: "1px solid black" }}>dataset ID</th>
                  <th style={{ border: "1px solid black" }}>purpose</th>
                  <th style={{ border: "1px solid black" }}>given to</th>
                  <th style={{ border: "1px solid black" }}>status</th>
                </tr>
              </thead>
              <tbody>
                {consentForms.map((form, key) => (
                  <tr key={key}>
                    <td style={{ margin: 8, border: "1px solid black" }}>{form.consentID}</td>
                    <td style={{ margin: 8, border: "1px solid black" }}>{form.datasetID}</td>
                    <td style={{ margin: 8, border: "1px solid black" }}>{form.consentPurpose}</td>
                    <td style={{ margin: 8, border: "1px solid black" }}>{form.requesterName}</td>
                    <td style={{ margin: 8, border: "1px solid black" }}>{form.valid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ paddingBottom: 20 }}></div>
          </div>
        </div>
      )}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 32 }}>
        <h3 className="justify">Here you can visualize CIDs for datasets associated to your profile</h3>
        <Button
          style={{ marginTop: 8 }}
          onClick={() => {
            cidClick(true);
            addDatasetObjects(createListOfDatasetObjects(listOfOwnedDatasets, cidsOfOwned));
          }}
        >
          See CIDs
        </Button>
      </div>
      {!cidButtonClicked ? (
        <div style={{ paddingBottom: 20 }}></div>
      ) : cidsOfOwned.length == 0 ? (
        <div style={{ marginTop: 8 }}>THERE ARE NO DATASETS OWNED BY THIS PROFILE</div>
      ) : (
        <div>
          <div style={{ margin: 8 }}>
            <h2>Your datasets</h2>
          </div>
          <div className="table" style={{ margin: 8 }}>
            <table
              className="table"
              style={{ margin: 8, width: "80%", border: "1px solid black", position: "relative" }}
            >
              <thead style={{ margin: 8, border: "1px solid black" }}>
                <tr>
                  <th style={{ border: "1px solid black" }}>dataset ID</th>
                  <th style={{ border: "1px solid black" }}>CID</th>
                </tr>
              </thead>
              <tbody>
                {datasetObjects.map((dataset, key) => (
                  <tr key={key}>
                    <td style={{ margin: 8, border: "1px solid black" }}>{dataset.datasetID}</td>
                    <td style={{ margin: 8, border: "1px solid black" }}>{dataset.CID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ paddingBottom: 20 }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientProfile;
