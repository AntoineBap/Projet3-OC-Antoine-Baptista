async function getWorks(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const worksData = await response.json();
    return worksData;
  } catch (error) {
    console.error("Error fetching works:", error);
    return [];
  }
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
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const categoriesData = await response.json();
    return categoriesData;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
function createBtn(categories) {
  const filterBar = document.getElementById("filterbar");

  // bouton "Tous"
  const allBtn = document.createElement("button");
  allBtn.className = "filterBtn";
  allBtn.innerHTML = "<p>Tous</p>";
  filterBar.appendChild(allBtn);

  // Boutons pour chaque categorie
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
    
    // les boutons recuperent la classe '.active' a chaque clic pour recuperer les effets CSS assignes
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
    })
    });
  }

  async function getBearerToken(apiUrlLogin) {
    try {
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
  
      if (!response.ok) {
        throw new Error("Failed to fetch bearer token");
      }
  
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Error fetching bearer token:", error);
      return null;
    }
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
  try {
    const response = await fetch(`${apiUrlDelete}${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete work with ID: ${workId}`);
    }

    works = works.filter((work) => work.id !== parseInt(workId, 10));
    renderWorks(works);
    displayWorksInModal(works);
    reattachDeleteEventListeners(bearerToken, apiUrlDelete);
  } catch (error) {
    console.error("Error deleting work:", error);
  }
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
  const photoInput = document.getElementById("photoInput"); 
  const photoPreview = document.getElementById("photoPreview");
  const imageInputContent = document.getElementById("imageInputContent");

  photoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // Ajout de la photo dans l'input
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
  try {
    const photoInput = document.getElementById("photoInput");
    const photoTitleInput = document.getElementById("photoTitle");
    const photoCategorySelect = document.getElementById("photoCategory");

    const file = photoInput.files[0];
    if (!file) {
      throw new Error("No file selected");
    }

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

    if (!response.ok) {
      throw new Error("Failed to submit work");
    }

    const newWork = await response.json();
    works.push(newWork);
    renderWorks(works);
    displayWorksInModal(works);
    reattachDeleteEventListeners(bearerToken, apiUrlDelete);
    resetForm();
  } catch (error) {
    console.error("Error submitting work:", error);
  }
}

let works = []; // passage en global pour que les fonctions dynamiques puissent modifier directement la liste (delete, filter, submit)

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const baseUrl = "http://localhost:5678/api/";
    const apiUrlWorks = `${baseUrl}works`;
    const apiUrlCategories = `${baseUrl}categories`;
    const apiUrlLogin = `${baseUrl}users/login`;
    const apiUrlDelete = `${baseUrl}works/`;
    const apiUrlSend = `${baseUrl}works`;

    const bearerToken = await getBearerToken(apiUrlLogin);
    if (!bearerToken) {
      throw new Error("Bearer token is null. Cannot proceed.");
    }

    works = await getWorks(apiUrlWorks);
    renderWorks(works);

    const categories = await getCategories(apiUrlCategories);
    createBtn(categories);

    const filterBtns = document.querySelectorAll(".filterBtn");
    filterBtns.forEach((filterBtn) => {
      filterBtn.addEventListener("click", (event) => {
        try {
          filterClick(event, works);
          activeBtns(categories);
        } catch (error) {
          console.error("Error handling filter click:", error);
        }
      });
    });

    displayWorksInModal(works);
    modalTriggers();

    document.querySelectorAll(".deleteButton").forEach((button) => {
      button.addEventListener("click", (event) => {
        const workId = getButtonId(event);
        deleteWork(bearerToken, apiUrlDelete, workId);
      });
    });

    addPhotoCategorySelector(categories);
    addPhotoPreview();
    const submitPhotoBtn = document.getElementById("submitPhotoBtn");
    submitPhotoBtn.addEventListener("click", () => {
      submitWork(apiUrlSend, bearerToken, apiUrlDelete);
    });
  } catch (error) {
    console.error("Error initializing application:", error);
  }
});




