let courses = [
  { name: "CENG 3547", gradingScale: "10-point" },
  { name: "Database", gradingScale: "10-point" },
];
let students = {
  "CENG 3547": [
    {
      id: "001",
      name: "Ahmet",
      surname: "Yılmaz",
      midtermScore: 85,
      finalScore: 90,
      totalScore: 85 * 0.4 + 90 * 0.6,
      letterGrade: calculateLetterGrade(85 * 0.4 + 90 * 0.6, "10-point"),
    },
    {
      id: "002",
      name: "Ayşe",
      surname: "Kaya",
      midtermScore: 70,
      finalScore: 75,
      totalScore: 70 * 0.4 + 75 * 0.6,
      letterGrade: calculateLetterGrade(70 * 0.4 + 75 * 0.6, "10-point"),
    },
    {
      id: "003",
      name: "Mehmet",
      surname: "Demir",
      midtermScore: 50,
      finalScore: 60,
      totalScore: 50 * 0.4 + 60 * 0.6,
      letterGrade: calculateLetterGrade(50 * 0.4 + 60 * 0.6, "10-point"),
    },
  ],
  Database: [
    {
      id: "101",
      name: "Ali",
      surname: "Can",
      midtermScore: 95,
      finalScore: 85,
      totalScore: 95 * 0.4 + 85 * 0.6,
      letterGrade: calculateLetterGrade(95 * 0.4 + 85 * 0.6, "10-point"),
    },
    {
      id: "102",
      name: "Fatma",
      surname: "Şahin",
      midtermScore: 65,
      finalScore: 70,
      totalScore: 65 * 0.4 + 70 * 0.6,
      letterGrade: calculateLetterGrade(65 * 0.4 + 70 * 0.6, "10-point"),
    },
    {
      id: "103",
      name: "Zeynep",
      surname: "Turan",
      midtermScore: 40,
      finalScore: 50,
      totalScore: 40 * 0.4 + 50 * 0.6,
      letterGrade: calculateLetterGrade(40 * 0.4 + 50 * 0.6, "10-point"),
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  loadContent("add-course");
});

document.querySelectorAll(".navbar a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = this.getAttribute("data-target");
    loadContent(target);
  });
});

function loadContent(page) {
  const mainContent = document.getElementById("main-content");
  const pages = {
    "add-course": "views/addCourse.html",
    "add-student": "views/addStudent.html",
    "view-students": "views/viewStudents.html",
    "search-student": "views/search.html",
  };

  fetch(pages[page])
    .then((response) => {
      if (!response.ok) {
        console.error(`Failed to load ${page}: ${response.statusText}`);
        throw new Error("Error loading content");
      }
      return response.text();
    })
    .then((data) => {
      mainContent.innerHTML = data;
      if (page === "add-student") populateCourseDropdown();
      if (page === "view-students") renderStudentView();
      if (page === "search-student") initializeStudentSearch();
    })
    .catch((error) => {
      console.error("Error loading page:", error);
      mainContent.innerHTML =
        "<p>Error loading content. Please try again later.</p>";
    });
}

document.addEventListener("submit", function (e) {
  const targetId = e.target.id;
  if (targetId === "add-course-form") {
    e.preventDefault();
    const courseName = document.getElementById("course-name").value;
    const gradingScale = document.getElementById("grading-scale").value;
    courses.push({ name: courseName, gradingScale });
    students[courseName] = [];
    document.getElementById(
      "course-feedback"
    ).textContent = `Course "${courseName}" added successfully!`;
    e.target.reset();
  } else if (targetId === "add-student-form") {
    e.preventDefault();
    const courseName = document.getElementById("course-select").value;
    const studentId = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const studentSurname = document.getElementById("student-surname").value;
    const midtermScore = parseFloat(
      document.getElementById("midterm-score").value
    );
    const finalScore = parseFloat(document.getElementById("final-score").value);
    const totalScore = midtermScore * 0.4 + finalScore * 0.6;

    const course = courses.find((c) => c.name === courseName);
    const gradingScale = course ? course.gradingScale : "10-point";
    const letterGrade = calculateLetterGrade(totalScore, gradingScale);

    const newStudent = {
      id: studentId,
      name: studentName,
      surname: studentSurname,
      midtermScore,
      finalScore,
      totalScore,
      letterGrade,
    };

    students[courseName].push(newStudent);
    document.getElementById(
      "student-feedback"
    ).textContent = `Student "${studentName} ${studentSurname}" added successfully!`;
    e.target.reset();
  }
});

