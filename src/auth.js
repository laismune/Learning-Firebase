/*const botaoAlerta = document.getElementById("btn-alerta")

botaoAlerta.addEventListener("click", (event) => {
  event.preventDefault();
  function alert () {
    swal.fire({
      icon:"success",
      title:"Bem vinda(o)!",
    })
  }
  alert()
}) */

function login() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut()
  }
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      swal.fire({
          icon: "success",
          title: "Login realizado com sucesso",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("home.html")
          }, 1000)
        })
    })
    .catch((error) => {
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/wrong-password":
          swal.fire({
            icon:"error",
            title: "Senha Inválida",
          })
          break;
        case "auth/invalid-email":
          swal.fire({
            icon:"error",
            title: "Email Inválido",
          })
          break;
        case "auth/user-not-found":
          swal.fire({
            icon:"warning",
            title: "Usuário Não Encontrado",
            text: "Deseja criar um usuário?",
            showCancelButton:true,
            cancelButtonText: "Não",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            confirmationButtonColor:"#3085d6",
          }).then((result) => {
            if(result.value) {
              signUp(email, password)
            }
          })
          break;
        default:
            swal.fire({
              icon:"error",
              title: "Erro",
            })
          break;
      } 
    })
}



function signUp(email, password){
  firebase
  .auth()
  .createUserWithEmailAndPassword(email, password)
  .then( ()=> {
    swal.fire({
      icon:"success",
      title:"Usuário criado com sucesso!",
    })
    .then ( () => {
      setTimeout( ()=> {
      window.location.replace("home.html")
    }, 1000)
    })
  }).catch((error) => {
      const errorCode = error.code;
      switch (errorCode) {
        case "auth/weak-password":
          swal.fire({
            incon:"error",
            title: "Senha muito fraca!",
          })
          break;
        default:
          swal.fire({
            icon:"error",
            title: error.message,
          })
          break;
    }
  })
}

const botaoLogin = document.getElementById("btn-login")
botaoLogin.addEventListener("click", (event) => {
  event.preventDefault();
  login()
})

function logout() {
  firebase.auth().signOut()
}

const gettingOut = document.getElementById("logOut")
gettingOut.addEventListener("click", (event) => {
  event.preventDefault();
  logout ()
})
