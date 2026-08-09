/* 
   DASHBOARD - MENU
 */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuToggle =
    document.getElementById("menuToggle");

const sidebarClose =
    document.getElementById("sidebarClose");


/* 
   ABRIR MENU
 */

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            sidebar.classList.add("open");

            sidebarOverlay.classList.add("active");

        }
    );

}


/* 
   FECHAR MENU
 */

function closeSidebar() {

    if (!sidebar) {
        return;
    }

    sidebar.classList.remove("open");

    sidebarOverlay.classList.remove("active");

}


if (sidebarClose) {

    sidebarClose.addEventListener(
        "click",
        closeSidebar
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );

}


/* =========================================================
   FECHAR AO CLICAR EM UM LINK NO MOBILE
========================================================= */

const sidebarLinks =
    document.querySelectorAll(
        ".sidebar .nav-item"
    );


sidebarLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            if (
                window.innerWidth <= 1000
            ) {

                closeSidebar();

            }

        }
    );

});