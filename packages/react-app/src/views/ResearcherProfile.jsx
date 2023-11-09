import CommonProfile from "./CommonProfile";

function ResearcherProfile({
  ID,
  address,
  name,
  createdBy,
  role,
  institution,
  status,
  listOfPendingRequests,
  linksToAccessible,
}) {
  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 10 }}>
        <h2>Researcher profile</h2>
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
        {linksToAccessible.length == 0 ? (
          <div className="justify" style={{ margin: 32 }}>
            <b>Accessible datasets IDs:</b> No accessible datasets
          </div>
        ) : (
          <div className="justify" style={{ margin: 32 }}>
            <b>Accessible datasets IDs: </b>
            {linksToAccessible.map((element, index) => {
              if (index == linksToAccessible.length - 1) {
                return (
                  <a href={element.url} target="_blank" rel="noreferrer">
                    {element.name}
                  </a>
                );
              } else {
                return (
                  <a href={element.url} target="_blank" rel="noreferrer">
                    {element.name + ", "}
                  </a>
                );
              }
            })}
          </div>
        )}
      </div>
      <div style={{ paddingBottom: 20 }}></div>
    </div>
  );
}

export default ResearcherProfile;
