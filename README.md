# BioMed Data Chain - Overiew:

A decentralized application for sharing biomedical data between hospitals, researchers and patients.  
BMDC was created using the scaffold-eth toolkit for DApp development.

---

![home-tab](https://github.com/anavel898/biomed-data-chain/assets/101400549/03a5671b-9862-41ba-b854-0d57834c4eb7)

---

It was created with data privacy principles outlined by the GDPR in mind. The app has three distinct types of users - hospitals, researchers and patients. Each user type has an intended set of available actions in the app: doctors (representing hospitals) recruit their patients to participate in the data sharing system, while the scientists utilize the system to obtain the data for their research projects. The patients have ownership of their data and the ability to grant or revoke access to their data at any point in time.  
BMDC was created with the idea that its running and upkeep are a mutual effort of a consortium of hospitals and universities, all running blockchain nodes and acting as validators in the private permissioned network.

> The first step common to all user types is to connect to MetaMask. The UI prompts the user to do so.
> ![image]  
> &nbsp;  
> After logging in, the application is rendered differently based on the profile information of the connected account, which is automatically fetched from the blockchain upon connecting.

## Hospital view:

Hospital employees, i.e., doctors act on behalf of their respective institution with the goal to incentivize patients to participate in the data sharing effort. If patients decide to take part, the doctors create their profiles, and ingest the data into the system. From this point on, the patient controls who can access their data for research purposes, giving them sovereignty over their own data. Also, when a new researcher from a partner University wants to join the system, their profile creation is handled by the hospital.  
&nbsp;  
**Key actions:** creating new profiles, adding patient data into the system (data controller).

### Profile tab

![image]

### Manager tab

![image]

## Researcher view:

Researchers who participate in the system must be affiliated with one of the Universities participating in the system. They can use the app by browsing the profiles of participating hospitals. The researches see available datasets as dataset IDs, which are comprised of three fields: owner profile ID, abbreviation of the test that yielded the data, and the ICD-10 code of the relevant diagnosis. This ensures that patients remain anonymous, while researchers are still able to request their data by using the first field of the dataset ID. Once a patient grant consent to use some of their data for a purpose specified in the request, the researcher can access the data through a link that appears on their profile tab.

**Key actions:** making requests for consent and accessing data (data processor)

### Profile tab

![image]

### Manager tab

![image]

## Patient view:

Users with the role of patient are intended to periodically check their profiles for new requests, and respond. Besides the option to accept or deny new requests, patients can also revoke already existing consents at any moment. They can do this by checking the table with all the consents form they have ever created for any they potentially wish to revoke. Patients are not obligated to take part in the decentralized storage network, but if they wish to, they are provided with the necessary information to take ownership of their proprietary data on the network.

**Key actions:** responding to requests for consent (data subject)

### Profile tab

![image]

### Manager tab

![image]

# Quick Start

Prerequisites: [Node (v18 LTS)](https://nodejs.org/en/download/), [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/), [Git](https://git-scm.com/downloads), [MetaMask](https://metamask.io/download/) extension installed in the browser and [IPFS kubo](https://docs.ipfs.tech/install/command-line/#install-ipfs-kubo) local node.

🚨 If you are using a version < v18 you will need to remove `openssl-legacy-provider` from the `start` script in `package.json`

> 1. clone/fork BioMed Data Chain:

```bash
git clone https://github.com/anavel898/biomed-data-chain
```

> 2. install and start a Hardhat chain:

```bash
cd biomed-data-chain
yarn install
yarn chain
```

> 3. in a second terminal window, deploy your contract: :

```bash
cd biomed-data-chain
yarn deploy
```

> 4. in a third terminal window, start your IPFS node:

```bash
ipfs daemon
```

> 5. in a new terminal window, start your frontend:

```bash
cd biomed-data-chain
yarn start
```

Open http://localhost:3000 to see the app

# Architecture:

![image]

> User profile data and metadata about the sensitive data being shared over the system is stored on the blockchain, where the logic for access and right modification of this information is provided through the [BMDC smart contract](https://github.com/anavel898/biomed-data-chain/blob/master/packages/hardhat/contracts/CMS.sol).

> A private InterPlanetary File System network is used as a decentralized storage layer (shown in the image below). Once a patient gives consent for someone to access their data, a link for the retrieval of the data through the private IPFS network gateway is provided to the receiver of the consent.  
> 🚨 This project was developed as part of my internship at INFN-CNAF and such IPFS network was simulated using the INFN Cloud resources. Considering I'm no longer affiliated with INFN-CNAF, the mentioned gateway is no longer active, so attempts to access the links now will result in an HTTP error 503.

![image]

> The web interface was built as a React application, leveraging some options provided by the Scaffold-eth toolkit. User identities are managed automatically by connecting an account through MetaMask. Once the account is connected all the necessary data is automatically fetched from the blockchain by an automatic call to the smart contract.  
> The WebUI has four tabs, three of which are rendered dynamically based on the type of the current user.
