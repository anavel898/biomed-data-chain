function CommonProfile({ ID, name, address, role, createdBy, institution, status, listOfPendingRequests }) {
  return (
    <div>
      <div className="justify" style={{ margin: 32 }}>
        <b>Profile ID:</b> {ID}
      </div>
      <div className="justify" style={{ margin: 32 }}>
        <b>Full Name:</b> {name}
      </div>
      <div className="justify" style={{ margin: 32 }}>
        <b>User Address:</b> {address}
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
        <b>Profile status:</b> {status}
      </div>
      {listOfPendingRequests.length == 0 ? (
        <div className="justify" style={{ margin: 32 }}>
          <b>IDs of requests to be resolved:</b> No pending requests{" "}
        </div>
      ) : (
        <div className="justify" style={{ margin: 32 }}>
          <b>IDs of requests to be resolved: </b>
          {listOfPendingRequests.map((elem, index) => {
            if (index == listOfPendingRequests.length - 1) {
              return <text>{elem + " "}</text>;
            } else {
              return <text>{elem + ", "}</text>;
            }
          })}
        </div>
      )}
    </div>
  );
}

export default CommonProfile;
