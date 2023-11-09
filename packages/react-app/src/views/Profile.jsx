import { Alert, Spin } from "antd";
import { PatientProfile, ResearcherProfile, HospitalProfile } from "./";

function Profile({
  address,
  contract,
  ID,
  fullName,
  createdBy,
  userRole,
  userInstitution,
  status,
  listOfPendingRequests,
  listOfOwnedDatasets,
  linksToOwned,
  linksToAccessible,
  cidsOfOwned,
}) {
  let activityStatus;

  if (typeof window.ethereum === "undefined") {
    return (
      <div>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <div className="center" style={{ width: 690 }}>
          <Alert
            style={{ textAlign: "center" }}
            message="To use this service, you need to have a wallet extension in your browser. Please install it and connect your account. Your profile information will be automatically imported."
            description="In case of problems. Contact your reference person."
            type="info"
          />
        </div>
      </div>
    );
  } else if (!address) {
    return (
      <div>
        <div className="center" style={{ width: 300 }}>
          <Alert style={{ textAlign: "center" }} message="Please connect your account." description=" " type="info" />
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
    }
    if (ID === "0") {
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
    {
      status ? (activityStatus = "active") : (activityStatus = "not active");
    }
    if (userRole == "subject") {
      return (
        <PatientProfile
          contract={contract}
          ID={ID}
          address={address}
          name={fullName}
          createdBy={createdBy}
          role={userRole}
          institution={userInstitution}
          status={activityStatus}
          listOfPendingRequests={listOfPendingRequests}
          listOfOwnedDatasets={listOfOwnedDatasets}
          linksToOwned={linksToOwned}
          cidsOfOwned={cidsOfOwned}
        />
      );
    } else if (userRole == "controller") {
      return (
        <HospitalProfile
          ID={ID}
          address={address}
          name={fullName}
          createdBy={createdBy}
          role={userRole}
          institution={userInstitution}
          status={activityStatus}
          listOfPendingRequests={listOfPendingRequests}
          linksToOwned={linksToOwned}
          linksToAccessible={linksToAccessible}
        />
      );
    } else if (userRole == "processor") {
      return (
        <ResearcherProfile
          ID={ID}
          address={address}
          name={fullName}
          createdBy={createdBy}
          role={userRole}
          institution={userInstitution}
          status={activityStatus}
          listOfPendingRequests={listOfPendingRequests}
          linksToAccessible={linksToAccessible}
        />
      );
    }
  }
}

export default Profile;
