// State Management
let students = [];
let notices = [];
let currentEditStudentId = null;
let currentEditNoticeId = null;

// Load data from Local Storage on page load
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  updateUI();
});

function loadData() {
  // Load students
  const storedStudents = localStorage.getItem("students");
  if (storedStudents) {
    students = JSON.parse(storedStudents);
  }

  // Load notices
  const storedNotices = localStorage.getItem("notices");
  if (storedNotices) {
    notices = JSON.parse(storedNotices);
  }

  // Load settings
  const schoolName = localStorage.getItem("schoolName") || "Our School";
  const schoolSlogan =
    localStorage.getItem("schoolSlogan") || "We have the best education system";
  const logoUrl =
    localStorage.getItem("logoUrl") ||
    "https://img.freepik.com/premium-vector/education-logo-design-template-school-organization_731136-2.jpg";

  document.getElementById("school-name").textContent = schoolName;
  document.getElementById("school-slogan").textContent = schoolSlogan;
  document.getElementById("school-logo").src = logoUrl;
  document.getElementById("setting-school-name").value = schoolName;
  document.getElementById("setting-school-slogan").value = schoolSlogan;
  document.getElementById("setting-logo-url").value = logoUrl;
}

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("notices", JSON.stringify(notices));
  sessionStorage.setItem("students", JSON.stringify(students));
  sessionStorage.setItem("notices", JSON.stringify(notices));
  setCookie("students", JSON.stringify(students), 1);
  setCookie("notices", JSON.stringify(notices), 1);
}