function calculateLetterGrade(score, gradingScale) {
  if (gradingScale === "10-point") {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  } else if (gradingScale === "7-point") {
    if (score >= 93) return "A";
    if (score >= 85) return "B";
    if (score >= 77) return "C";
    if (score >= 70) return "D";
    return "F";
  }
}

function letterGradeToPoint(letterGrade) {
  switch (letterGrade) {
    case "A":
      return 4.0;
    case "B":
      return 3.0;
    case "C":
      return 2.0;
    case "D":
      return 1.0;
    case "F":
      return 0.0;
    default:
      return 0.0;
  }
}

function populateCourseDropdown() {
  const dropdown = document.getElementById("course-select");
  dropdown.innerHTML = "";
  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.name;
    option.textContent = course.name;
    dropdown.appendChild(option);
  });
}

function renderStudentView() {
  const dropdown = document.getElementById("view-course-select");
  const viewAllButton = document.getElementById("view-students-button");
  const viewPassedButton = document.getElementById("view-passed-button");
  const viewFailedButton = document.getElementById("view-failed-button");
  const viewDetailsButton = document.getElementById("view-details-button");

  dropdown.innerHTML = "";
  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.name;
    option.textContent = course.name;
    dropdown.appendChild(option);
  });

  viewAllButton.addEventListener("click", () => {
    const courseName = dropdown.value;
    displayStudentScores(courseName, "all");
  });

  viewPassedButton.addEventListener("click", () => {
    const courseName = dropdown.value;
    displayStudentScores(courseName, "passed");
  });

  viewFailedButton.addEventListener("click", () => {
    const courseName = dropdown.value;
    displayStudentScores(courseName, "failed");
  });

  viewDetailsButton.addEventListener("click", () => {
    const courseName = dropdown.value;
    displayLectureDetails(courseName);
  });
}

function displayStudentScores(courseName, filter = "all") {
  const courseStudents = students[courseName] || [];
  let filteredStudents;

  if (filter === "passed") {
    filteredStudents = courseStudents.filter(
      (student) => student.letterGrade !== "F"
    );
  } else if (filter === "failed") {
    filteredStudents = courseStudents.filter(
      (student) => student.letterGrade === "F"
    );
  } else {
    filteredStudents = courseStudents;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Surname</th>
      <th>Midterm</th>
      <th>Final</th>
      <th>Total</th>
      <th>Grade</th>
      <th>Actions</th>
    </tr>
  `;

  filteredStudents.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${student.id}</td>
    <td>${student.name}</td>
    <td>${student.surname}</td>
    <td>${student.midtermScore}</td>
    <td>${student.finalScore}</td>
    <td>${student.totalScore.toFixed(2)}</td>
    <td>${student.letterGrade}</td>
    <td>
      <button class="update-btn" data-course="${courseName}" data-index="${index}">Update</button>
      <button class="delete-btn" data-course="${courseName}" data-index="${index}">Delete</button>
    </td>
  `;
    table.appendChild(row);
  });

  const tableContainer = document.getElementById("students-table");
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);

  const detailsContainer = document.getElementById("lecture-details");
  detailsContainer.innerHTML = "";
  detailsContainer.style.display = "none";

  tableContainer.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", handleUpdateStudent);
  });

  tableContainer.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", handleDeleteStudent);
  });
}
function handleUpdateStudent(event) {
  const courseName = event.target.getAttribute("data-course");
  const studentIndex = parseInt(event.target.getAttribute("data-index"), 10);
  const student = students[courseName][studentIndex];

  const tableContainer = document.getElementById("students-table");
  const updateFormContainer = document.createElement("div");
  updateFormContainer.id = "update-student-form";
  updateFormContainer.innerHTML = `
    <h3>Update Student: ${student.name} ${student.surname}</h3>
    <form id="update-form">
      <label for="update-midterm">Midterm Score:</label>
      <input type="number" id="update-midterm" value="${student.midtermScore}" min="0" max="100" required>
      <label for="update-final">Final Score:</label>
      <input type="number" id="update-final" value="${student.finalScore}" min="0" max="100" required>
      <button type="submit">Update</button>
      <button type="button" id="cancel-update">Cancel</button>
    </form>
  `;

  tableContainer.appendChild(updateFormContainer);

  document.getElementById("update-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newMidterm = parseFloat(
      document.getElementById("update-midterm").value
    );
    const newFinal = parseFloat(document.getElementById("update-final").value);

    student.midtermScore = newMidterm;
    student.finalScore = newFinal;
    student.totalScore = student.midtermScore * 0.4 + student.finalScore * 0.6;

    const course = courses.find((c) => c.name === courseName);
    student.letterGrade = calculateLetterGrade(
      student.totalScore,
      course.gradingScale
    );

    alert(`Updated scores for ${student.name} ${student.surname}`);
    document.getElementById("update-student-form").remove();
    displayStudentScores(courseName);
  });

  document.getElementById("cancel-update").addEventListener("click", () => {
    document.getElementById("update-student-form").remove();
  });
}

