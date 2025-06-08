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

  if (!isValidUrl(urlValue)) {
    alert("Please enter a valid URL starting with http://, https:// or www.");
    return;
  }

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
          <td>${list[i].name}</td>
         
          <td>
                      <div class="d-flex align-content-center justify-content-between  flex-wrap">

           <p class="url-info">"${list[i].linkUrl.slice(0, 15) + " ..."}"</p>
            <a href="${list[i].linkUrl}" class="btn btn-success">
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

function isValidUrl(url) {
  const pattern = /^(https?:\/\/|www\.)/i;
  return pattern.test(url);
}

function searchUrlsByName(searchText) {
  const lowerSearch = searchText.toLowerCase();

  const filtered = urlList.filter((item) =>
    item.name.toLowerCase().includes(lowerSearch)
  );

  displayResults((list = filtered));
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchUrlsByName(e.target.value);
});

function deleteUrl(id) {
  urlList = urlList.filter((item) => item.id !== id);
  localStorage.setItem("urlList", JSON.stringify(urlList));
  displayResults();
}
function fillInputsToUpdate(id) {
  const item = urlList.find((item) => item.id === id);
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

  if (!editingId) return;

  const urlValue = urlInput.value.trim();

  if (!isValidUrl(urlValue)) {
    alert("Please enter a valid URL starting with http://, https:// or www.");
    return;
  }

  const index = urlList.findIndex((item) => item.id === editingId);
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
