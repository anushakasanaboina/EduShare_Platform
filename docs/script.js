// Tab functionality
["account", "upload", "tutorial", "research", "resources"].forEach(tab => {
  document.getElementById(`${tab}Tab`).addEventListener("click", () => {
    setActiveTab(`${tab}Tab`);
    switchToDashboard(`${tab}Dashboard`);

    // Load resources every time 'View Resources' tab is clicked
    if (tab === "resources") {
      loadResources();
    }
  });
});

function setActiveTab(id) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function switchToDashboard(id) {
  document.querySelectorAll(".dashboard-container").forEach(d => d.classList.remove("active-dashboard"));
  document.getElementById(id).classList.add("active-dashboard");
}

// User login handler
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  if (username) {
    localStorage.setItem("userAddress", username);
    document.getElementById("userAddress").innerText = username;
    setActiveTab("resourcesTab");
    switchToDashboard("viewDashboard");
    loadResources();
  } else {
    alert("Please enter a valid username.");
  }
});

// Upload Resource
document.getElementById("uploadForm").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const ipfsHash = document.getElementById("ipfsHash").value.trim();
  const uploader = localStorage.getItem("userAddress");

  if (title && description && ipfsHash && uploader) {
    saveResource({ type: "resource", title, description, ipfsHash, uploader });
    alert("Resource uploaded!");
    loadResources();
    clearForm();
  } else {
    alert("Please fill in all fields and log in.");
  }
});

// Share Tutorial
document.getElementById("tutorialForm").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("tutorialTitle").value.trim();
  const description = document.getElementById("tutorialDescription").value.trim();
  const link = document.getElementById("tutorialLink").value.trim();
  const uploader = localStorage.getItem("userAddress");

  if (title && description && link && uploader) {
    saveResource({ type: "tutorial", title, description, link, uploader });
    alert("Tutorial shared!");
    loadResources();
    clearForm();
  } else {
    alert("Please fill in all fields and log in.");
  }
});

// Share Research Article
document.getElementById("researchForm").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("researchTitle").value.trim();
  const description = document.getElementById("researchDescription").value.trim();
  const link = document.getElementById("researchLink").value.trim();
  const uploader = localStorage.getItem("userAddress");

  if (title && description && link && uploader) {
    saveResource({ type: "research", title, description, link, uploader });
    alert("Research article shared!");
    loadResources();
    clearForm();
  } else {
    alert("Please fill in all fields and log in.");
  }
});

// Save resource to localStorage
function saveResource(resource) {
  const existing = JSON.parse(localStorage.getItem("resources")) || [];
  existing.push(resource);
  localStorage.setItem("resources", JSON.stringify(existing));
}

// Load resources and display
function loadResources() {
  const resources = JSON.parse(localStorage.getItem("resources")) || [];
  const container = document.getElementById("resourcesContainer");
  container.innerHTML = resources.length ? "" : "<p class='no-resources'>No resources shared yet.</p>";

  resources.forEach((r, i) => {
    let linkURL = r.ipfsHash || r.link || "#";
    let displayType = capitalize(r.type);
    let html = `
      <div class="${r.type}">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <a href="${linkURL}" target="_blank">View ${displayType}</a>
        ${r.uploader === localStorage.getItem("userAddress") ? `<button class="delete-btn" onclick="deleteResource(${i})">Delete</button>` : ""}
      </div>
    `;
    container.innerHTML += html;
  });

  // Show username if logged in
  const userAddress = localStorage.getItem("userAddress");
  if (userAddress) {
    document.getElementById("userAddress").innerText = userAddress;
  }
}

// Delete resource by index
function deleteResource(index) {
  const res = JSON.parse(localStorage.getItem("resources")) || [];
  res.splice(index, 1);
  localStorage.setItem("resources", JSON.stringify(res));
  loadResources();
}

// Clear all resource/tut/research forms
function clearForm() {
  ["uploadForm", "tutorialForm", "researchForm"].forEach(id => {
    document.getElementById(id).reset();
  });
}

// Capitalize first letter helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Keep user logged in and load resources on page reload
window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem("userAddress");
  if (username) {
    document.getElementById("userAddress").innerText = username;
    setActiveTab("resourcesTab");
    switchToDashboard("viewDashboard");
    loadResources();
  }
});
