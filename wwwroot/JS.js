/*----------------------------------------------------------------------------HOME PAGE------------------------------------------------------------------------------------------- */
let tempVar = 0;
let arrayLUsers = [];
function hideForm() { // Function that hides login and sign in form on homepage
    document.getElementById('form').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
}
function showRegisterForm() { // Function that showes sign in form on homepage
    document.getElementById('form').style.display='block';
    document.getElementById('registrationForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
}
function showLoginForm() { // Function that showes login form on homepage
    document.getElementById('form').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registrationForm').style.display = 'none';
}
function getAllUsers() { // Function that gets all users and stores them in temp array
    fetch('api/Users/allUsers')
        .then(
            (allUsers) => {
                if (allUsers.status == 200) {
                    allUsers.json().then(
                        (array) => {
                            for (let i = 0; i < array.length; i++) { 
                                let user = array[i];
                                arrayLUsers[i] = array[i];
                            }
                        }
                    );
                } else {
                    console.log(allUsers.status);
                }
            }
        ).catch(
            (error) => { console.log('Error Code:', error); }
        );
}
function Login() { // Function that checks if all inputed data is correct 
    let email = document.getElementById('lemail').value;
    let password = document.getElementById('lpassword').value;
    let tempUser= 2;
    setTimeout(() => {

    for (let i = 0; i < arrayLUsers.length; i++) {
        if (email == arrayLUsers[i].email && password == arrayLUsers[i].passwordHash) {
            tempUser = arrayLUsers[i].roleId; // Storing userID temporarly for checking on what page will be directed
            sessionStorage.setItem('userName', arrayLUsers[i].firstName + ' ' + arrayLUsers[i].lastName); // Storing user in session storage for later pair checking
        }
    }
        if (tempUser == 1) { // Checking where will user be directed
            alert('Welcome Administrator!');
            window.open("AdminPage.html", "_self");
        } else if (tempUser == 0) { // Checking where will user be directed
            alert('Welcome User!');
            window.open("UserPage.html", "_self");
        }
        else { alert("Please enter correct Email and password."); }
    }, 50);
    document.getElementById('lemail').value = '';
}

function signIn() { // Function to add new user from homepage
    let NewUser = new Object();
    let alertShown = false; // Temp variable for popup messages
    document.getElementById("registerButton").addEventListener("click", function (event) { // Function that checks if we pressed submit button and check if passwords are correct
        var password = document.getElementById("password").value;
        var confirmPassword = document.getElementById("cpassword").value;
        if (password !== confirmPassword) { // Checks if passwords are same
            event.preventDefault();
            if (!alertShown) {
                alert("Passwords do not match!"); 
                alertShown = true;
            }
        } else if (password.length < 8) { // Checks if password length is lower than 8
            event.preventDefault(); 
            if (!alertShown) {
                alert("Password needs to be at least 8 characters."); 
                alertShown = true;
            }
        }
        else if (!alertShown) {
            NewUser.PasswordHash = document.getElementById("password").value;
            alert("Welcome " + NewUser.FirstName + " " + NewUser.LastName + " to Secret Santa!");
            window.open("UserPage.html", "_self");
            alertShown = true;
        }
    });
    alertShown = false;
    setTimeout(() => {
    NewUser.FirstName = document.getElementById("firstName").value;
    NewUser.LastName = document.getElementById("lastName").value;
    NewUser.Email = document.getElementById("email").value;
    NewUser.RoleId = 0;
    }, 100);
   saveNewUser(NewUser);
}
/*----------------------------------------------------------------------------USER PAGE------------------------------------------------------------------------------------------ */
let arrayPList = []; // Array that temporarly saves pairs
function getPair() { // Function that gets all pairs on user page and check if you have pair or not
    let tempReceiver = '';
    const tempUser = sessionStorage.getItem('userName');
    fetch('api/SecretSantaPairs/allPairs')
        .then(
            (allPairs) => {
                if (allPairs.status == 200) {
                    allPairs.json().then(
                        (array) => {
                            for (let i = 0; i < array.length; i++) { //parentObj of array) {
                                arrayPList[i] = array[i];
                                if (tempUser == arrayPList[i].giver) {
                                    tempReceiver = arrayPList[i].receiver;
                                    console.log('pronadjen');
                                    console.log(tempReceiver);
                                }
                            }
                            console.log(tempReceiver);
                            if (tempReceiver == '') {
                                document.getElementById('PairOut').innerHTML = "You didn't receive your pair yet!";
                            } else { document.getElementById('PairOut').innerHTML = "You are Secret Santa to: " + tempReceiver; }
                        }
                    );
                } else {
                    console.log(allUsers.status);
                }
            }
        ).catch(
            (error) => { console.log('Error Code:', error); }
    );
}
function Logout() { // Function to get to homepage
    window.open("index.html", "_self");
}

/*----------------------------------------------------------------------------ADMIN PAGE------------------------------------------------------------------------------------------ */
let arrayUsers = [];       // Array that stores users
let tempIdUser = -1;      // Variable that stores temporarly UserID
let temprole = -1;       // Variable that stores temporarly RoleID
let giversList = [];    // Array that temporarly saves users as givers
let recieverList = []; // Array that temporarly saves users as receivers

function addNewUser() // Function that makes new object and gets populated
{
    let NewUser = new Object();
    NewUser.FirstName = document.getElementById("firstName").value;
    NewUser.LastName = document.getElementById("lastName").value;
    NewUser.Email = document.getElementById("email").value;
    NewUser.PasswordHash = document.getElementById("password").value;
    NewUser.RoleId = document.getElementById("role").value;
   saveNewUser(NewUser);
}
function saveNewUser(NewUser) // Function that saves new user from admin page
{
    let ControllerAddress = 'api/Users/addUser';
    var stringJSON = JSON.stringify(NewUser);
    fetch(ControllerAddress, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: stringJSON
    })
        .then((response) => {
            if (response.status < 200 || response.status > 300) {
                console.log('Error Code:' + response.status);
                return;
            }
            response.json().then((data) => {
                console.log(data);
                window.location = "AdminPage.html";
            });
        }).catch((err) => { console.log('Fetch error ', err); });
}

