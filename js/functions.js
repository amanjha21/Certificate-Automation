//Functions
function drawTextAt(x, y, text, family, size, color, selected) {
  ctx.font = `${size} ${family}`;
  ctx.fillStyle = color;
  if (selected) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.strokeText(text, x, y);
  }
  ctx.fillText(text, x, y);
}
function drawText(list) {
  list.map((e, index) => {
    if (activeText == index)
      drawTextAt(e.x, e.y, e.text, e.fontFamily, e.fontSize, e.fontColor, 1);
    else drawTextAt(e.x, e.y, e.text, e.fontFamily, e.fontSize, e.fontColor);
  });
}
function draw() {
  if (!img.height || !img.width) return;
  canvas.width =
    (1 - Math.abs(canvas.height - img.height) / img.height) * img.width;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  drawText(textWithPosition);
  if (activeText >= 0) {
    document.getElementById("delete").disabled = false;
    document.getElementById("update").disabled = false;
    document.getElementById("add").disabled = true;
  } else {
    document.getElementById("delete").disabled = true;
    document.getElementById("update").disabled = true;
    document.getElementById("add").disabled = false;
  }
}
function handleMouseDown(e) {
  e.preventDefault();
  x = parseInt(e.pageX - canvas.offsetLeft);
  y = parseInt(e.pageY - canvas.offsetTop);
  //   console.log(e.pageX, e.pageY, canvas.offsetLeft, canvas.offsetTop);

  //select the text at the clicked area
  for (let i = 0; i < textWithPosition.length; i++) {
    let text = textWithPosition[i];
    // console.log(x, text.x, y, text.y, text.width, text.height);
    if (
      x >= text.x &&
      x <= text.x + text.width * 3 &&
      y >= text.y - text.height &&
      y <= text.y
    ) {
      selectedText = i;
      activeText = i;
      //fill font properties to UI
      document.getElementById("fontfamily").value = text.fontFamily;
      document.getElementById("fontsize").value = text.fontSize;
      document.getElementById("fontcolor").value = text.fontColor;
      document.getElementById("addtext").value = text.text;
      draw();
      //   console.log(i, "yes");
      return;
    } else {
      activeText = -1;
      document.getElementById("fontfamily").value = "";
      document.getElementById("fontsize").value = "";
      document.getElementById("fontcolor").value = "";
      document.getElementById("addtext").value = "";
      draw();
    }
  }
}
function handleMouseUp(e) {
  e.preventDefault();
  selectedText = -1;
}
function handleMouseOut(e) {
  e.preventDefault();
  selectedText = -1;
}
function handleMouseMove(e) {
  if (selectedText < 0) {
    return;
  }
  e.preventDefault();
  let mouseX = parseInt(e.pageX - canvas.offsetLeft);
  let mouseY = parseInt(e.pageY - canvas.offsetTop);
  let dx = mouseX - x;
  let dy = mouseY - y;
  x = mouseX;
  y = mouseY;
  let text = textWithPosition[selectedText];
  text.x += dx;
  text.y += dy;
  draw();
}
function addText() {
  let textvalue = document.getElementById("addtext").value;
  if (!textvalue) return;
  let fontFamily =
    document.getElementById("fontfamily").value || "Euphoria Script";
  let fontSize = document.getElementById("fontsize").value || "40px";
  let fontColor = document.getElementById("fontcolor").value || "black";
  textWithPosition.push({
    x: canvas.width / 2,
    y: canvas.height / 2,
    text: textvalue,
    width: ctx.measureText(textvalue).width,
    height: parseInt(fontSize, 10) / 2,
    fontFamily,
    fontSize,
    fontColor,
  });
  activeText = textWithPosition.length - 1;
  document.getElementById("addtext").value = "";
  draw();
}
function deleteText() {
  if (activeText >= 0) {
    textWithPosition.splice(activeText, 1);
    activeText = -1;
    draw();
  }
}
function update() {
  if (activeText < 0) return;
  let addText = document.getElementById("addtext").value;
  if (!addText) {
    alert("Text field is required!!!");
    return;
  } else {
    let text = textWithPosition[activeText];
    text.text = addText;
    text.fontFamily =
      document.getElementById("fontfamily").value || "Euphoria Script";
    text.fontSize = document.getElementById("fontsize").value || "40px";
    text.fontColor = document.getElementById("fontcolor").value || "black";
    text.width = ctx.measureText(text.text).width;
    text.height = parseInt(text.fontSize, 10) / 2;
    draw();
  }
}
function download(fileName) {
  activeText = -1;
  draw();
  let link = document.createElement("a");
  link.download = fileName || "Image.png";
  link.href = canvas.toDataURL();
  link.click();
}
function loadFont() {
  let fontLink = prompt("Link of your font:- ");
  if (!fontLink) return;
  var newFont = document.createElement("link");
  newFont.setAttribute("rel", "stylesheet");
  newFont.setAttribute("type", "text/css");
  newFont.setAttribute("href", fontLink);
  document.head.appendChild(newFont);
}
function downloadAll() {
  if (!textWithPosition) return;
  if (!excelColumns) return;
  //change ui
  document.querySelector("canvas").classList.add("hidden");
  document.getElementById("container").classList.add("hidden");
  document.getElementById("downloading").classList.remove("hidden");
  let positionData = textWithPosition;
  //start downloading
  excelData.map((data) => {
    textWithPosition = [];
    positionData.map((position) => {
      let text = data[position.text];
      textWithPosition.push({
        x: position.x,
        y: position.y,
        text,
        width: ctx.measureText(text).width,
        height: parseInt(position.fontSize, 10) / 2,
        fontFamily: position.fontFamily,
        fontSize: position.fontSize,
        fontColor: position.fontColor,
      });
    });
    download(`${data.Name}'s Certificate.png`);
  });
  //download complete change ui
  document.getElementById("downloading").style.backgroundImage =
    "url('.././images/complete.png')";
}
function reload() {
  window.location.href = "index.html";
}