function updateUI() {
  // Update total students across all sections
  const totalStudentsElements = [
    "total-students-count",
    "local-total-students-count",
    "session-total-students-count",
    "cookie-total-students-count",
    "state-total-students-count",
  ];
  totalStudentsElements.forEach((id) => {
    document.getElementById(id).textContent = students.length;
  });

  // Update students table
  const studentsTable = document.getElementById("students-table");
  studentsTable.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
               <td>${student.id}</td>
               <td>${student.name}</td>
               <td>${student.class}</td>
               <td>${student.roll}</td>
               <td class="actions">
                   <button class="edit" onclick="openEditStudentModal('${student.id}')">Edit</button>
                   <button class="delete" onclick="deleteStudent('${student.id}')">Delete</button>
               </td>
           `;
    studentsTable.appendChild(row);
  });

  // Update notices across all sections
  const noticeContainers = [
    "dashboard-notices",
    "all-notices",
    "local-dashboard-notices",
    "session-dashboard-notices",
    "cookie-dashboard-notices",
    "state-dashboard-notices",
  ];
  noticeContainers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    notices.forEach((notice) => {
      const noticeCard = `
                   <div class="notice-card">
                       <div>
                           <h4>${notice.title}</h4>
                           <p>${notice.content}</p>
                           <p>Posted on: ${notice.date}</p>
                       </div>
                       <div class="actions">
                           <button class="edit" onclick="openEditNoticeModal('${notice.id}')">Edit</button>
                           <button class="delete" onclick="deleteNotice('${notice.id}')">Delete</button>
                       </div>
                   </div>
               `;
      container.innerHTML += noticeCard;
    });
  });
}

// Navigation
function showSection(sectionId) {
  // Update section visibility
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");

  // Update sidebar active link
  document.querySelectorAll("aside ul li a").forEach((link) => {
    link.classList.remove("active");
  });
  document.getElementById(`${sectionId}-link`)?.classList.add("active");

  // Update header active link
  document.querySelectorAll("header nav a").forEach((link) => {
    link.classList.remove("active");
  });
  document.getElementById(`${sectionId}-link`)?.classList.add("active");
}

// Student Management
function openAdmitModal() {
  currentEditStudentId = null;
  document.getElementById("modal-title").textContent = "Admit New Student";
  document.getElementById("modal-save-btn").textContent = "Admit Student";
  document.getElementById("modal-student-name").value = "";
  document.getElementById("modal-student-class").value = "";
  document.getElementById("modal-student-roll").value = "";
  document.getElementById("student-modal").classList.add("active");
}

function openEditStudentModal(id) {
  const student = students.find((s) => s.id === id);
  currentEditStudentId = id;
  document.getElementById("modal-title").textContent = "Edit Student";
  document.getElementById("modal-save-btn").textContent = "Save Changes";
  document.getElementById("modal-student-name").value = student.name;
  document.getElementById("modal-student-class").value = student.class;
  document.getElementById("modal-student-roll").value = student.roll;
  document.getElementById("student-modal").classList.add("active");
}

function saveStudent() {
  const name = document.getElementById("modal-student-name").value;
  const studentClass = document.getElementById("modal-student-class").value;
  const roll = document.getElementById("modal-student-roll").value;

  if (name && studentClass && roll) {
    if (currentEditStudentId) {
      // Edit existing student
      const student = students.find((s) => s.id === currentEditStudentId);
      student.name = name;
      student.class = studentClass;
      student.roll = roll;
      showPopup("Student profile updated successfully!");
    } else {
      // Add new student
      const id = "174256885" + Math.floor(Math.random() * 1000000);
      students.push({ id, name, class: studentClass, roll });
      showPopup("Student admitted successfully!");
    }
    saveData();
    updateUI();
    closeStudentModal();
  }
}

function deleteStudent(id) {
  students = students.filter((s) => s.id !== id);
  showPopup("Student removed successfully!");
  saveData();
  updateUI();
}

// Notice Management
function publishNotice() {
  const title = document.getElementById("notice-title").value;
  const content = document.getElementById("notice-content").value;

  if (title && content) {
    const id = Date.now().toString();
    const date = new Date().toLocaleDateString();
    notices.push({ id, title, content, date });
    document.getElementById("notice-title").value = "";
    document.getElementById("notice-content").value = "";
    showPopup("Notice published successfully!");
    saveData();
    updateUI();
  }
}

function openEditNoticeModal(id) {
  const notice = notices.find((n) => n.id === id);
  currentEditNoticeId = id;
  document.getElementById("modal-notice-title").value = notice.title;
  document.getElementById("modal-notice-content").value = notice.content;
  document.getElementById("notice-modal").classList.add("active");
}

function saveNotice() {
  const title = document.getElementById("modal-notice-title").value;
  const content = document.getElementById("modal-notice-content").value;

  if (title && content) {
    const notice = notices.find((n) => n.id === currentEditNoticeId);
    notice.title = title;
    notice.content = content;
    notice.date = new Date().toLocaleDateString(); // Update date on edit
    showPopup("Notice updated successfully!");
    saveData();
    updateUI();
    closeNoticeModal();
  }
}

function deleteNotice(id) {
  notices = notices.filter((n) => n.id !== id);
  showPopup("Notice deleted successfully!");
  saveData();
  updateUI();
}

// Settings Management
function saveSettings() {
  const schoolName = document.getElementById("setting-school-name").value;
  const schoolSlogan = document.getElementById("setting-school-slogan").value;
  const logoUrl = document.getElementById("setting-logo-url").value;

  document.getElementById("school-name").textContent = schoolName;
  document.getElementById("school-slogan").textContent = schoolSlogan;
  document.getElementById("school-logo").src = logoUrl;

  localStorage.setItem("schoolName", schoolName);
  localStorage.setItem("schoolSlogan", schoolSlogan);
  localStorage.setItem("logoUrl", logoUrl);
  sessionStorage.setItem("schoolName", schoolName);
  sessionStorage.setItem("schoolSlogan", schoolSlogan);
  sessionStorage.setItem("logoUrl", logoUrl);
  setCookie("schoolName", schoolName, 1);
  setCookie("schoolSlogan", schoolSlogan, 1);
  setCookie("logoUrl", logoUrl, 1);

  showPopup("Settings saved successfully!");
  updateUI();
}

// Cookie Management
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

// Modal and Popup
function closeStudentModal() {
  document.getElementById("student-modal").classList.remove("active");
}

function closeNoticeModal() {
  document.getElementById("notice-modal").classList.remove("active");
}

function showPopup(message) {
  const popup = document.getElementById("popup");
  document.getElementById("popup-message").textContent = message;
  popup.classList.add("active");
  setTimeout(() => {
    popup.classList.remove("active");
  }, 3000);
}

function closePopup() {
  document.getElementById("popup").classList.remove("active");
}
