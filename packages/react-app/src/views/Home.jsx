import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div style={{ margin: 32 }}>
        <span className="bright" style={{ fontWeight: "bolder" }}>
          Welcome to BioMed Data Chain!
        </span>
      </div>
      <div style={{ margin: 32, fontWeight: "bold" }}>
        This is an application for sharing biomedical data between patients, researchers and doctors!
      </div>

      <div style={{ margin: 32 }}>
        To get started connect to a wallet containing your account registered on our network.
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>💭</span>
        Take a look at the{" "}
        <Link to="/about" target="_blank">
          "About"
        </Link>{" "}
        tab for more tips.
      </div>
    </div>
  );
}

export default Home;
