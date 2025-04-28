 // State Management: Define global variables to manage the application's state in memory
        // State Management: 'students' array holds all student data, used to manage the app's state
        let students = [];
        // State Management: 'notices' array holds all notice data, used to manage the app's state
        let notices = [];
        // State Management: Tracks the ID of the student being edited to manage edit/add operations
        let currentEditStudentId = null;
        // State Management: Tracks the ID of the notice being edited to manage edit/add operations
        let currentEditNoticeId = null;
        // Session Storage: Tracks the ID of the last edited student for temporary session data
        let lastEditedStudentId = null;
        // Session Storage: Tracks the ID of the last edited notice for temporary session data
        let lastEditedNoticeId = null;
        // CHANGE: Added newStudents to track newly created students in sessionStorage
        // Session Storage: Tracks newly created students during this session
        let newStudents = [];
        // CHANGE: Added newNotices to track newly created notices in sessionStorage
        // Session Storage: Tracks newly created notices during this session
        let newNotices = [];
        // Cookie Storage: Tracks a unique session ID for the current browser session
        let sessionId = null;

        // Initialization: Load data and initialize the app when the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Initialization: Load persistent data from localStorage
            loadData();
            // Initialization: Load temporary session data from sessionStorage
            loadSessionData();
            // Initialization: Load or generate a session ID for cookie storage
            initializeSessionId();
            // Initialization: Update the UI with the loaded data
            updateUI();
        });

        // Local Storage: Load persistent data (students, notices, settings) from localStorage
        function loadData() {
            // Local Storage: Retrieve students data from localStorage, where it's stored persistently
            const storedStudents = localStorage.getItem('students');
            // Local Storage: If students data exists, parse it and assign to the global students array
            if (storedStudents) {
                students = JSON.parse(storedStudents);
            }

            // Local Storage: Retrieve notices data from localStorage for persistent storage
            const storedNotices = localStorage.getItem('notices');
            // Local Storage: If notices data exists, parse it and assign to the global notices array
            if (storedNotices) {
                notices = JSON.parse(storedNotices);
            }

            // Local Storage: Load school settings (name, slogan, logo) with default values if not present
            const schoolName = localStorage.getItem('schoolName') || 'Our School';
            const schoolSlogan = localStorage.getItem('schoolSlogan') || 'We have the best education system';
            const logoUrl = localStorage.getItem('logoUrl') || 'https://img.freepik.com/premium-vector/education-logo-design-template-school-organization_731136-2.jpg';

            // Local Storage: Update the UI with the loaded settings
            document.getElementById('school-name').textContent = schoolName;
            document.getElementById('school-slogan').textContent = schoolSlogan;
            document.getElementById('school-logo').src = logoUrl;
            document.getElementById('setting-school-name').value = schoolName;
            document.getElementById('setting-school-slogan').value = schoolSlogan;
            document.getElementById('setting-logo-url').value = logoUrl;
        }

        // CHANGE: Modified loadSessionData to load newStudents and newNotices
        // Session Storage: Load temporary data (last edited student/notice IDs, new students/notices) from sessionStorage
        function loadSessionData() {
            // Session Storage: Retrieve the last edited student ID, which is temporary for this session
            lastEditedStudentId = sessionStorage.getItem('lastEditedStudentId') || null;
            // Session Storage: Retrieve the last edited notice ID, temporary for this session
            lastEditedNoticeId = sessionStorage.getItem('lastEditedNoticeId') || null;
            // Session Storage: Retrieve newly created students for this session
            const storedNewStudents = sessionStorage.getItem('newStudents');
            if (storedNewStudents) {
                newStudents = JSON.parse(storedNewStudents);
            }
            // Session Storage: Retrieve newly created notices for this session
            const storedNewNotices = sessionStorage.getItem('newNotices');
            if (storedNewNotices) {
                newNotices = JSON.parse(storedNewNotices);
            }
        }

        // Cookie Storage: Initialize or load a unique session ID for the current session
        function initializeSessionId() {
            // Cookie Storage: Retrieve the session ID from cookies
            const cookies = document.cookie.split(';').map(cookie => cookie.trim());
            const sessionCookie = cookies.find(cookie => cookie.startsWith('sessionId='));
            if (sessionCookie) {
                // Cookie Storage: If session ID exists, extract and decode it
                sessionId = decodeURIComponent(sessionCookie.split('=')[1]);
            } else {
                // Cookie Storage: Generate a new session ID if none exists
                sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                // Cookie Storage: Save the session ID to cookies with a 1-day expiry
                setCookie('sessionId', sessionId, 1);
            }
        }

        // CHANGE: Modified saveData to save newStudents and newNotices to sessionStorage
        // Local Storage: Save persistent data to localStorage
        // Session Storage: Save temporary data to sessionStorage
        // Cookie Storage: Save session-specific data to cookies
        function saveData() {
            // Local Storage: Persist the students array to localStorage for long-term storage
            localStorage.setItem('students', JSON.stringify(students));
            // Local Storage: Persist the notices array to localStorage
            localStorage.setItem('notices', JSON.stringify(notices));
            // Session Storage: Save the last edited student ID to sessionStorage (temporary)
            if (lastEditedStudentId) {
                sessionStorage.setItem('lastEditedStudentId', lastEditedStudentId);
            }
            // Session Storage: Save the last edited notice ID to sessionStorage (temporary)
            if (lastEditedNoticeId) {
                sessionStorage.setItem('lastEditedNoticeId', lastEditedNoticeId);
            }
            // Session Storage: Save newly created students to sessionStorage (temporary)
            sessionStorage.setItem('newStudents', JSON.stringify(newStudents));
            // Session Storage: Save newly created notices to sessionStorage (temporary)
            sessionStorage.setItem('newNotices', JSON.stringify(newNotices));
            // Cookie Storage: Save the session ID to cookies (already saved in initializeSessionId)
        }

        // CHANGE: Modified updateUI to display newStudents and newNotices in the Session Storage section
        // State Management: Update the UI based on the current state (students, notices)
        function updateUI() {
            // State Management: Update total student count in the Dashboard section
            document.getElementById('total-students-count').textContent = students.length;

            // State Management: Update the students table in the Students section
            const studentsTable = document.getElementById('students-table');
            // State Management: Clear existing table content
            studentsTable.innerHTML = '';
            // State Management: Populate the table with student data from the state
            students.forEach(student => {
                // State Management: Create a new row for each student
                const row = document.createElement('tr');
                // State Management: Add student data and action buttons to the row
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
                // State Management: Append the row to the table
                studentsTable.appendChild(row);
            });

            // State Management: Update notices in the Dashboard and Notices sections
            const noticeContainers = ['dashboard-notices', 'all-notices'];
            // State Management: Loop through each notice container
            noticeContainers.forEach(containerId => {
                // State Management: Get the container element
                const container = document.getElementById(containerId);
                // State Management: Clear existing notices
                container.innerHTML = '';
                // State Management: Populate the container with notices from the state
                notices.forEach(notice => {
                    // State Management: Create a notice card with data and action buttons
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
                    // State Management: Append the notice card to the container
                    container.innerHTML += noticeCard;
                });
            });

            // Local Storage: Update students table in the Local Storage section
            const localStudentsTable = document.getElementById('local-storage-students');
            localStudentsTable.innerHTML = '';
            let localStudents = [];
            const storedStudents = localStorage.getItem('students');
            if (storedStudents) {
                localStudents = JSON.parse(storedStudents);
            }
            localStudents.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll}</td>
                `;
                localStudentsTable.appendChild(row);
            });

            // Local Storage: Update notices in the Local Storage section
            const localNoticesContainer = document.getElementById('local-storage-notices');
            localNoticesContainer.innerHTML = '';
            let localNotices = [];
            const storedNotices = localStorage.getItem('notices');
            if (storedNotices) {
                localNotices = JSON.parse(storedNotices);
            }
            localNotices.forEach(notice => {
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

            // Session Storage: Update last edited IDs in the Session Storage section
            document.getElementById('session-last-student-id').textContent = lastEditedStudentId || 'None';
            document.getElementById('session-last-notice-id').textContent = lastEditedNoticeId || 'None';

            // Session Storage: Update newly created students in the Session Storage section
            const sessionNewStudentsTable = document.getElementById('session-new-students');
            sessionNewStudentsTable.innerHTML = '';
            newStudents.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll}</td>
                `;
                sessionNewStudentsTable.appendChild(row);
            });

            // Session Storage: Update newly created notices in the Session Storage section
            const sessionNewNoticesContainer = document.getElementById('session-new-notices');
            sessionNewNoticesContainer.innerHTML = '';
            newNotices.forEach(notice => {
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

            // Cookie Storage: Update session ID in the Cookie Storage section
            document.getElementById('cookie-session-id').textContent = sessionId || 'None';

            // State Management: Update students table in the State Management section
            const stateStudentsTable = document.getElementById('state-management-students');
            stateStudentsTable.innerHTML = '';
            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll}</td>
                `;
                stateStudentsTable.appendChild(row);
            });

            // State Management: Update notices in the State Management section
            const stateNoticesContainer = document.getElementById('state-management-notices');
            stateNoticesContainer.innerHTML = '';
            notices.forEach(notice => {
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

        // Navigation: Handle section switching and active link highlighting
        function showSection(sectionId) {
            // Navigation: Hide all sections by removing the 'active' class
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            // Navigation: Show the selected section by adding the 'active' class
            document.getElementById(sectionId).classList.add('active');

            // Navigation: Update sidebar active link by removing 'active' from all links
            document.querySelectorAll('aside ul li a').forEach(link => {
                link.classList.remove('active');
            });
            // Navigation: Add 'active' class to the selected sidebar link
            document.getElementById(`${sectionId}-link`)?.classList.add('active');

            // Navigation: Update header active link by removing 'active' from all links
            document.querySelectorAll('header nav a').forEach(link => {
                link.classList.remove('active');
            });
            // Navigation: Add 'active' class to the selected header link
            document.getElementById(`${sectionId}-link`)?.classList.add('active');
        }

        // Student Management: Open the modal for adding a new student
        function openAdmitModal() {
            // State Management: Set currentEditStudentId to null to indicate a new student
            currentEditStudentId = null;
            // UI: Set modal title for adding a new student
            document.getElementById('modal-title').textContent = 'Admit New Student';
            // UI: Set save button text for adding a new student
            document.getElementById('modal-save-btn').textContent = 'Admit Student';
            // UI: Clear modal input fields
            document.getElementById('modal-student-name').value = '';
            document.getElementById('modal-student-class').value = '';
            document.getElementById('modal-student-roll').value = '';
            // UI: Show the student modal
            document.getElementById('student-modal').classList.add('active');
        }

        // Student Management: Open the modal for editing an existing student
        function openEditStudentModal(id) {
            // State Management: Find the student to edit
            const student = students.find(s => s.id === id);
            // State Management: Set currentEditStudentId to track the student being edited
            currentEditStudentId = id;
            // Session Storage: Store the ID of the last edited student (temporary for this session)
            lastEditedStudentId = id;
            // UI: Set modal title for editing a student
            document.getElementById('modal-title').textContent = 'Edit Student';
            // UI: Set save button text for editing
            document.getElementById('modal-save-btn').textContent = 'Save Changes';
            // UI: Populate modal fields with the student's current data
            document.getElementById('modal-student-name').value = student.name;
            document.getElementById('modal-student-class').value = student.class;
            document.getElementById('modal-student-roll').value = student.roll;
            // UI: Show the student modal
            document.getElementById('student-modal').classList.add('active');
        }

        // CHANGE: Modified saveStudent to add new students to newStudents array in sessionStorage
        // Student Management: Save a new or edited student
        function saveStudent() {
            // UI: Get input values from the modal
            const name = document.getElementById('modal-student-name').value;
            const studentClass = document.getElementById('modal-student-class').value;
            const roll = document.getElementById('modal-student-roll').value;

            // Validation: Ensure all fields are filled
            if (name && studentClass && roll) {
                if (currentEditStudentId) {
                    // State Management: Edit an existing student in the state
                    const student = students.find(s => s.id === currentEditStudentId);
                    student.name = name;
                    student.class = studentClass;
                    student.roll = roll;
                    // Session Storage: Update the last edited student ID
                    lastEditedStudentId = currentEditStudentId;
                    // UI: Show success message
                    showPopup('Student profile updated successfully!');
                } else {
                    // State Management: Add a new student to the state
                    const id = '174256885' + Math.floor(Math.random() * 1000000);
                    const newStudent = { id, name, class: studentClass, roll };
                    students.push(newStudent);
                    // Session Storage: Add the new student to newStudents for this session
                    newStudents.push(newStudent);
                    // UI: Show success message
                    showPopup('Student admitted successfully!');
                }
                // Local Storage & Session Storage: Save the updated data
                saveData();
                // State Management: Update the UI with the new state
                updateUI();
                // UI: Close the modal
                closeStudentModal();
            }
        }

        // Student Management: Delete a student
        function deleteStudent(id) {
            // State Management: Remove the student from the state
            students = students.filter(s => s.id !== id);
            // UI: Show success message
            showPopup('Student removed successfully!');
            // Local Storage: Save the updated data
            saveData();
            // State Management: Update the UI
            updateUI();
        }

        // CHANGE: Modified publishNotice to add new notices to newNotices array in sessionStorage
        // Notice Management: Publish a new notice
        function publishNotice() {
            // UI: Get input values from the notice form
            const title = document.getElementById('notice-title').value;
            const content = document.getElementById('notice-content').value;

            // Validation: Ensure all fields are filled
            if (title && content) {
                // State Management: Create a new notice and add it to the state
                const id = Date.now().toString();
                const date = new Date().toLocaleDateString();
                const newNotice = { id, title, content, date };
                notices.push(newNotice);
                // Session Storage: Add the new notice to newNotices for this session
                newNotices.push(newNotice);
                // UI: Clear the form fields
                document.getElementById('notice-title').value = '';
                document.getElementById('notice-content').value = '';
                // UI: Show success message
                showPopup('Notice published successfully!');
                // Local Storage: Save the updated data
                saveData();
                // State Management: Update the UI
                updateUI();
            }
        }

        // Notice Management: Open the modal for editing a notice
        function openEditNoticeModal(id) {
            // State Management: Find the notice to edit
            const notice = notices.find(n => n.id === id);
            // State Management: Set currentEditNoticeId to track the notice being edited
            currentEditNoticeId = id;
            // Session Storage: Store the ID of the last edited notice (temporary for this session)
            lastEditedNoticeId = id;
            // UI: Populate modal fields with the notice's current data
            document.getElementById('modal-notice-title').value = notice.title;
            document.getElementById('modal-notice-content').value = notice.content;
            // UI: Show the notice modal
            document.getElementById('notice-modal').classList.add('active');
        }

        // Notice Management: Save changes to an edited notice
        function saveNotice() {
            // UI: Get updated values from the modal
            const title = document.getElementById('modal-notice-title').value;
            const content = document.getElementById('modal-notice-content').value;

            // Validation: Ensure all fields are filled
            if (title && content) {
                // State Management: Update the notice in the state
                const notice = notices.find(n => n.id === currentEditNoticeId);
                notice.title = title;
                notice.content = content;
                notice.date = new Date().toLocaleDateString();
                // Session Storage: Update the last edited notice ID
                lastEditedNoticeId = currentEditNoticeId;
                // UI: Show success message
                showPopup('Notice updated successfully!');
                // Local Storage & Session Storage: Save the updated data
                saveData();
                // State Management: Update the UI
                updateUI();
                // UI: Close the modal
                closeNoticeModal();
            }
        }

        // Notice Management: Delete a notice
        function deleteNotice(id) {
            // State Management: Remove the notice from the state
            notices = notices.filter(n => n.id !== id);
            // UI: Show success message
            showPopup('Notice deleted successfully!');
            // Local Storage: Save the updated data
            saveData();
            // State Management: Update the UI
            updateUI();
        }

        // Settings Management: Save school settings
        function saveSettings() {
            // UI: Get input values from the settings form
            const schoolName = document.getElementById('setting-school-name').value;
            const schoolSlogan = document.getElementById('setting-school-slogan').value;
            const logoUrl = document.getElementById('setting-logo-url').value;

            // UI: Update the sidebar with the new settings
            document.getElementById('school-name').textContent = schoolName;
            document.getElementById('school-slogan').textContent = schoolSlogan;
            document.getElementById('school-logo').src = logoUrl;

            // Local Storage: Persist the settings to localStorage for long-term storage
            localStorage.setItem('schoolName', schoolName);
            localStorage.setItem('schoolSlogan', schoolSlogan);
            localStorage.setItem('logoUrl', logoUrl);

            // UI: Show success message
            showPopup('Settings saved successfully!');
            // State Management: Update the UI (though not necessary here)
            updateUI();
        }

        // Cookie Storage: Set a cookie with a specified name, value, and expiry
        function setCookie(name, value, days) {
            // Cookie Storage: Calculate the expiry date for the cookie
            const expires = new Date(Date.now() + days * 864e5).toUTCString();
            // Cookie Storage: Set the cookie with the name, encoded value, expiry, and path
            document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
        }

        // Modal and Popup: Close the student modal
        function closeStudentModal() {
            // UI: Hide the student modal
            document.getElementById('student-modal').classList.remove('active');
        }

        // Modal and Popup: Close the notice modal
        function closeNoticeModal() {
            // UI: Hide the notice modal
            document.getElementById('notice-modal').classList.remove('active');
        }

        // Modal and Popup: Show a temporary popup notification
        function showPopup(message) {
            // UI: Get the popup element
            const popup = document.getElementById('popup');
            // UI: Set the popup message
            document.getElementById('popup-message').textContent = message;
            // UI: Show the popup
            popup.classList.add('active');
            // UI: Hide the popup after 3 seconds
            setTimeout(() => {
                popup.classList.remove('active');
            }, 3000);
        }

        // Modal and Popup: Manually close the popup
        function closePopup() {
            // UI: Hide the popup
            document.getElementById('popup').classList.remove('active');
        }