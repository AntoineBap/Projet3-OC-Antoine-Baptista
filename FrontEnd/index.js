async function getWorks(apiUrl) {
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
``
  const worksData = await response.json();
  return worksData;
}

function renderWorks(worksData) {
  const container = document.getElementById("gallery");

  container.innerHTML = ""; // vide la galerie avant de la remplir
  worksData.forEach((work) => {
    const workElement = document.createElement("figure");
    workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}" />
      <figcaption>${work.title}</figcaption>
    `;
    container.appendChild(workElement);
  });
}

async function getCategories(apiUrl) {
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
``
  const categoriesData = await response.json();
  return categoriesData;
}


function createBtn(categories) {
  const filterBar = document.getElementById("filterbar");

  // bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.className = "filterBtn";
  allBtn.innerHTML = "<p>Tous</p>";
  filterBar.appendChild(allBtn);

  // Boutons pour chaque catégorie
  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.className = "filterBtn";
    btn.dataset.categoryId = category.id;
    btn.innerHTML = `<p>${category.name}</p>`;
    filterBar.appendChild(btn);
  });
}

function filterClick(event, works) {
  const categoryId = event.target.closest(".filterBtn").dataset.categoryId;
  filterWorks(categoryId, works); // Appelle filterWorks avec l'ID
}

function filterWorks(categoryId, works) {
  const allWorks = [...works]
  const filteredWorks = categoryId
        ? allWorks.filter((work) => work.categoryId === parseInt(categoryId, 10)) // dataset renvoie une string donc parseInt convertis en int
        : allWorks; 

      // fonction pour afficher les works
      renderWorks(filteredWorks);
}

function activeBtns(categories){
  const buttons = document.querySelectorAll(".filterbar .filterBtn");
    
    // les boutons recuperent la classe '.active' a chaque clic pour recuperer les effets CSS assignés
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
    })
    });
  }

async function getBearerToken(apiUrlLogin) {
    const response = await fetch(apiUrlLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "sophie.bluel@test.tld",
        password: "S0phie",
      }),
    });

    const data = await response.json();
    const bearerToken = data.token;
    return bearerToken;
}


function displayWorksInModal(works) {
  const modalWorksContainer = document.getElementById("modalWorksContainer");
  
  modalWorksContainer.innerHTML = ""
  works.forEach((work) => {
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

}


function toggleModal(element) {
  if (element) {
    element.classList.toggle("active");
  } 
}

function modalTriggers(){
  const modalContainer = document.querySelector(".modalContainer");
  const modalTriggers1 = document.querySelectorAll(".modalTrigger1");
  const addPhotoContainer = document.querySelector(".addPhotoContainer");
  const modalTriggers2 = document.querySelectorAll(".modalTrigger2");
  const form = document.querySelector('.modalFormContainer')

  modalTriggers1.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      // si on veut faire page 2 => page 1, desactive la page 2 en premier lieu
      if (addPhotoContainer.classList.contains("active")) {
        toggleModal(addPhotoContainer);
      }
      toggleModal(modalContainer);
    })
  );

  // affiche la page 2
  modalTriggers2.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      toggleModal(addPhotoContainer);
    })
  );
}

function getButtonId(event) {
  const clickedButton = event.currentTarget;
  const buttonId = clickedButton.dataset.id;
  return buttonId
}

// selectionne tous les boutons delete et leur re-attache l'event listener
function reattachDeleteEventListeners(bearerToken, apiUrlDelete) {
  document.querySelectorAll('.deleteButton').forEach(button => {
    button.addEventListener('click', (event) => {
      const workId = getButtonId(event);
      deleteWork(bearerToken, apiUrlDelete, workId);
    });
  });
}

async function deleteWork(bearerToken, apiUrlDelete, workId) {
  const response = await fetch(`${apiUrlDelete}${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  works = works.filter(work => work.id !== parseInt(workId, 10)); //supprime le work
  
  renderWorks(works);
  displayWorksInModal(works);// actualise la gallery et la modale
  
  reattachDeleteEventListeners(bearerToken, apiUrlDelete); // re-attache les eventListener delete
}

function addPhotoCategorySelector(categories){
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
}

function addPhotoPreview() {
  const photoInput = document.getElementById("photoInput"); // Définition de photoInput
  const photoPreview = document.getElementById("photoPreview");
  const imageInputContent = document.getElementById("imageInputContent");

  photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    console.log(file); // Pour vérifier si le fichier est bien récupéré

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // Ajout de la photo dans l'input dédié 
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
        imageInputContent.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      photoPreview.src = "";
      photoPreview.style.display = "none";
      imageInputContent.style.display = "flex";
    }
  });
}


