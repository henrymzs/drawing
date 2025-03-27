let isDrawing = false;
let startX = 0;
let startY = 0;
let initialImageData;

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const selectTool = document.getElementById("tool");
const selectedColor = document.getElementById("drawColor");
const clearCanvasBtn = document.getElementById("clearCanvas");

let currentTool = selectTool.value;
let color = selectedColor.value;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

selectedColor.addEventListener("input", () => {
    color = selectedColor.value;
});

selectTool.addEventListener("change", () => {
    currentTool = selectTool.value;
});

clearCanvasBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);

function startDrawing(e) {
    ctx.lineWidth = 5;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    startX = e.offsetX;
    startY = e.offsetY;
    isDrawing = true;
    ctx.beginPath();
    
    initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawing(e) {
    if (!isDrawing) return;

    ctx.putImageData(initialImageData, 0, 0);

    switch (currentTool) {
        case "freehand":
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            break;

        case "rectangle":
            let width = e.offsetX - startX;
            let height = e.offsetY - startY;
            ctx.strokeRect(startX, startY, width, height);
            break;

        case "circle":
            let radius = Math.sqrt((e.offsetX - startX) ** 2 + (e.offsetY - startY) ** 2);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;

        case "eraser":
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
            break;
    }
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
}
