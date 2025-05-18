const lightBtn = document.querySelector(".light");
const darkBtn = document.querySelector(".dark");

lightBtn.addEventListener("click", () => {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
});

darkBtn.addEventListener("click", () => {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
});