function resetForm() {
  const modalTriggers1 = document.querySelectorAll(".modalTrigger1");
  const form = document.getElementById("modalAddPhotoContainer");

  modalTriggers1.forEach((trigger) =>
    trigger.addEventListener("click", () => {
      if (form) {
        form.reset(); // reset les champs title et categories
        
        // reset la photo
        const photoPreview = document.getElementById("photoPreview");
        const imageInputContent = document.getElementById("imageInputContent");
        const photoInput = document.getElementById("photoInput");

        if (photoPreview) {
          photoPreview.src = "";
          photoPreview.style.display = "none";
        }

        if (imageInputContent) {
          imageInputContent.style.display = "flex"; // re-affiche l'uploader
        }

        if (photoInput) {
          photoInput.value = ""; // reset l'input
        }
      }
    })
  );
}

async function submitWork(apiUrl, bearerToken, apiUrlDelete) {
  const photoInput = document.getElementById("photoInput");
  const photoTitleInput = document.getElementById("photoTitle");
  const photoCategorySelect = document.getElementById("photoCategory");

  const file = photoInput.files[0]; // récupère l'image

  const formData = new FormData();
  formData.append("category", photoCategorySelect.value);
  formData.append("image", file);
  formData.append("title", photoTitleInput.value);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    body: formData,
  });

  const newWork = await response.json();// recupere la data du nouveau work
  works.push(newWork);// ajoute le nv work a la liste 
  renderWorks(works);// refresh la gallery
  displayWorksInModal(works)
  reattachDeleteEventListeners(bearerToken, apiUrlDelete)// permet de pouvoir delete un work apres un update sans avoir a F5
  resetForm();
}

let works = []; // passage en global pour que les fonctions dynamiques puissent modifier directement la liste (delete, filter, submit)

document.addEventListener("DOMContentLoaded", async () => {
  
  const baseUrl = "http://localhost:5678/api/";
  const apiUrlWorks = `${baseUrl}works`;
  const apiUrlCategories = `${baseUrl}categories`;
  const apiUrlLogin = `${baseUrl}users/login`;
  const apiUrlDelete = `${baseUrl}works/`;
  const apiUrlSend = `${baseUrl}works`

    const bearerToken = await getBearerToken(apiUrlLogin);
    works = await getWorks(apiUrlWorks); // Stocke la liste des œuvres dans la variable globale
    renderWorks(works);

    const categories = await getCategories(apiUrlCategories);
    createBtn(categories);

    const filterBtns = document.querySelectorAll('.filterBtn');
    filterBtns.forEach(filterBtn => {
      filterBtn.addEventListener("click", (event) => {
        filterClick(event, works);
        activeBtns(categories);
      });
    });

    displayWorksInModal(works);
    modalTriggers();

    document.querySelectorAll('.deleteButton').forEach(button => {
      button.addEventListener('click', (event) => {
        const workId = getButtonId(event);
        deleteWork(bearerToken, apiUrlDelete, workId);
      });
    });

    addPhotoCategorySelector(categories);
    addPhotoPreview()
    const submitPhotoBtn = document.getElementById("submitPhotoBtn");
    submitPhotoBtn.addEventListener("click", () => {
      submitWork(apiUrlSend, bearerToken, apiUrlDelete);
    });

});


