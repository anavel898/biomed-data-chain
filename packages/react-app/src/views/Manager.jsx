import { Alert, Spin } from "antd";
import { ConsentManager, ProfileManager, RequestManager } from ".";

export default function Manager({
  tx,
  writeContracts,
  currUserRole,
  currProfileID,
  currUserStatus,
  address,
  bmdcContract,
}) {
  if (window.ethereum == undefined) {
    return (
      <div className="center" style={{ width: 690 }}>
        <Alert
          style={{ textAlign: "center" }}
          message="To use this service, you need to have a wallet extension in your browser. Please install it and connect your account. Profile manager will appear."
          description="In case of problems. Contact your reference person."
          type="info"
        />
      </div>
    );
  } else if (!address) {
    return (
      <div className="center" style={{ width: 300 }}>
        <Alert style={{ textAlign: "center" }} message="Please connect your account." description=" " type="info" />
      </div>
    );
  } else if (currProfileID === "0") {
    return (
      <div style={{ border: "1px solid #cccccc", margin: "auto", marginTop: 20, width: 800, height: 60, padding: 16 }}>
        <h3>Accounts without a registered profile cannot interact with the system.</h3>
      </div>
    );
  } else if (!currUserStatus) {
    return (
      <div style={{ border: "1px solid #cccccc", margin: "auto", marginTop: 20, width: 600, height: 90, padding: 16 }}>
        <h3>This account had a profile, but it was deactivated.</h3>
        <h4>If you think this is a mistake, contact the person who created your profile.</h4>
      </div>
    );
  } else if (currProfileID == null) {
    return (
      <div style={{ margin: 50 }}>
        <Spin tip="Profile loading" size="large" />
      </div>
    );
  } else {
    return (
      <div>
        <ProfileManager
          currentProfileID={currProfileID}
          userRole={currUserRole}
          tx={tx}
          writeContracts={writeContracts}
          bmdcContract={bmdcContract}
        />
        {currUserRole == "subject" ? (
          <ConsentManager tx={tx} userRole={currUserRole} writeContracts={writeContracts} />
        ) : null}
        <RequestManager userRole={currUserRole} tx={tx} writeContracts={writeContracts} bmdcContract={bmdcContract} />
      </div>
    );
  }
}
