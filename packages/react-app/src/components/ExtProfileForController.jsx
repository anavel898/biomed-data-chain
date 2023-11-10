function getDatasetsOutput(listOfOwnedDatasets) {
  if (listOfOwnedDatasets == undefined) {
    return "";
  }
  let tempOwnedList = [];
  let controlledDatasetsMessage;
  for (let i = 0; i < listOfOwnedDatasets.length; i++) {
    if (listOfOwnedDatasets[i] != "") {
      tempOwnedList.push(listOfOwnedDatasets[i]);
    }
  }
  if (tempOwnedList.length == 0) {
    controlledDatasetsMessage = "No datasets";
  } else {
    controlledDatasetsMessage = tempOwnedList.join(", ");
  }
  return controlledDatasetsMessage;
}

function ExtProfileForController({
  ID,
  profileAddress,
  createdBy,
  name,
  role,
  active,
  datasets,
  institution,
  accessible,
}) {
  const datasetsOutput = getDatasetsOutput(datasets);
  const accessibleOutput = getDatasetsOutput(accessible);

  if (!active) {
    return (
      <div style={{ border: "1px solid #cccccc", margin: "auto", marginTop: 20, width: 600, height: 90, padding: 16 }}>
        <h3>This account had a profile, but it was deactivated.</h3>
        <h4>If you think this is a mistake, contact the person who created your profile.</h4>
      </div>
    );
  } else {
    return (
      <div>
        <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 10 }}>
          {role == "subject" ? (
            <h2>Patient profile</h2>
          ) : role == "controller" ? (
            <h2>Hospital profile</h2>
          ) : (
            <h2>Researcher profile</h2>
          )}
          <div className="justify" style={{ margin: 32 }}>
            <b>Profile ID:</b> {ID}
          </div>
          <div className="justify" style={{ margin: 32 }}>
            <b>Full Name:</b> {name}
          </div>
          <div className="justify" style={{ margin: 32 }}>
            <b>User Address:</b> {profileAddress}
          </div>
          <div className="justify" style={{ margin: 32 }}>
            <b>Created by:</b> {createdBy}
          </div>
          <div className="justify" style={{ margin: 32 }}>
            <b>User role:</b> {role}
          </div>
          <div className="justify" style={{ margin: 32 }}>
            <b>Institution:</b> {institution}
          </div>
          <div className="justify" style={{ margin: 32 }}>
            <b>Profile status:</b> {active ? "active" : "not active"}
          </div>
          {role == "controller" && datasets != undefined ? (
            <div className="justify" style={{ margin: 32 }}>
              <b>Controlled datasets IDs:</b> {datasetsOutput}
            </div>
          ) : role == "subject" && datasets != undefined ? (
            <div className="justify" style={{ margin: 32 }}>
              <b>Owned datasets IDs:</b> {datasetsOutput}
            </div>
          ) : role == "processor" && accessible != undefined ? (
            <div className="justify" style={{ margin: 32 }}>
              <b>Accessible datasets IDs:</b> {accessibleOutput}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default ExtProfileForController;
