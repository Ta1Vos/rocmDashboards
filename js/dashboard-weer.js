const ctx = document.querySelector(".my-chart");
const chartOne = document.querySelector(".chart-one");
const chartTwo = document.querySelector(".chart-two");
const chartThree = document.querySelector(".chart-three");
const chartFour = document.querySelector(".chart-four");

new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

new Chart(chartOne, {
  type: "doughnut",
  data: {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  },
});


const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
new Chart(chartTwo, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  },
});
