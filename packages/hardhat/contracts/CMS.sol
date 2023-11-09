//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

error BMDC__NotAuthorized();
error BMDC__NotYourPatient();
error BMDC__NotAuthorizedForRemovalOfDataForSpecifiedId();
error BMDC__NonExistentIDProvided();
error BMDC__RequestedProfileNotFound();
error BMDC__RequestDoesNotExist();
error BMDC__RequestedProfileWasDeactivated();
error BMDC__SpecifiedOwnerIDIsNotRequestedDataOwner();
error BMDC__RequestNotMadeToYou();
error BMDC__ConsentNotFoundInTxSendersProfile();
error BMDC__TransactionSenderDoesNotHaveConsentsToRevoke();
error BMDC__ConsentAlreadyRevoked();
error BMDC__YouAreNotTheOwnerOfConsentForm();
error BMDC__ProcessorCanOnlySeeControllerProfiles();
error BMDC__InvalidUserRole();
error BMDC__CannotSeeProfilesOfOtherSubjects();
error BMDC__IncorrectProfileRole();
error BMDC__SubjectsCannotMakeRequests();
error BMDC__GetterNotAvailableToYourRole();
error BMDC__CannotMakeRequestToNonSubjects();
error BMDC__AddressAlreadyHasAProfile();
error BMDC__RequestNotMadeByYou();
error BMDC__NotAPartyInTheRequest();
error BMDC__NotOwnerNorAuthorized();