function loadUsers() { //Function that loads all users from database and sends them to list on admin page
    setTimeout(() => {
        const uList = document.getElementById("userList");
        uList.innerHTML = ""; 
        fetch('api/Users/allUsers')
            .then(
                (allUsers) => {
                    if (allUsers.status == 200) {
                        allUsers.json().then(
                            (array) => {
                                for (let i = 0; i < array.length; i++) { 
                                    let user = array[i];
                                    arrayUsers[i] = giversList[i] = recieverList[i] =array[i];
                                    let listItem = document.createElement("li"); // Creating new list element with all user data
                                    listItem.innerHTML = `
                                        <strong>${user.firstName} ${user.lastName}</strong>

                                        &#x1F4E7;${user.email}    <br>  password:${user.passwordHash}
                                        <button onclick="searchUser(${user.idUser})" class='updatebttn'>Update</button>
                                        <button onclick="deleteUser(${user.idUser})">Delete</button>`;
                                    userList.appendChild(listItem);
                                }
                            }
                        );
                    } else {
                        console.log(allUsers.status);
                    }
                }
            ).catch(
                (error) => { console.log('Error Code:', error); }
            );
    }, 50);
    loadPairs();
}

function searchUser(userID) // Function that searches user with selected userID and shows data on admin page
{
    let ControllerAddress = "api/Users/searchUser/";
    ControllerAddress += userID;
    tempIdUser = userID;
    fetch(ControllerAddress, {})
        .then(
            (response) => {
                if (response.status !== 200) {
                    console.log('Error Code: ' + response.status);
                    return;
                }
                response.json().then((User) => {
                    with (document) {
                        document.getElementById("firstName").value = User.firstName;
                        document.getElementById("lastName").value = User.lastName;
                        document.getElementById("email").value = User.email;
                        document.getElementById("password").value = User.passwordHash;
                        document.getElementById("role").value = User.roleId;
                        document.getElementById("save-changes-button").style.display = "inline-block";
                    }
                });
            }
            )
.catch((error) => { console.log('Fetch error code ' + error); });
}
function saveChangedUser(userID) { // Function that we use after we altered user data 
    let updatedUser = new Object();
    updatedUser.IdUser = tempIdUser;
    updatedUser.FirstName = document.getElementById("firstName").value;
    updatedUser.LastName = document.getElementById("lastName").value;
    updatedUser.Email = document.getElementById("email").value;
    updatedUser.PasswordHash = document.getElementById("password").value;
    updatedUser.RoleId = document.getElementById("role").value;
    document.getElementById("save-changes-button").style.display = "none";
    updateUser(updatedUser);
    tempIdUser = -1;
}

