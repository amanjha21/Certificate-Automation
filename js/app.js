const canvas = document.querySelector("canvas");
const form1 = document.getElementById("form1");
const ctx = canvas.getContext("2d");
let textWithPosition = [];
let selectedText = -1;
let activeText = -1;

let image = document.getElementById("bgimage");
let img = new Image();
let x, y;

//Event Listeners
image.addEventListener("change", function () {
  file = image.files[0];
  if (file) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", function () {
      img.src = this.result;
    });
    document.getElementById("fileUploader").innerHTML = image.value.replace(
      /.*[\/\\]/,
      ""
    );
    document.getElementById("fileUploader").style.backgroundImage = "none";
    document.getElementById("fileUploader").style.height = "30vh";
    document.getElementById("submit").classList.remove("hidden");
  }
});
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  file = image.files[0];
  if (file) {
    document.querySelector("canvas").classList.remove("hidden");
    draw();
    form1.classList.add("hidden");
    document.getElementById("form2").classList.remove("hidden");
  }
});
canvas.addEventListener("mousedown", (e) => {
  handleMouseDown(e);
});
canvas.addEventListener("mouseup", (e) => {
  handleMouseUp(e);
});
canvas.addEventListener("mouseout", (e) => {
  handleMouseOut(e);
});
canvas.addEventListener("mousemove", (e) => {
  handleMouseMove(e);
});
