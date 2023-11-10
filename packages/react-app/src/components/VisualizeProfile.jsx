import { Button, Input } from "antd";
import React, { useState } from "react";
import { ExternalProfile, ExtProfileForController } from ".";

function VisualizeProfile({ userRole, bmdcContract }) {
  const [profileID, setProfileID] = useState();
  const [profile, setProfile] = useState([]);
  const [profileReadError, setProfileReadError] = useState(false);
  const [outsideProfile, setOutsideProfile] = useState([]); // zasto imam setProfile i setOutsideProfile??

  return (
    <div>
      <h5 className="justify" style={{ marginTop: 10 }}>
        Visualize information of a profile
      </h5>
      <Input
        style={{ marginTop: 8 }}
        placeholder="profile ID"
        onChange={e => {
          setProfileID(e.target.value);
        }}
      />
      {userRole == "controller" ? (
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            try {
              const transaction = await bmdcContract.getProfile(profileID);
              setProfile([
                transaction[0].toString(),
                transaction[1],
                transaction[2],
                transaction[3],
                transaction[4],
                transaction[5],
                transaction[6],
                transaction[8],
                transaction[9],
              ]);
              console.log(await transaction); // proveri zasto imas ovo
              setProfileID();
              setProfileReadError(false);
            } catch (error) {
              console.log(error);
              setProfileReadError(true);
              setProfile([]);
            }
          }}
        >
          Get profile
        </Button>
      ) : userRole == "subject" ? (
        <Button
          style={{ marginTop: 8 }}
          onClick={async () => {
            try {
              const transaction = await bmdcContract.getProfileToSubj(profileID);
              setOutsideProfile([
                transaction[0].toString(),
                transaction[1],
                transaction[2],
                transaction[3],
                transaction[4],
                transaction[5],
              ]);
              console.log(await transaction); // proveri zasto imas ovo
              setProfileReadError(false);
              setProfileID();
            } catch (error) {
              setProfileReadError(true);
              setOutsideProfile([]);
              console.log(error);
            }
          }}
        >
          Get profile
        </Button>
      ) : userRole == "processor" ? (
        <div>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              try {
                const transaction = await bmdcContract.getProfileToProcessor(profileID);
                setOutsideProfile([
                  transaction[0].toString(),
                  transaction[1],
                  transaction[2],
                  transaction[3],
                  transaction[4],
                  transaction[5],
                  transaction[6],
                ]);
                console.log(await transaction);
                setProfileReadError(false);
              } catch (error) {
                setProfileReadError(true);
                setOutsideProfile([]);
                console.log(error);
              }
            }}
          >
            Get profile
          </Button>
        </div>
      ) : (
        <div>ERROR: UNRECOGNIZED PROFILE ROLE</div>
      )}
      {profile.length == 0 && outsideProfile.length == 0 && !profileReadError ? null : profileReadError ? (
        <div style={{ marginTop: 8 }}>There was an error while reading from the blockchain.</div>
      ) : userRole == "controller" ? (
        <div>
          <ExtProfileForController
            ID={profile[0]}
            profileAddress={profile[1]}
            name={profile[2]}
            createdBy={profile[3]}
            role={profile[4]}
            institution={profile[5]}
            active={profile[6]}
            datasets={profile[7]}
            accessible={profile[8]}
          />
        </div>
      ) : outsideProfile.length == 7 ? (
        <div>
          <ExternalProfile
            ID={outsideProfile[0]}
            profileAddress={outsideProfile[1]}
            name={outsideProfile[2]}
            role={outsideProfile[3]}
            active={outsideProfile[4]}
            datasets={outsideProfile[5]}
            institution={outsideProfile[6]}
          />
        </div>
      ) : (
        <div>
          <ExternalProfile
            ID={outsideProfile[0]}
            profileAddress={outsideProfile[1]}
            name={outsideProfile[2]}
            role={outsideProfile[3]}
            active={outsideProfile[4]}
            institution={outsideProfile[5]}
          />
        </div>
      )}
    </div>
  );
}

export default VisualizeProfile;
