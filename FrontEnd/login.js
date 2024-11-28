function login(event) {
  event.preventDefault(); // verifie le login / affiche errorMsg sans reload la page

  const username = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;
  const errorMsg = document.getElementById("errorMsg");
  
  if (username === "sophie.bluel@test.tld" && password === "S0phie") {
    window.location.href = "homepage-edit.html"; 
  } else {
    errorMsg.textContent = "E-mail ou mot de passe incorrect !";
    errorMsg.style.display = "flex";
  }
}

// verifie que le DOM est charge
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector(".loginForm");
  
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        login(event); //passer event en argument pour preventDefault
      });
  }
});