function updateUser(updatedUser) // Function that saves altered user that we received
{
    let ControllerAddress = 'api/Users/updateUser';
    var stringJSON = JSON.stringify(updatedUser);
    fetch(ControllerAddress, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: stringJSON
    })
        .then((response) => {
            if (response.status < 200 || response.status > 300) {
                console.log('Error Code:' + response.status);
                return;
            }
            response.json().then((data) => {
                console.log(data);
                window.location = "AdminPage.html";
            });
        }).catch((err) => { console.log('Fetch error ', err); });
    clearInputFields()
}
function deleteUser(userID) // Function that deletes selected user
{
    let ControllerAddress = "api/Users/deleteUser/";
    ControllerAddress += userID;
    fetch(ControllerAddress, {
        method: 'DELETE'
    })
        .then(
            (response) => {
                if (response.status !== 200) {
                    console.log('Error code:' + response.status);
                    return;
                };
            }
        )
        .catch((error) => { console.log('Fetch error code ' + error); });
        arrayUsers = []; // Reseting temp variables
        tempIdUser = -1;
        giversList = [];
        recieverList = [];
        loadUsers();
}
function clearInputFields() { // Function that clears all input fields in Add Employee
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
    loadUsers();
    document.getElementById("secret-santa-pairs").value = "";
    loadPairs();
}
function shuffleArray(array) { // Function that shuffle array that was passed through
    for (let i = array.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }
    return array;
}
function generatePairs() { // Function where Secret santa pairs are generated
    const secretSantaList = document.getElementById("secret-santa-pairs");
    secretSantaList.innerHTML = "";
    
    let pairs = [];
    for (let l = 0; l < Math.floor(Math.random() * 10); l++) {
        recieverList = shuffleArray(recieverList);
    }
    let assignedReceivers = [];
    for (let i = 0; i < arrayUsers.length; i++) { // In this loop we are going through all users that are in database
       let  giver = giversList[i];
        let receiver = recieverList[i];
    
        while (giver.idUser === receiver.idUser || assignedReceivers.includes(receiver.idUser)) // In this loop we are going through all receivers until it is different from giver.
        {
            receiver = recieverList[Math.floor(Math.random() * recieverList.length)];
        }
        assignedReceivers.push(receiver.idUser);
        addPair(giver.idUser, receiver.idUser);
    }
    loadPairs();
}

function loadPairs() { // Function to load all pairs from database onto page 
    setTimeout(() => {
        const pList = document.getElementById("secret-santa-pairs");
        pList.innerHTML = "";
        fetch('api/SecretSantaPairs/allPairs')
            .then(
                (allPairs) => {
                    if (allPairs.status == 200) {
                        allPairs.json().then(
                            (array) => {
                                for (let i = 0; i < array.length; i++) { //parentObj of array) {
                                    let pair = array[i];
                                    let listItem = document.createElement("li");
                                    listItem.innerHTML = `
                                        Employee <strong>${pair.giver}</strong>  needs to buy present  <strong> ${ pair.receiver }</strong >`;
                                    pList.appendChild(listItem);
                                }
                            }
                        );
                    } else {
                        console.log(allUsers.status);
                    }
                }
            ).catch(
                (error) => { console.log('Error Code:', error); }
            );
    }, 100);
}
function addPair(gID, rID) { // Function to add pair to database that get passed through 2 values
    let ControllerAddress = "api/SecretSantaPairs/addPair/";
    ControllerAddress += gID + '/' + rID;
    fetch(ControllerAddress, {
        method: 'POST'
    })
        .then(
            (response) => {
                if (response.status !== 200) {
                    console.log('Error code:' + response.status);
                    return;
                };
            }
        )
        .catch((error) => { console.log('Fetch error code ' + error); });
}

function deleteAllPairs() // Function to delete all pairs that are in database
{
    let ControllerAddress = "api/SecretSantaPairs/deletePairs";
        fetch(ControllerAddress, {
            method: 'DELETE'
        })
            .then(
                (response) => {
                    if (response.status !== 200) {
                        console.log('Error code:' + response.status);
                        return;
                    };
                }
            )
        .catch((error) => { console.log('Fetch error code ' + error); });
    loadPairs();
}

