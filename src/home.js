let db = firebase.firestore()
let tasks = [];
let currentUser = {};

const toggleButton = document.getElementById("sidebar-toggle")
toggleButton.addEventListener("click", (event) => {
  event.preventDefault();
  const sideBar = document.getElementById("sidebar-div");
  sideBar.classList.toggle("show")
})

//Função pega se o usuário está autenticado:
//Pega o usuário que realizou alguma alteração:
function getUser () {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid
      readTasks()
      let userLabel = document.getElementById("navbarDropdown")
      userLabel.innerHTML = user.email
    } else {
      swal.fire({
        icon:"warning",
        title:"Redirecionando para a tela de autenticação."
      }).then(() => {
        setTimeout(() => {
          window.location.replace("index.html")
        }, 1000)
      })
    }
  })
}

function logout() {
  firebase.auth().signOut()
}

const gettingOut = document.getElementsByClassName("logOut")
for (const individual of gettingOut) {
  individual.addEventListener("click", (event) => {
    event.preventDefault();
    logout ();
  })
}

function createDelButton(task){
  const newButton = document.createElement("button")
  newButton.setAttribute("class", "btn btn-primary")
  newButton.setAttribute("id", "deleteTasksButton")
  newButton.appendChild(document.createTextNode("Excluir"))
  return newButton
}


function renderTasks () {
  let itemList = document.getElementById("itemList")
  itemList.innerHTML = ""
  for (let task of tasks) {
    const newItem = document.createElement("li")
    newItem.setAttribute("class", "list-group-item d-flex justify-content-between",)
    newItem.appendChild(document.createTextNode(task.title))
    const deleteButton = createDelButton(task)
    newItem.appendChild(deleteButton)
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      deleteTasks(task.id)
    })
    itemList.appendChild(newItem)
  }
}

async function readTasks () {
  tasks = []
  const logTasks = await db.collection("tasks").where("owner", "==", currentUser.uid).get()
  for (let doc of logTasks.docs) {
    tasks.push({id:doc.id, title: doc.data().title,
    })
  }
  renderTasks ()
}

async function addTasks () {
  const itemList = document.getElementById("itemList")
  const newItem = document.createElement("li")
  newItem.setAttribute("class", "list-group-item")
  newItem.appendChild(document.createTextNode("Adicionando na nuvem..."))
  itemList.appendChild(newItem)
  const title = document.getElementById("newItem").value
  await db.collection("tasks").add ({
    title:title,
    owner:currentUser.uid,
  })
  readTasks();
}

async function deleteTasks (id) {
  await db.collection("tasks").doc(id).delete()
  readTasks()

}

const addTaskButton = document.getElementById("addTasksButton")
addTaskButton.addEventListener("click", (event) => {
  event.preventDefault();
  addTasks();
})




window.onload = function (event) {
  event.preventDefault()
  getUser()
}