contract YourContract {
    /* Type declarations */
    struct Profile {
        uint256 userId;         
        address userAddress;   
        string fullName;
        address createdBy;      
        string role;           
        string institution;
        bool active;          
        uint256[] pendingRequests;  
        string[] ownedDatasets;     
        string[] accessibleDatasets;
    }

    struct Request{
        uint256 requestID;
        uint256 subjectID;
        uint256 processorID;
        string datasetID;
        bool resolved;
        string requestPurpose;
    }

    struct Consent{
        uint256 consentID;
        uint256 ownerID;
        address ownerAddress;
        string datasetID;
        uint256 consentRequestID;    // request ID which yielded the consent
        string consentPurpose;
        uint256 requesterID;
        bool valid;
    }

    /* State variables */ 
    mapping (uint256 => Profile) private allProfiles;
    mapping (address => Profile) private profilesByAddress;
    mapping (uint256 => Request) private allRequests;
    uint256[] private initAccessAray;
    string[] private initStrArray;
    uint256 private requestsCounter;
    uint256 private consentsCounter;
    uint256 private profilesCounter;
    mapping (address => Consent[]) private allConsents; // maps user address to list of all his consents
    mapping (string => string[]) private datasetsMetadata;

    /*Events*/
    event ProfileCreated(uint256 indexed userID, address indexed userAdress, string indexed role);
    event RequestForAccessMade(uint256 indexed requestID, uint256 indexed requesterID, string indexed datasetID);
    event DatasetAdded(string indexed datasetID, address indexed updatedBy);
    event DatasetDeleted(uint256 indexed profileID, address indexed updatedBy);
    event ProfileDeactivated(uint256 indexed profileID);
    event ConsentGranted(string indexed datasetID, uint256 indexed processorID, uint256 indexed requestID);
    event ConsentDenied(string indexed datasetID, uint256 indexed processorID, uint256 indexed requestID);
    event ConsentRevoked(string indexed datasetID, uint256 indexed processorID);

    /*Modifiers*/
    modifier onlyAuthorizedForCreation() {
        if (keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) != keccak256(abi.encodePacked("controller"))) {
            revert BMDC__NotAuthorized();
        }
        _;
    }

    modifier onlyAuthorizedForRemoval(uint256 _userID) {
        // only actor that created a profile and the owner of a profile can deactivate it
        if(msg.sender != allProfiles[_userID].createdBy && msg.sender != allProfiles[_userID].userAddress){revert BMDC__NotAuthorizedForRemovalOfDataForSpecifiedId();}
        _;
    }

    modifier onlyNonSubjects(){
        if(keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) == keccak256(abi.encodePacked("subject"))){revert BMDC__SubjectsCannotMakeRequests();}
        _;
    }

    modifier onlyOwnerOrAuthorized(string memory datasetID){
        // it will revert if dataset is not detected among owned/accessible datasets of function caller
        bool notAuthorized = true;
        
        if(keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) == keccak256(abi.encodePacked("subject"))){
            string [] memory tempOwnedDatasets = profilesByAddress[msg.sender].ownedDatasets;
            for(uint256 i=0; i<tempOwnedDatasets.length; i++){
                if(keccak256(abi.encodePacked(tempOwnedDatasets[i])) == keccak256(abi.encodePacked(datasetID))){
                    notAuthorized=false;
                    break;
                }
            }
        }
        else if(keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) == keccak256(abi.encodePacked("processor"))){
            string [] memory tempAccessible = profilesByAddress[msg.sender].accessibleDatasets;
            for(uint256 i=0; i<tempAccessible.length; i++){
                if(keccak256(abi.encodePacked(tempAccessible[i])) == keccak256(abi.encodePacked(datasetID))){
                    notAuthorized=false;
                    break;
                }
            }

        }
        else if(keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) == keccak256(abi.encodePacked("controller"))){
            string [] memory tempControlledDatasets = profilesByAddress[msg.sender].ownedDatasets;
            string [] memory tempAccessibleDatasets = profilesByAddress[msg.sender].accessibleDatasets;
            for(uint256 i=0; i<tempControlledDatasets.length; i++){
                if(keccak256(abi.encodePacked(tempControlledDatasets[i])) == keccak256(abi.encodePacked(datasetID))){
                    notAuthorized=false;
                    break;
                }
            }
            for(uint256 i=0; i<tempAccessibleDatasets.length; i++){
                if(keccak256(abi.encodePacked(tempAccessibleDatasets[i])) == keccak256(abi.encodePacked(datasetID))){
                    notAuthorized=false;
                    break;
                }
            }
        }

        // checking if notAuthorized was ever disproved
        if(notAuthorized){revert BMDC__NotOwnerNorAuthorized();}
        _;
    }

    /*Functions*/


    constructor(string memory _name, string memory _role, string memory _institution) {
        initAccessAray.push(0);
        initStrArray.push("");
        requestsCounter = 0;
        consentsCounter = 0;
        profilesCounter = 1;
        

        // creating the first profile of controller
        Profile memory newProfile = Profile({
            userId: profilesCounter,
            userAddress: msg.sender,
            fullName: _name,
            createdBy: msg.sender,
            role: _role,
            institution: _institution,
            active: true,
            pendingRequests: initAccessAray,
            ownedDatasets: initStrArray,
            accessibleDatasets: initStrArray
        });
        
        allProfiles[profilesCounter]=newProfile;
        profilesByAddress[msg.sender]=newProfile;
        emit ProfileCreated(profilesCounter, msg.sender, _role);
    }


    function createProfile(
        address _userAddress,
        string memory _fullName,
        string memory _role,
        string memory _institution
    ) public onlyAuthorizedForCreation {
        // only acceot valid roles
        if(keccak256(abi.encodePacked(_role))!=keccak256(abi.encodePacked("subject")) && 
        keccak256(abi.encodePacked(_role))!=keccak256(abi.encodePacked("controller")) && 
        keccak256(abi.encodePacked(_role))!=keccak256(abi.encodePacked("processor"))){revert BMDC__InvalidUserRole();}
        if(profilesByAddress[_userAddress].userId != 0){revert BMDC__AddressAlreadyHasAProfile();}
        uint256 profileID = profilesCounter+1;  
        profilesCounter++; 
        
        // creates a variable with profile info
        Profile memory newProfile = Profile({
            userId: profileID,
            userAddress: _userAddress,
            fullName: _fullName,
            createdBy: msg.sender,
            role: _role,
            institution: _institution,
            active: true,
            pendingRequests: initAccessAray,
            ownedDatasets: initStrArray,
            accessibleDatasets: initStrArray
        });

        // pushes the variable as an element into the profiles list
        allProfiles[profileID]=newProfile;
        profilesByAddress[_userAddress]=newProfile;
        emit ProfileCreated(profileID, _userAddress, _role);
        
    }

    function addDataset(uint256 _userID, 
        string memory _datasetID,
        string memory _ipfsHash,
        string memory _ext) public onlyAuthorizedForCreation {

        if(allProfiles[_userID].createdBy != msg.sender){revert BMDC__NotYourPatient();}

        // adding to data owner's profile
        allProfiles[_userID].ownedDatasets.push(_datasetID);
        profilesByAddress[allProfiles[_userID].userAddress].ownedDatasets.push(_datasetID);

        // adding to profile of controller calling the function
        allProfiles[profilesByAddress[msg.sender].userId].ownedDatasets.push(_datasetID);
        profilesByAddress[msg.sender].ownedDatasets.push(_datasetID);
        
        //adding the dataset to the mappings
        string [2] memory metadata = [_ipfsHash, _ext];
        datasetsMetadata[_datasetID]= metadata;

        emit DatasetAdded(_datasetID, msg.sender);


    }

    function deleteDataset(
        uint256 _userID, 
        string memory _datasetID
    ) public onlyAuthorizedForRemoval(_userID){

        // deleting it from the data owner's profile
        string[] memory datasets = allProfiles[_userID].ownedDatasets;
        for(uint256 i=0; i<datasets.length; i++){
            if(keccak256(abi.encodePacked(datasets[i]))==keccak256(abi.encodePacked(_datasetID))){
                delete allProfiles[_userID].ownedDatasets[i];
                delete profilesByAddress[allProfiles[_userID].userAddress].ownedDatasets[i];
            }
        }

        // deleting it from the profile of the data controller who added it
        address operator = allProfiles[_userID].createdBy;
        string[] memory allDatasets = profilesByAddress[operator].ownedDatasets;
        for(uint256 i=0; i<allDatasets.length; i++){
            if(keccak256(abi.encodePacked(allDatasets[i]))==keccak256(abi.encodePacked(_datasetID))){
                delete profilesByAddress[operator].ownedDatasets[i];
                delete allProfiles[profilesByAddress[operator].userId].ownedDatasets[i];
            }
        }

        // deleting the dataset and ipfs CID from the mapping
        delete datasetsMetadata[_datasetID];
    }

    function deactivateProfile (uint256 _userId) public onlyAuthorizedForRemoval(_userId) {
        address profileAddress = allProfiles[_userId].userAddress;

        // deleting all datasets and revoking all consents if the deleted profile is a patient
        if(keccak256(abi.encodePacked(allProfiles[_userId].role)) == keccak256(abi.encodePacked("subject"))){
            string[] memory usersDatasets = allProfiles[_userId].ownedDatasets;
            for(uint256 i=0; i<usersDatasets.length; i++){
                delete datasetsMetadata[usersDatasets[i]];
            }
            for(uint256 i=0; i<allConsents[profileAddress].length; i++){
                allConsents[profileAddress][i].valid=false;
            }
        }

        // deleting all data about the users which could possibly identify him/her
        // edit the allProfiles mapping
        delete allProfiles[_userId].fullName;
        delete allProfiles[_userId].createdBy;
        delete allProfiles[_userId].role;
        delete allProfiles[_userId].institution;
        delete allProfiles[_userId].pendingRequests;
        delete allProfiles[_userId].ownedDatasets;
        delete allProfiles[_userId].accessibleDatasets;
        allProfiles[_userId].active = false;
                
        // edit the profilesByAddress mapping
        delete profilesByAddress[profileAddress].fullName;
        delete profilesByAddress[profileAddress].createdBy;
        delete profilesByAddress[profileAddress].role;
        delete profilesByAddress[profileAddress].institution;
        delete profilesByAddress[profileAddress].pendingRequests;
        delete profilesByAddress[profileAddress].ownedDatasets;
        delete profilesByAddress[profileAddress].accessibleDatasets;
        profilesByAddress[profileAddress].active = false;

        // emiting an event
        emit ProfileDeactivated(_userId);
    }

    function requestAccess(uint256 _dataOwnerId, string memory _datasetID, string memory _requestPurpose) public onlyNonSubjects{
        if(allProfiles[_dataOwnerId].userId == 0){revert BMDC__RequestedProfileNotFound();}
        if(!allProfiles[_dataOwnerId].active){revert BMDC__RequestedProfileWasDeactivated();}    // you cannot make requests to deactivated profiles 
        if(keccak256(abi.encodePacked(allProfiles[_dataOwnerId].role))!=keccak256(abi.encodePacked("subject"))){revert BMDC__CannotMakeRequestToNonSubjects();}
        // checking if specified user is owner of data
        string[] memory dataOwnerownedDatasets = allProfiles[_dataOwnerId].ownedDatasets;
        bool datasetFound = false;
        for (uint256 i=0; i<dataOwnerownedDatasets.length; i++){
            //string memory currentDataID = dataOwnerownedDatasets[i];
            if(keccak256(abi.encodePacked(dataOwnerownedDatasets[i])) == keccak256(abi.encodePacked(_datasetID))){
                datasetFound = true;
            }
        }
        if(!datasetFound){revert BMDC__SpecifiedOwnerIDIsNotRequestedDataOwner();}

        uint256 currentRequestID = requestsCounter +1;
        uint256 requesterID = profilesByAddress[msg.sender].userId;

        Request memory newRequest = Request({
            requestID: currentRequestID,
            subjectID: _dataOwnerId,
            processorID: requesterID,
            datasetID: _datasetID,
            resolved: false,
            requestPurpose: _requestPurpose
        });

        // updating pending requests propery of data owner's profile
        allProfiles[_dataOwnerId].pendingRequests.push(currentRequestID);
        profilesByAddress[allProfiles[_dataOwnerId].userAddress].pendingRequests.push(currentRequestID);

        // updating pending requests propery of data processor's profile
        profilesByAddress[msg.sender].pendingRequests.push(currentRequestID);
        allProfiles[requesterID].pendingRequests.push(currentRequestID);
        
        // saving the request in the mapping of all requests
        allRequests[currentRequestID] = newRequest;
        requestsCounter++;

        emit RequestForAccessMade(currentRequestID, requesterID, _datasetID);
    }

    function acceptConsentRequest(uint256 _requestID) public {
        if(_requestID > requestsCounter){revert BMDC__RequestDoesNotExist();}    // raise error for nonexistent requests ID
        if(allRequests[_requestID].subjectID != profilesByAddress[msg.sender].userId){revert BMDC__RequestNotMadeToYou();}   // raise error if an unouthorized user tries to resolve a request
        
        uint256 requesterID = allRequests[_requestID].processorID;
        uint256 ownerId = allRequests[_requestID].subjectID;

        // change corresponding request's 'resolved' field to true
        allRequests[_requestID].resolved = true;

        //create new consent object and append it to a mapping of all consents
        Consent memory newConsent = Consent({
            ownerID: profilesByAddress[msg.sender].userId,
            ownerAddress: msg.sender,
            datasetID: allRequests[_requestID].datasetID,
            consentID: consentsCounter + 1,
            consentRequestID: _requestID,
            consentPurpose: allRequests[_requestID].requestPurpose,
            requesterID: allRequests[_requestID].processorID,
            valid: true
        });

        // increment consentCounter
        consentsCounter++;

        allConsents[msg.sender].push(newConsent); // update the list of consents made by the data owner

        // update 'pendingRequests' property of data owner (delete the request being resolved)
        for(uint256 i=0; i<allProfiles[ownerId].pendingRequests.length; i++){
            if(allProfiles[ownerId].pendingRequests[i]==_requestID){
                delete profilesByAddress[msg.sender].pendingRequests[i];
                delete allProfiles[ownerId].pendingRequests[i];
            }
        }
        // update 'pendingRequests' property of data processor (delete the request being resolved)
        for(uint256 j=0; j < allProfiles[requesterID].pendingRequests.length; j++){
            if(allProfiles[requesterID].pendingRequests[j]==_requestID){
                delete allProfiles[requesterID].pendingRequests[j];
                delete profilesByAddress[allProfiles[requesterID].userAddress].pendingRequests[j];
            }
        }

        // update 'accessibleDatasets' property of processor (add the datasetID of the request being given)
        allProfiles[allRequests[_requestID].processorID].accessibleDatasets.push(allRequests[_requestID].datasetID);
        profilesByAddress[allProfiles[requesterID].userAddress].accessibleDatasets.push(allRequests[_requestID].datasetID);
        
        // emit event of granting consent
        emit ConsentGranted(allRequests[_requestID].datasetID, allRequests[_requestID].processorID, _requestID);
    }

    function denyConsent(uint256 _requestID) public {
        if(_requestID > requestsCounter){revert BMDC__RequestDoesNotExist();}    // raise error for nonexistent requests ID
        if(allRequests[_requestID].subjectID != profilesByAddress[msg.sender].userId){revert BMDC__RequestNotMadeToYou();}   // raise error if an unouthorized user tries to resolve a request
        
        uint256 requesterID = allRequests[_requestID].processorID;
        uint256 ownerID = allRequests[_requestID].subjectID;

        // should change corresponding request's 'resolved' field to true
        allRequests[_requestID].resolved = true;

        // update 'pendingRequests' property of data owner (delete the request being resolved)
        for(uint256 i=0; i<allProfiles[ownerID].pendingRequests.length; i++){
            if(allProfiles[ownerID].pendingRequests[i]==_requestID){
                delete profilesByAddress[msg.sender].pendingRequests[i];
                delete allProfiles[ownerID].pendingRequests[i];
                }
        }
        // update 'pendingRequests' property of data processor (delete the request being resolved)
        for(uint256 j=0; j < allProfiles[requesterID].pendingRequests.length; j++){
            if(allProfiles[requesterID].pendingRequests[j]==_requestID){
                delete allProfiles[requesterID].pendingRequests[j];
                delete profilesByAddress[allProfiles[requesterID].userAddress].pendingRequests[j];
            }
        }
        // emit event of denying consent
        emit ConsentDenied(allRequests[_requestID].datasetID, allRequests[_requestID].processorID, _requestID);
    }

    function revokeConsent(uint256 _consentID) public {
        if(allConsents[msg.sender].length == 0){revert BMDC__TransactionSenderDoesNotHaveConsentsToRevoke();}
    
        // get the consent object out of the mapping of consents
        string memory datasetToRestrict;
        Consent memory consentInQuestion;
        uint256 consentToRevokeIndex;
        uint256 processorID;
        address consentOwnerAddress;
        Consent[] memory allUsersConsents = allConsents[msg.sender];
        
        bool consentFound = false;
        for (uint i=0; i < allUsersConsents.length; i++){
            if(allUsersConsents[i].consentID == _consentID){
                consentInQuestion = allUsersConsents[i];
                datasetToRestrict = consentInQuestion.datasetID;
                processorID = consentInQuestion.requesterID;
                consentToRevokeIndex = i;
                consentFound = true;
                consentOwnerAddress = consentInQuestion.ownerAddress;
            }
        }
        if(!consentFound){revert BMDC__ConsentNotFoundInTxSendersProfile();}
        if(consentInQuestion.valid == false){revert BMDC__ConsentAlreadyRevoked();}
        if(consentOwnerAddress != msg.sender){revert BMDC__YouAreNotTheOwnerOfConsentForm();}
        
        // update 'valid' property of appropriate consent object to false 
        allConsents[msg.sender][consentToRevokeIndex].valid = false;

        // remove dataset in question for 'accessibleDatasets' of processor in question
        for(uint j=0; j <allProfiles[processorID].accessibleDatasets.length; j++){
            string memory currentElem = allProfiles[processorID].accessibleDatasets[j];
            if(keccak256(abi.encodePacked(datasetToRestrict))==keccak256(abi.encodePacked(currentElem))){
                    delete allProfiles[processorID].accessibleDatasets[j];
                    delete profilesByAddress[allProfiles[processorID].userAddress].accessibleDatasets[j];
            }
        }
        // emit event of revoking consent
        emit ConsentRevoked(datasetToRestrict, processorID);
    }

    /* View functions */
    function getProfile(uint256 _userID) public view returns(Profile memory) {
        if(_userID > profilesCounter){revert BMDC__NonExistentIDProvided();}
        if (keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) != keccak256(abi.encodePacked("controller"))){revert BMDC__GetterNotAvailableToYourRole();}
        return allProfiles[_userID];
        }

    function getRequest(uint256 _requestID) public view returns (uint256, uint256, uint256, string memory, bool, string memory){
        if(_requestID > requestsCounter){revert BMDC__RequestDoesNotExist();}
        if(!(allRequests[_requestID].subjectID == profilesByAddress[msg.sender].userId || allRequests[_requestID].processorID == profilesByAddress[msg.sender].userId)){revert BMDC__NotAPartyInTheRequest();}
        return (allRequests[_requestID].requestID,
        allRequests[_requestID].subjectID,
        allRequests[_requestID].processorID,
        allRequests[_requestID].datasetID,
        allRequests[_requestID].resolved,
        allRequests[_requestID].requestPurpose);
    }


    function getConsentForms() public view returns(Consent[] memory){
        return allConsents[msg.sender];
    }

    function getDataset(string memory _datasetID) public view onlyOwnerOrAuthorized(_datasetID) returns (string memory, string memory){
        if(datasetsMetadata[_datasetID].length == 0){
            return("","");
        }
        return (datasetsMetadata[_datasetID][0], datasetsMetadata[_datasetID][1]);
    }

    function initProfile() public view returns(uint256, address, string memory, address, string memory, string memory ,bool, uint256[] memory, string[]memory, string[]memory) {
        return (profilesByAddress[msg.sender].userId, 
        profilesByAddress[msg.sender].userAddress, 
        profilesByAddress[msg.sender].fullName, 
        profilesByAddress[msg.sender].createdBy,
        profilesByAddress[msg.sender].role,
        profilesByAddress[msg.sender].institution,
        profilesByAddress[msg.sender].active,
        profilesByAddress[msg.sender].pendingRequests,
        profilesByAddress[msg.sender].ownedDatasets,
        profilesByAddress[msg.sender].accessibleDatasets);
    }

    function getProfileToSubj(uint256 _profileID) public view returns(uint256, address, string memory, string memory, bool, string memory){
        if(_profileID > profilesCounter){revert BMDC__NonExistentIDProvided();}
        if (keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) != keccak256(abi.encodePacked("subject"))){revert BMDC__GetterNotAvailableToYourRole();}
        if (keccak256(abi.encodePacked(allProfiles[_profileID].role)) == keccak256(abi.encodePacked("subject"))){revert BMDC__CannotSeeProfilesOfOtherSubjects();}
        return (allProfiles[_profileID].userId,
        allProfiles[_profileID].userAddress,
        allProfiles[_profileID].fullName,
        allProfiles[_profileID].role,
        allProfiles[_profileID].active,
        allProfiles[_profileID].institution);
    }

    function getProfileToProcessor(uint256 _profileID) public view returns(uint256, address, string memory, string memory, bool, string[] memory, string memory){
        if(_profileID > profilesCounter){revert BMDC__NonExistentIDProvided();}
        if (keccak256(abi.encodePacked(profilesByAddress[msg.sender].role)) != keccak256(abi.encodePacked("processor"))){revert BMDC__GetterNotAvailableToYourRole();}
        if (keccak256(abi.encodePacked(allProfiles[_profileID].role)) != keccak256(abi.encodePacked("controller"))){revert BMDC__ProcessorCanOnlySeeControllerProfiles();}
        return (allProfiles[_profileID].userId,
        allProfiles[_profileID].userAddress,
        allProfiles[_profileID].fullName,
        allProfiles[_profileID].role,
        allProfiles[_profileID].active,
        allProfiles[_profileID].ownedDatasets,
        allProfiles[_profileID].institution);
    }
}