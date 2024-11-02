const apiUrlWorks = "http://localhost:5678/api/works";
const apiUrltoken = "http://localhost:5678/api/users/login";
const apiUrlCategories = "http://localhost:5678/api/categories";
bearerToken = "";
let validUsername = "sophie.bluel@test.tld";
let validPassword = "S0phie";
fetch("http://localhost:5678/api/users/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "sophie.bluel@test.tld",
    password: "S0phie",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    bearerToken = data.token;
  })
  .catch((error) => console.error("Erreur:", error));

fetch(apiUrlWorks, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${bearerToken}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.text().then((text) => {
        throw new Error("Erreur du serveur : " + text);
      });
    }
  })
  .then((data) => {
    console.log(data);
    const container = document.getElementById("gallery");
    data.forEach((work) => {
      const workElement = document.createElement("figure");
      workElement.innerHTML = `
  <img src="${work.imageUrl}" alt="${work.title}" />
  <figcaption>${work.title}</figcaption>
  `;
      container.appendChild(workElement);
    });
  })
  .catch((error) => {
    console.error("erreur de la requete fetch : ", error);
  });

function createFilterBtn(categories) {
  const filterBar = document.getElementById("filterbar");

  const tousBtn = document.createElement("button");
  tousBtn.classList.add("filterBtn");
  const text = document.createElement("p");
  text.innerText = "Tous";
  tousBtn.addEventListener("click", () => filterWorks(null));
  tousBtn.appendChild(text);
  filterBar.appendChild(tousBtn);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add("filterBtn");
    const text = document.createElement("p");
    text.innerText = category.name;
    button.addEventListener("click", () => filterWorks(category.id));
    button.appendChild(text);
    filterBar.appendChild(button);
  });
}

function filterWorks(categoryId) {
  fetch(apiUrlWorks, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((works) => {
      const filteredWorks = categoryId
        ? works.filter((work) => work.categoryId === categoryId)
        : works;
      displayWorks(filteredWorks);
      console.log(filteredWorks);
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des œuvres :", error)
    );
}

function displayWorks(works) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  works.forEach((work) => {
    const workElement = document.createElement("figure");
    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `;
    gallery.appendChild(workElement);
  });
}



fetch(apiUrlCategories, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${bearerToken}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.text().then((text) => {
        throw new Error("Erreur du serveur : " + text);
      });
    }
  })

  .then((categories) => {
    createFilterBtn(categories);
    const buttons = document.querySelectorAll(".filterbar .filterBtn");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  })
  .catch((error) => {
    console.error("erreur de la requete fetch : ", error);
  });



function login() {
  const username = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;
  const errorMsg = document.getElementById("errorMsg");
  if (username === validUsername && password === validPassword) {
    window.location.href = "homepage-edit.html";
  } else {
    console.log("Identifiants incorrects");
    errorMsg.textContent = "E-mail ou mot de passe incorrect !";
    errorMsg.style.display = "flex";
  }
}

function displayWorksInModal() {
  fetch(apiUrlWorks, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then((text) => {
          throw new Error("Erreur du serveur : " + text);
        });
      }
    })
    .then((data) => {
      const modalWorksContainer = document.getElementById(
        "modalWorksContainer"
      );
      modalWorksContainer.innerHTML = "";

      data.forEach((work) => {
        const modalWorkElement = document.createElement("div");
        modalWorkElement.classList.add("modalImg");
        modalWorkElement.innerHTML = `
              <img id="${work.id}" src="${work.imageUrl}" alt="${work.title}">
              <button data-id="${work.id}" class="deleteButton">
                  <i class="fa-solid fa-trash fa-xs" style="color: #ffffff;"></i>
              </button>
          `;
        modalWorksContainer.appendChild(modalWorkElement);
      });

      document.querySelectorAll(".deleteButton").forEach((button) => {
        button.addEventListener("click", (event) => {
          const workId = event.currentTarget.getAttribute("data-id");
          deleteWork(workId);
        });
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des œuvres : ", error);
    });
}

function refreshMainGallery() {
  fetch(apiUrlWorks, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayWorks(data);
    })
    .catch((error) => {
      console.error("Erreur lors de la mise à jour de la galerie principale :", error);
    });
}

function deleteWork(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        displayWorksInModal();
        refreshMainGallery(); 
      } else {
        return response.text().then((text) => {
          throw new Error("Erreur lors de la suppression de l'œuvre : " + text);
        });
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'œuvre : ", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.querySelector(".modalContainer");
  const modalTriggers1 = document.querySelectorAll(".modalTrigger1");
  const addPhotoContainer = document.querySelector(".addPhotoContainer");
  const modalTriggers2 = document.querySelectorAll(".modalTrigger2");

  modalTriggers1.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      if (addPhotoContainer.classList.contains("active")) {
        toggleModal(addPhotoContainer);
      }
      toggleModal(modalContainer);
      displayWorksInModal();
    })
  );

  modalTriggers2.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      toggleModal(addPhotoContainer);
    })
  );

  function toggleModal(element) {
    if (element) {
      element.classList.toggle("active");
    } else {
      console.error("L'élément de la modale n'existe pas !");
    }
  }
});

fetch(apiUrlCategories, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${bearerToken}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.text().then((text) => {
        throw new Error("Erreur du serveur : " + text);
      });
    }
  })
  .then((categories) => {
    const categorySelector = document.querySelector(".formCategorySelect");
    const emptyCategory = document.createElement("option");
    emptyCategory.innerText = "";
    emptyCategory.value = "";
    categorySelector.appendChild(emptyCategory);

    categories.forEach((category) => {
      const newCategory = document.createElement("option");
      newCategory.innerText = `${category.name}`;
      newCategory.value = `${category.id}`;
      categorySelector.appendChild(newCategory);
    });
  })
  .catch((error) => {
    console.error("Erreur de la requête fetch : ", error);
  });




document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.querySelector(".modalContainer");
  const addPhotoContainer = document.querySelector(".addPhotoContainer");
  const photoInput = document.getElementById("photoInput");
  const photoTitleInput = document.getElementById("photoTitle");
  const photoCategorySelect = document.getElementById("photoCategory");
  const submitPhotoBtn = document.getElementById("submitPhotoBtn");
  const photoPreview = document.getElementById("photoPreview");
  const imageInputContent = document.getElementById("imageInputContent")

  photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
        imageInputContent.style.display = "none"
        
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.src = "";
      photoPreview.style.display = "none";
      imageInputContent.style.display = "flex"
    }
  });

  submitPhotoBtn.addEventListener("click", (event) => {
    const file = photoInput.files[0];
    if (!file) {
      console.error("Aucun fichier sélectionné !");
      return;
    }

    const formData = new FormData();
    formData.append("category", photoCategorySelect.value);
    formData.append("image", file);
    formData.append("title", photoTitleInput.value);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(`Erreur lors de l'envoi des données : ${errorText}`);
          });
        }
        return response.json();
      })
      .then((responseData) => {
        refreshMainGallery();
        photoInput.value = "";
        photoTitleInput.value = "";
        photoCategorySelect.selectedIndex = 0;
        imagePreview.style.display = "none";
        console.log("Fichier envoyé avec succès :", responseData);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi à l'API :", error);
      });
  });
});