const containers = document.querySelectorAll(".customs");
const expandedContainers = document.querySelectorAll(".expanded-container");

containers.forEach(function(container, index) {
  container.addEventListener("click", function() {
    expandedContainers[index].classList.toggle("expand");
  });
});


