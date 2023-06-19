console.log("JS Loaded");
const headerModal = document.querySelector(".header-info")
const bodyModal = document.querySelector(".body-info");
const footerModal = document.querySelector(".footer-info")
const access = localStorage.getItem("accessgranted")
const gradeChart = document.querySelector(".students-grade")
const presentChart = document.querySelector(".students-present")
const rocChart = document.querySelector('.roc-earnings')
const input = document.querySelector(".myInput");
const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'orange', 'black', 'grey', 'darkblue', 'lightblue'];

let studentChart;
let label;
let data = [];
let labels = ['Period 1','Period 2','Period 3','Period 4'];
let datasets = [];

loggedIn()

function loggedIn() {
    if(access == 'true') {
      fetch("https://mbo-sd.nl/apiv2/student-grades")
      .then (thisData => thisData.json())
      .then (jsonData => studentsGrades(jsonData))
      const dropDown = `<a class="user-name" data-bs-toggle="dropdown">user2</a> <ul class="dropdown-menu">
      <li><a class="dropdown-item logout" onclick='logout()' href="/login.html">Log out</a></li>
    </ul>`
      document.querySelector(".dropdown").insertAdjacentHTML("beforeend", dropDown)
    }
    
    if (access == 'false') {
      headerModal.innerHTML = `Guest`
      bodyModal.innerHTML = `No information will be displayed. You will need to log in first. Click <a href="login.html">here</a> to login`
      footerModal.innerHTML = `Continue as guest`
      document.querySelector(".trigger-notloggedin").click()
      const dropDown = `<a class="user-name" href="/login.html">Login</a>`
      document.querySelector(".dropdown").insertAdjacentHTML("beforeend", dropDown)
    }
  }

function logout() {
  const authorized = false;
  localStorage.setItem("accessgranted", authorized)
}

function myFunction() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.querySelector(".myInput");
    filter = input.value.toUpperCase();
    ul = document.querySelector(".myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function studentsGrades(jsonData) {
  console.log(jsonData)
  for (let i = 0; i < jsonData.students.length; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.href = "#";
    a.textContent = jsonData.students[i].name;
    li.appendChild(a)
    li.addEventListener("click", function() {
      headerModal.innerHTML = jsonData.students[i].name
      bodyModal.innerHTML = `id : ${jsonData.students[i].id}<br><br>description : ${jsonData.students[i].description} <br><br> Email : ${jsonData.students[i].email} <br><br> Remember Token : ${jsonData.students[i].remember_token}`
      footerModal.innerHTML = `Go to user chart`
      document.querySelector(".trigger-notloggedin").click()
      fetchCourses().then(courses => showGradeChart(jsonData, jsonData.students[i].id, courses))
      document.querySelector(".d-id").innerHTML = `<b>Id:</b> ${jsonData.students[i].id}`
      document.querySelector(".d-name").innerHTML = `<b>Name:</b> ${jsonData.students[i].name}`
      document.querySelector(".d-email").innerHTML = `<b>Email:</b> ${jsonData.students[i].email}`
      document.querySelector(".d-token").innerHTML = `<b>Remember Token:</b> ${jsonData.students[i].remember_token}`
      document.querySelector(".position-fixed").textContent = ``
    })
    document.querySelector(".dropdown-menu").appendChild(li)
  }
  document.querySelector(".card-time").textContent = `Total students: ${jsonData.students.length}` 
  document.querySelector(".earnings").innerHTML = `Earnings: &euro; ${jsonData.students.length * 13}`
  document.querySelector(".submitted-work").textContent = `Submitted work: ${Math.round(jsonData.students.length / 13)}`
  document.querySelector(".review").textContent = `Projects to review: ${Math.round(jsonData.students.length / 13 - 50)}`
  createrocCard(jsonData.students.length)
  // console.log(jsonData.grades)
}
  function showGradeChart(jsonData, studentId, courses) {
    console.log(courses)
    const courseMap = new Map()
    let count = 0;
    for(key in jsonData.grades) {
      // console.log(jsonData.grades[key])
      for(let i = 0; i < jsonData.grades[key].length; i++) {
        // console.log(jsonData.grades[key][i])
        const course = jsonData.grades[key][i];
        if(key == studentId) {

        
        if (!courseMap.has(course.course_id)) {
          data = [];
          courseMap.set(course.course_id, createDatasetElement(getCourseName(course.course_id, courses), data, colors[count]))
          count++;
        }
        const dataSetElement = courseMap.get(course.course_id)
        // console.log(course.course_id)
        if (dataSetElement.data.length < 4) {
          dataSetElement.data.push(course.grade)
        }
          // labels.push(course.periode)
      }
      }
    }
    datasets = Array.from(courseMap.values())
    console.log(datasets)
    if (studentChart) {
      studentChart.destroy()
    }
    studentChart = createchart(datasets, labels)

  }

  async function fetchCourses() {
   let response = await fetch("https://mbo-sd.nl/apiv2/school-courses")
    let data = await response.json()
    return data;
}

function getCourseName(courseId, courses) {
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    if(course.id == courseId) {
      return course.name
    }
  }
}

  function createDatasetElement(label, data, color) {
  
    const dataElement = {
      label: label,
      backgroundColor: [
          color
        ],
      data: data,
      borderWidth: 1
    }
    return dataElement;
  } // for(let i = 0; i < jsonData.grades.length; i++) {
  

  //   }
  // }

function createchart(datasets, labels) {
    
    return new Chart(presentChart, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: datasets
          
        
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

function createrocCard(students) {
  const sad = Math.round(students / 6)
  const happy = Math.round(students / 2)
  const Neutral = Math.round(students / 3)
  new Chart(rocChart, {
    type: 'pie',
    data: {
        labels: ['Sad','Happy','Neutral'],
        datasets: [{
        label: 'Students: ',
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
        data: [sad, happy, Neutral],
        borderWidth: 1
      }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


