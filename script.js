const menuOpenbutton = document.querySelector("#menu-open-button");
const menuClosebutton = document.querySelector("#menu-close-button");

menuOpenbutton.addEventListener("click", () => {
    document.body.classList.toggle("show-mobile-menu");
});

//Cerror con click
menuClosebutton.addEventListener("click", () => menuOpenbutton.click(
));



