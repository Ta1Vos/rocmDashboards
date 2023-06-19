const sidebar = document.querySelector('.sidebar-js');
const sidebarHitbox = document.querySelector('.sidebar-hitbox');
const sidebarButton = document.querySelector('.sidebar-button');

let toggled = false;

function validateElements() {
    console.log(`validate`)
    if (!sidebar) {
        console.error(`Sidebar has not been found, further action will not be taken. Current selected element: ${sidebar}`);
    } else {
        if (!sidebarHitbox) {
            console.error(`Sidebar toggle has not been found, unable to initiate navbar. Current selected element: ${sidebar}`);
        } else {
            console.log(`success!`)
            loadSidebar();
        }
    }
}

function loadSidebar() {
    sidebarHitbox.addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
    sidebar.classList.toggle('sidebar-toggled');
    // sidebarButton.classList.toggle('turn-around');

    if (toggled == false) {
        toggled = true;

        sidebarHitbox.innerHTML = `<i class="sidebar-button bi bi-caret-left-fill fs-3"></i>`;
    } else {
        toggled = false;

        sidebarHitbox.innerHTML = `<i class="sidebar-button bi bi-caret-right-fill fs-3"></i>`;
    }
}

validateElements();