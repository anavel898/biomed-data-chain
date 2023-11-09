import React from "react";
import { Spin, Alert } from "antd";
import { Link } from "react-router-dom";

export default function About({ address, ID, status, role }) {
  if (typeof window.ethereum === "undefined") {
    return (
      <div>
        <div>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          <div className="center" style={{ width: 690 }}>
            <Alert
              style={{ textAlign: "center" }}
              message="To use this service, you need to have a wallet extension in your browser. Please install it and connect your account."
              description="Appropriate instructions will load automatically."
              type="info"
            />
          </div>
        </div>
      </div>
    );
  } else if (!address) {
    return (
      <div>
        <div className="bigText" style={{ margin: 32 }}>
          By clicking the <b>Connect</b> button in the upper right corner, you can connect your account.{" "}
          <p>
            Once you connect, your profile information will appear in the <Link to="/profile">"Profile"</Link> tab, and
            suitable usage instructions will appear here.
          </p>
        </div>
      </div>
    );
  } else {
    if (ID == null) {
      return (
        <div style={{ margin: 50 }}>
          <Spin tip="Profile loading" size="large" />
        </div>
      );
    } else if (ID === "0") {
      return (
        <div
          style={{ border: "1px solid #cccccc", margin: "auto", marginTop: 20, width: 600, height: 60, padding: 16 }}
        >
          <h3>This account doesn't have a registered profile.</h3>
        </div>
      );
    }
    if (!status) {
      return (
        <div
          style={{ border: "1px solid #cccccc", margin: "auto", marginTop: 20, width: 600, height: 90, padding: 16 }}
        >
          <h3>This account had a profile, but it was deactivated.</h3>
          <h4>If you think this is a mistake, contact the person who created your profile.</h4>
        </div>
      );
    }
    if (role == "subject") {
      return (
        <div>
          <div
            style={{
              border: "1px solid #cccccc",
              padding: 16,
              width: 900,
              margin: "auto",
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <h3 style={{ fontSize: 22 }}>About the 'Profile' tab</h3>
            <div style={{ textAlign: "justify", fontSize: 16 }}>
              <p>
                Find here the general information saved about you in the system, most important of which are:
                <br></br>
                <b>- Instituion:</b> represents the hospital from which your profile was created <br></br>
                <b>- IDs of requests to be resolved:</b> a list of request IDs that you need to respond to. Please try
                to always clear them all by going into the 'Manage profile and data access' tab an inputing an ID into
                either the Accept request or Refuse request box. <br></br>
                <b>- Owned datasets IDs:</b> using the hyperlinks listed here, you can download your data your medical
                data you volountereed for the system.
              </p>
              <p>
                <b>'Get forms'</b> button generates a table of all the consent forms (valid or revoked) you have made
                since participaing in BMDC. Using the consent IDs present here, you can revoke any of the consents you
                wish.<br></br>
                <b>'See CIDs'</b> button allows you to see the CIDs of all the datasets you have in the system. If you
                decide to instantiate you own IPFS node and join the private peer to peer storage network, you can use
                these CIDs to retrieve your data over that network as well.
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid #cccccc", padding: 16, width: 900, margin: "auto", marginBottom: 10 }}>
            <h3 style={{ fontSize: 22 }}>About the 'Manage profile and data access' tab</h3>
            <div style={{ textAlign: "justify", fontSize: 16 }}>
              <p>
                <b>- Delete a dataset:</b> use it delete any of your datasets available for consent-based sharing from
                the system. However, be advised that this does not delete the actual data from the system, just removes
                its visibility. To completely remove the data, do not do it yourself - contact your doctor, so he/she
                can do this for you.<br></br>
                <b>- Visualize information of a profile:</b> get limited profile information of doctors and scientists
                participating in the project. You cannot see profiles of other patients.
                <br></br>
                <b>- Deactivate your profile:</b> this automatically revokes all your consents and you can no longer
                access the system.
              </p>
              <p>
                <b>- Accept request for data access:</b> input the ID of a request you wish to grant, and a consent form
                will be generated, giving the requester access to the data in question. You can revoke access for any
                consent you gave at any point in time by providing the consent form ID. You can visualize a request made
                to you by inputing the request ID in the 'Get request' box.<br></br>
                <b>- Refuse request for data access:</b> input the ID of a request you do not wish to grant.<br></br>
                <b>- Revoke consent: </b> use the table available in your 'Profile' tab and if you wish revoke any of
                the valid consents.
              </p>
              <p>
                <b>- See a request form: </b>use it to determine who made a request to you, where they work and what is
                the purpose.
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid #cccccc", padding: 16, width: 900, margin: "auto", marginBottom: 10 }}>
            <h3 style={{ fontSize: 22, color: "#dd571c" }}>Important notice</h3>
            <div style={{ textAlign: "justify", fontSize: 16 }}>
              <p>
                Please be advised that the system can guarantee that no unauthorized person can access his/her data
                without consent, as well as the removal of access rights upon revocation of consent. However, if a once
                authorized person removes the data in question from the system (downloads it), BMDC cannot guarantee
                anymore that the data will not be used again regardless of consent status.{" "}
              </p>
              <p>
                <b>
                  <u>In case such breaches are discovered, the perpetrator will be expelled from the system.</u>
                </b>
              </p>
            </div>
          </div>
          <div style={{ paddingBottom: 10 }}></div>
        </div>
      );
    } else if (role == "processor") {
      return (
        <div>
          <div
            style={{
              border: "1px solid #cccccc",
              padding: 16,
              width: 900,
              margin: "auto",
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <h3 style={{ fontSize: 22 }}>About the 'Profile' tab</h3>
            <div style={{ fontSize: 16, textAlign: "justify" }}>
              <p>
                <b>- IDs of requests to be resolved:</b> a list of IDs of data access requests that are yet to be
                resolved by the data owner.<br></br>
                <b>- Accessible dataset IDs:</b> list of hyperlinks to datasets that you obtained consent for use in
                research.
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid #cccccc", padding: 16, width: 900, margin: "auto", marginBottom: 10 }}>
            <h3 style={{ fontSize: 22 }}>About the 'Manage profile and data access' tab</h3>
            <div style={{ fontSize: 16, textAlign: "justify" }}>
              <p>
                <b>- Visualize information of a profile:</b> see some information from a doctor's profile. Use it to
                browse for datasets they added, which can possibly be useful for your research. You cannot see profiles
                of patients or other scientist in the system.<br></br>
                <b>- Deactivate your profile:</b> this will cause you to lose access to the system, and the datasets you
                can access.
              </p>
              <p>
                <b>- Request access:</b> request pateint's consent for accessing some of their data for research
                purposes. Keep the purpose description clear and up to two sentences.
                <br></br>
                <b>- See a request form:</b> visualize a request you made by inputing the request ID in the 'Get
                request' box
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid #cccccc", padding: 16, width: 900, margin: "auto", marginBottom: 10 }}>
            <h3 style={{ fontSize: 22, color: "#ff2400" }}>
              <b>Warning</b>
            </h3>
            <div style={{ fontSize: 16, textAlign: "justify" }}>
              <p>
                1. If a patient revokes his/her consent for using his/her data at any point in time you are obligated by
                rules of BMDC as well as the law to stop using that data immediately.<br></br>
                2. You are allowed to use the data of a patient only for the purpose specified in the request for
                access, i.e., the consent.
                <br></br>
                3. Sharing of the data you have access to with any third parties is strictly prohibited.
              </p>
              <p>
                <b>
                  <u>Failure to comply with any of these rules will result in immediate expulsion from the system.</u>
                </b>
              </p>
            </div>
          </div>
          <div style={{ paddingBottom: 10 }}></div>
        </div>
      );
    } else if (role == "controller") {
      return (
        <div>
          <div
            style={{
              border: "1px solid #cccccc",
              padding: 16,
              width: 1000,
              margin: "auto",
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <h3 style={{ fontSize: 22 }}>About the 'Profile' tab</h3>
            <div style={{ textAlign: "justify", fontSize: 16 }}>
              <p>
                <b>- IDs of requests to be resolved:</b> a list of IDs of data access requests that are yet to be
                resolved by the data owner.
                <br></br>
                <b>- Controlled datasets IDs:</b> list of hyperlinks for datasets of your patients which you added into
                the system and are vouching for their quality.
                <br></br>
                <b>- Accessible dataset IDs:</b> list of hyperlinks for datasets that you got consent to use for
                research purposes.
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid #cccccc", padding: 16, width: 1000, margin: "auto", marginBottom: 10 }}>
            <h3 style={{ fontSize: 22 }}>About the 'Manage profile and data access' tab</h3>
            <div style={{ textAlign: "justify", fontSize: 16 }}>
              <p>
                <b>- Deactivate profile:</b> deactivate your own profile or deactivate profiles of patients upon requst
                or delete profiles of users breaking the rules.<br></br>
                <b>- Add dataset:</b> upload a new dataset into the system. Make sure to name the dataset according to
                following nomenclature: {"<"}
                <i>ownerID</i>
                {">"}-{"<"}
                <i>testCode</i>
                {">"}-{"<"}
                <i>icd10</i>
                {">"}
                <br></br>
                <b>- Delete a dataset:</b> if a patient requests, you are obligated to delete his dataset from the
                system. Make sure that you also activate the protocol for deletion from the storage layer.
                <br></br>
                <b>- Create a new profile:</b> acceptable roles are "subject" (patients), "controller" (doctors),
                "processor" (researchers). For institution of patients input your hospital's name, for researchers their
                Universities and for other dotor the hospitals they work at.
                <br></br>
                <b>- Visualize information of a profile:</b> see profiles of other users by providing the user ID.
              </p>
              <p>
                <b>- Request access:</b> request pateint's consent for accessing some of their data for research
                purposes. Keep the purpose description clear and up to two sentences long.
                <br></br>
                <b>- See a request form:</b> see a request you made by inputing the request ID in the 'Get request' box.
              </p>
            </div>
          </div>
          <div style={{ border: "1px solid #cccccc", padding: 16, width: 1000, margin: "auto" }}>
            <h3 style={{ fontSize: 22, color: "#dd571c" }}>Important notice</h3>
            <div style={{ textAlign: "justify", fontSize: 16 }}>
              <p>
                Please keep in mind that even though you can access the datasets you have uploaded into the system,{" "}
                <b>you are not allowed to use them for any purposes other than the patient's treatment</b>. If you wish
                to use some data from your 'Controller datasets' list for any other purpose,{" "}
                <b>you must make a request to the patient and wait to obtain their consent</b>.
              </p>
            </div>
          </div>
          <div style={{ paddingBottom: 10 }}></div>
        </div>
      );
    }
  }
}
