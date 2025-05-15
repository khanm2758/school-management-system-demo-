// Step: One
// Description: Define global variables for state management
let students = [];
let notices = [];
let currentEditStudentId = null;
let currentEditNoticeId = null;
let lastEditedStudentId = null;
let lastEditedNoticeId = null;
let newStudents = [];
let newNotices = [];
let sessionId = null;

// Step: Two
// Description: Initialize the application on DOM content load
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  loadSessionData();
  initializeSessionId();
  updateUI();
});

// Step: Three
// Description: Load persistent data from localStorage
function loadData() {
  const storedStudents = localStorage.getItem("students");
  if (storedStudents) {
    students = JSON.parse(storedStudents);
  }

  const storedNotices = localStorage.getItem("notices");
  if (storedNotices) {
    notices = JSON.parse(storedNotices);
  }

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

// Step: Four
// Description: Load temporary session data from sessionStorage
function loadSessionData() {
  lastEditedStudentId = sessionStorage.getItem("lastEditedStudentId") || null;
  lastEditedNoticeId = sessionStorage.getItem("lastEditedNoticeId") || null;
  const storedNewStudents = sessionStorage.getItem("newStudents");
  if (storedNewStudents) {
    newStudents = JSON.parse(storedNewStudents);
  }
  const storedNewNotices = sessionStorage.getItem("newNotices");
  if (storedNewNotices) {
    newNotices = JSON.parse(storedNewNotices);
  }
}

// Step: Five
// Description: Initialize or load session ID from cookies
function initializeSessionId() {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith("sessionId=")
  );
  if (sessionCookie) {
    sessionId = decodeURIComponent(sessionCookie.split("=")[1]);
  } else {
    sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setCookie("sessionId", sessionId, 1);
  }
}

// Step: Six
// Description: Save data to localStorage, sessionStorage, and cookies
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("notices", JSON.stringify(notices));
  if (lastEditedStudentId) {
    sessionStorage.setItem("lastEditedStudentId", lastEditedStudentId);
  }
  if (lastEditedNoticeId) {
    sessionStorage.setItem("lastEditedNoticeId", lastEditedNoticeId);
  }
  sessionStorage.setItem("newStudents", JSON.stringify(newStudents));
  sessionStorage.setItem("newNotices", JSON.stringify(newNotices));
}

