var nameInput = document.getElementById("name-url");
var urlInput = document.getElementById("link-url");
var urlList = JSON.parse(localStorage.getItem("urlList")) || [];

console.log(urlList);
displayResults();
var editingId = null;
function generateId() {
  return crypto.randomUUID();
}

function addUrl(event) {
  event.preventDefault();
  var urlValue = urlInput.value.trim();
  var nameValue = nameInput.value.trim();

  // befor refactor
  // if (!regex.nameRegex.test(nameValue)) {
  //   Swal.fire({
  //     title: regex.messegeForNmae,
  //     icon: "error",
  //     draggable: true,
  //   });

  //   return;
  // }
  // if (!regex.urlRegex.test(urlValue))  {
  //   Swal.fire({
  //     title: regex.messegeForUrl,
  //     icon: "error",
  //     draggable: true,
  //   });

  //   return;
  // }

  if (showValidationError(regex.nameRegex, nameValue, regex.messegeForName))
    return;
  if (showValidationError(regex.urlRegex, urlValue, regex.messegeForUrl))
    return;

  var urlObject = {
    id: generateId(),
    name: nameInput.value,
    linkUrl: urlInput.value,
  };

  urlList.push(urlObject);
  localStorage.setItem("urlList", JSON.stringify(urlList));
  displayResults();
  console.log(urlList);
  resetInputs();
}

function resetInputs() {
  nameInput.value = "";
  urlInput.value = "";
  nameInput.classList.remove("is-valid", "is-invalid");
  urlInput.classList.remove("is-valid", "is-invalid");
}

function displayResults(list = urlList) {
  var content = document.getElementById("content");
  var messageContainer = document.getElementById("message");

  if (list.length === 0) {
    content.innerHTML = "";
    messageContainer.innerHTML =
      "<h3 class='messege text-center text-danger'>No saved bookmarks yet. Please add a new bookmark.</h3>";
  } else {
    messageContainer.innerHTML = "";
    var cartona = "";
    for (let i = 0; i < list.length; i++) {
      cartona += `
         <tr>
          <td>${i + 1}</td>
          <td class="bg-body-tertiary text-uppercase text-success fw-bold fst-italic ">${
            list[i].name
          }</td>
         
          <td>
                      <div class="d-flex align-items-center justify-content-between flex-wrap">

           <p class="url-info fw-bold fst-italic my-auto">${
             list[i].linkUrl.slice(0, 15) + " ..."
           }</p>
            <a href="${
              list[i].linkUrl
            }" class="btn btn-success d-flex align-items-center">
              <i class="bi bi-eye-fill"></i> Visit
            </a>
          </div>
          
           
          </td>
          <td>
           <div class="d-flex align-content-center justify-content-center gap-1 flex-wrap">
            <button onclick="fillInputsToUpdate('${
              list[i].id
            }')" class="btn btn-success p-1 p-lg-2">
              <i class="bi bi-pencil-square"></i> Update
            </button>
            <button onclick="deleteUrl('${
              list[i].id
            }')" class="btn btn-danger p-1 p-lg-2 ">
              <i class="bi bi-trash-fill"></i> Delete
            </button></div>
             
          </td>
        </tr>
        `;
    }
    document.getElementById("content").innerHTML = cartona;
  }
}
//validation

var regex = {
  urlRegex: /^(https?:\/\/)?(www\.)?[^\s]+\.[^\s]{2,}$/i,
  messegeForUrl: "Please enter a valid URL",
  nameRegex: /^[\p{L} ]{3,20}$/u,
  messegeForName: "Please enter a valid Name",
};

function showValidationError(regex, value, message) {
  if (!regex.test(value.trim())) {
    Swal.fire({
      title: message,
      icon: "error",
      draggable: true,
    });
    return true;
  }
  return false;
}
// befor refactor

// function isValid(regex, input) {
//   return regex.test(input);
// }
// function isValidUrl(url) {
//   var urlRegex =/^(https:\/\/|www\.)[^\s]+\.com$/;
//   return urlRegex.test(url);
// }
// function isValidName(name) {
//   var nameRegex = /^[\p{L} ]{4,20}$/;
//   return nameRegex.test(name.trim());
// }

function searchUrlsByName(searchText) {
  var lowerSearch = searchText.toLowerCase();

  var filtered = urlList.filter((item) =>
    item.name.toLowerCase().includes(lowerSearch)
  );

  displayResults((list = filtered));
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchUrlsByName(e.target.value);
});

function deleteUrl(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      urlList = urlList.filter((item) => item.id !== id);
      localStorage.setItem("urlList", JSON.stringify(urlList));
      displayResults();
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}
function fillInputsToUpdate(id) {
  var item = urlList.find((item) => item.id === id);
  if (item) {
    nameInput.value = item.name;
    urlInput.value = item.linkUrl;
    editingId = id;
  }
  document.getElementById("update").classList.remove("d-none");
  document.getElementById("addBtn").classList.add("d-none");
}

function updateUrl(event) {
  event.preventDefault();
  var urlValue = urlInput.value.trim();
  var nameValue = nameInput.value.trim();
  if (!editingId) return;

  // befor refactor
  // if (!isValid(regex.nameRegex, nameValue)) {
  //   Swal.fire({
  //     title: "Please enter a valid Name",
  //     icon: "error",
  //     draggable: true,
  //   });

  //   return;
  // }
  // if (!isValid(regex.urlRegex, urlValue)) {
  //   Swal.fire({
  //     title: "Please enter a valid URL starting with http://, https:// or www.",
  //     icon: "error",
  //     draggable: true,
  //   });

  //   return;
  // }
  if (showValidationError(regex.nameRegex, nameValue, regex.messegeForName))
    return;
  if (showValidationError(regex.urlRegex, urlValue, regex.messegeForUrl))
    return;

  var index = urlList.findIndex((item) => item.id === editingId);
  if (index !== -1) {
    urlList[index].name = nameInput.value.trim();
    urlList[index].linkUrl = urlValue;

    localStorage.setItem("urlList", JSON.stringify(urlList));
    displayResults();
    resetInputs();

    document.getElementById("update").classList.add("d-none");
    document.getElementById("addBtn").classList.remove("d-none");

    editingId = null;
  }
}

function updateValidationStyle(inputElement, regex) {
  var value = inputElement.value.trim();

  inputElement.classList.remove("is-valid", "is-invalid");

  if (value === "") return;
  if (regex.test(value)) {
    inputElement.classList.add("is-valid");
  } else {
    inputElement.classList.add("is-invalid");
  }
}
