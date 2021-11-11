const canvas = document.querySelector("canvas");
const form1 = document.getElementById("form1");
const ctx = canvas.getContext("2d");
let textWithPosition = [];
let selectedText = -1;
let activeText = -1;
let image = document.getElementById("bgimage");
let excel = document.getElementById("excelfile");
let img = new Image();
let x, y;
let excelColumns = [];
let excelData = [];
// Event Listeners
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
  }
});
excel.addEventListener("change", function () {
  excelFile = excel.files[0];
  if (excelFile) {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(excelFile);
    document.getElementById("submit").disabled = true;
    fileReader.addEventListener("load", function (e) {
      let data = e.target.result;
      let workbook = XLSX.read(data, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        excelData = rowObject;
        excelColumns = Object.keys(rowObject[0]);
        document.getElementById("submit").disabled = false;
      });
    });
    document.getElementById("excelUploader").innerHTML = excel.value.replace(
      /.*[\/\\]/,
      ""
    );
    document.getElementById("excelUploader").style.backgroundImage = "none";
  }
});
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  file = image.files[0];
  excelFile = excel.files[0];
  if (file && excelFile) {
    document.querySelector("canvas").classList.remove("hidden");
    form1.classList.add("hidden");
    document.getElementById("form2").classList.remove("hidden");
    draw();
    document.getElementById("addtext").innerHTML = "";
    excelColumns.forEach((column) => {
      document.getElementById(
        "addtext"
      ).innerHTML += `<option value = '${column}'>${column}</option>`;
    });
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