function displayLectureDetails(courseName) {
  const courseStudents = students[courseName] || [];
  const passedStudents = courseStudents.filter(
    (student) => student.letterGrade !== "F"
  ).length;
  const failedStudents = courseStudents.filter(
    (student) => student.letterGrade === "F"
  ).length;
  const meanScore =
    courseStudents.length > 0
      ? courseStudents.reduce((sum, student) => sum + student.totalScore, 0) /
        courseStudents.length
      : 0;

  const detailsContainer = document.getElementById("lecture-details");
  detailsContainer.innerHTML = `
    <h3>Lecture Details: ${courseName}</h3>
    <p>Number of Passed Students: ${passedStudents}</p>
    <p>Number of Failed Students: ${failedStudents}</p>
    <p>Mean Score: ${meanScore.toFixed(2)}</p>
  `;
  detailsContainer.style.display = "block";
}

function initializeStudentSearch() {
  const searchButton = document.getElementById("search-student-button");
  searchButton.addEventListener("click", searchStudent);
}

function searchStudent() {
  const searchQuery = document
    .getElementById("search-student")
    .value.trim()
    .toLowerCase();
  const resultsContainer = document.getElementById("search-results");
  if (!searchQuery) {
    resultsContainer.innerHTML = "<p>Please enter a student name.</p>";
    return;
  }

  const studentResults = {};

  for (const [course, studentList] of Object.entries(students)) {
    studentList.forEach((student) => {
      const fullName = `${student.name.toLowerCase()} ${student.surname.toLowerCase()}`;
      if (fullName.includes(searchQuery)) {
        if (!studentResults[student.id]) {
          studentResults[student.id] = {
            id: student.id,
            name: student.name,
            surname: student.surname,
            courses: [],
          };
        }
        studentResults[student.id].courses.push({
          courseName: course,
          totalScore: student.totalScore,
          letterGrade: student.letterGrade,
          gradePoint: letterGradeToPoint(student.letterGrade),
        });
      }
    });
  }

  if (Object.keys(studentResults).length === 0) {
    resultsContainer.innerHTML = `<p>No students found for "${searchQuery}".</p>`;
  } else {
    displaySearchResults(studentResults);
  }
}

function displaySearchResults(studentResults) {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";

  for (const studentId in studentResults) {
    const student = studentResults[studentId];

    const studentInfo = document.createElement("h3");
    studentInfo.textContent = `Student: ${student.name} ${student.surname} (ID: ${student.id})`;
    resultsContainer.appendChild(studentInfo);

    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Course</th>
        <th>Total Score</th>
        <th>Letter Grade</th>
      </tr>
    `;

    let totalPoints = 0;
    student.courses.forEach((courseInfo) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${courseInfo.courseName}</td>
        <td>${courseInfo.totalScore.toFixed(2)}</td>
        <td>${courseInfo.letterGrade}</td>
      `;
      table.appendChild(row);

      totalPoints += courseInfo.gradePoint;
    });

    resultsContainer.appendChild(table);

    const gpa = totalPoints / student.courses.length;
    const gpaContainer = document.createElement("p");
    gpaContainer.innerHTML = `<strong>GPA:</strong> ${gpa.toFixed(2)}`;
    resultsContainer.appendChild(gpaContainer);
  }
}