// Step: Seven
// Description: Update the UI based on the current state
function updateUI() {
  document.getElementById("total-students-count").textContent = students.length;

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

  const noticeContainers = ["dashboard-notices", "all-notices"];
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

  const localStudentsTable = document.getElementById("local-storage-students");
  localStudentsTable.innerHTML = "";
  let localStudents = [];
  const storedStudents = localStorage.getItem("students");
  if (storedStudents) {
    localStudents = JSON.parse(storedStudents);
  }
  localStudents.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll}</td>
                `;
    localStudentsTable.appendChild(row);
  });

  const localNoticesContainer = document.getElementById(
    "local-storage-notices"
  );
  localNoticesContainer.innerHTML = "";
  let localNotices = [];
  const storedNotices = localStorage.getItem("notices");
  if (storedNotices) {
    localNotices = JSON.parse(storedNotices);
  }
  localNotices.forEach((notice) => {
    const noticeCard = `
                    <div class="notice-card">
                        <div>
                            <h4>${notice.title}</h4>
                            <p>${notice.content}</p>
                            <p>Posted on: ${notice.date}</p>
                        </div>
                    </div>
                `;
    localNoticesContainer.innerHTML += noticeCard;
  });

  document.getElementById("session-last-student-id").textContent =
    lastEditedStudentId || "None";
  document.getElementById("session-last-notice-id").textContent =
    lastEditedNoticeId || "None";

  const sessionNewStudentsTable = document.getElementById(
    "session-new-students"
  );
  sessionNewStudentsTable.innerHTML = "";
  newStudents.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll}</td>
                `;
    sessionNewStudentsTable.appendChild(row);
  });

  const sessionNewNoticesContainer = document.getElementById(
    "session-new-notices"
  );
  sessionNewNoticesContainer.innerHTML = "";
  newNotices.forEach((notice) => {
    const noticeCard = `
                    <div class="notice-card">
                        <div>
                            <h4>${notice.title}</h4>
                            <p>${notice.content}</p>
                            <p>Posted on: ${notice.date}</p>
                        </div>
                    </div>
                `;
    sessionNewNoticesContainer.innerHTML += noticeCard;
  });

  document.getElementById("cookie-session-id").textContent =
    sessionId || "None";

  const stateStudentsTable = document.getElementById(
    "state-management-students"
  );
  stateStudentsTable.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll}</td>
                `;
    stateStudentsTable.appendChild(row);
  });

  const stateNoticesContainer = document.getElementById(
    "state-management-notices"
  );
  stateNoticesContainer.innerHTML = "";
  notices.forEach((notice) => {
    const noticeCard = `
                    <div class="notice-card">
                        <div>
                            <h4>${notice.title}</h4>
                            <p>${notice.content}</p>
                            <p>Posted on: ${notice.date}</p>
                        </div>
                    </div>
                `;
    stateNoticesContainer.innerHTML += noticeCard;
  });
}

// Step: Eight
// Description: Handle section navigation and UI highlighting
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");

  document.querySelectorAll("aside ul li a").forEach((link) => {
    link.classList.remove("active");
  });
  document.getElementById(`${sectionId}-link`)?.classList.add("active");

  document.querySelectorAll("header nav a").forEach((link) => {
    link.classList.remove("active");
  });
  document.getElementById(`${sectionId}-link`)?.classList.add("active");
}

// Step: Nine
// Description: Open modal for adding a new student
function openAdmitModal() {
  currentEditStudentId = null;
  document.getElementById("modal-title").textContent = "Admit New Student";
  document.getElementById("modal-save-btn").textContent = "Admit Student";
  document.getElementById("modal-student-name").value = "";
  document.getElementById("modal-student-class").value = "";
  document.getElementById("modal-student-roll").value = "";
  document.getElementById("student-modal").classList.add("active");
}

// Step: Ten
// Description: Open modal for editing an existing student
function openEditStudentModal(id) {
  const student = students.find((s) => s.id === id);
  currentEditStudentId = id;
  lastEditedStudentId = id;
  document.getElementById("modal-title").textContent = "Edit Student";
  document.getElementById("modal-save-btn").textContent = "Save Changes";
  document.getElementById("modal-student-name").value = student.name;
  document.getElementById("modal-student-class").value = student.class;
  document.getElementById("modal-student-roll").value = student.roll;
  document.getElementById("student-modal").classList.add("active");
}

// Step: Eleven
// Description: Save a new or edited student
function saveStudent() {
  const name = document.getElementById("modal-student-name").value;
  const studentClass = document.getElementById("modal-student-class").value;
  const roll = document.getElementById("modal-student-roll").value;

  if (name && studentClass && roll) {
    if (currentEditStudentId) {
      const student = students.find((s) => s.id === currentEditStudentId);
      student.name = name;
      student.class = studentClass;
      student.roll = roll;
      lastEditedStudentId = currentEditStudentId;
      showPopup("Student profile updated successfully!");
    } else {
      const id = "174256885" + Math.floor(Math.random() * 1000000);
      const newStudent = { id, name, class: studentClass, roll };
      students.push(newStudent);
      newStudents.push(newStudent);
      showPopup("Student admitted successfully!");
    }
    saveData();
    updateUI();
    closeStudentModal();
  }
}

// Step: Twelve
// Description: Delete a student
function deleteStudent(id) {
  students = students.filter((s) => s.id !== id);
  showPopup("Student removed successfully!");
  saveData();
  updateUI();
}

// Step: Thirteen
// Description: Publish a new notice
function publishNotice() {
  const title = document.getElementById("notice-title").value;
  const content = document.getElementById("notice-content").value;

  if (title && content) {
    const id = Date.now().toString();
    const date = new Date().toLocaleDateString();
    const newNotice = { id, title, content, date };
    notices.push(newNotice);
    newNotices.push(newNotice);
    document.getElementById("notice-title").value = "";
    document.getElementById("notice-content").value = "";
    showPopup("Notice published successfully!");
    saveData();
    updateUI();
  }
}

// Step: Fourteen
// Description: Open modal for editing a notice
function openEditNoticeModal(id) {
  const notice = notices.find((n) => n.id === id);
  currentEditNoticeId = id;
  lastEditedNoticeId = id;
  document.getElementById("modal-notice-title").value = notice.title;
  document.getElementById("modal-notice-content").value = notice.content;
  document.getElementById("notice-modal").classList.add("active");
}

// Step: Fifteen
// Description: Save changes to an edited notice
function saveNotice() {
  const title = document.getElementById("modal-notice-title").value;
  const content = document.getElementById("modal-notice-content").value;

  if (title && content) {
    const notice = notices.find((n) => n.id === currentEditNoticeId);
    notice.title = title;
    notice.content = content;
    notice.date = new Date().toLocaleDateString();
    lastEditedNoticeId = currentEditNoticeId;
    showPopup("Notice updated successfully!");
    saveData();
    updateUI();
    closeNoticeModal();
  }
}

// Step: Sixteen
// Description: Delete a notice
function deleteNotice(id) {
  notices = notices.filter((n) => n.id !== id);
  showPopup("Notice deleted successfully!");
  saveData();
  updateUI();
}

// Step: Seventeen
// Description: Save school settings
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

  showPopup("Settings saved successfully!");
  updateUI();
}

// Step: Eighteen
// Description: Set a cookie with specified parameters
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}

// Step: Nineteen
// Description: Close the student modal
function closeStudentModal() {
  document.getElementById("student-modal").classList.remove("active");
}

// Step: Twenty
// Description: Close the notice modal
function closeNoticeModal() {
  document.getElementById("notice-modal").classList.remove("active");
}

// Step: Twenty-One
// Description: Show a temporary popup notification
function showPopup(message) {
  const popup = document.getElementById("popup");
  document.getElementById("popup-message").textContent = message;
  popup.classList.add("active");
  setTimeout(() => {
    popup.classList.remove("active");
  }, 3000);
}

// Step: Twenty-Two
// Description: Manually close the popup
function closePopup() {
  document.getElementById("popup").classList.remove("active");
}