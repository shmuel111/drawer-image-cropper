document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const canvasWidth = 960;
    const canvasHeight = 600;
    const rectangleWidth = 860;
    const rectangleHeight = 500;
    const rectangleX = (canvasWidth - rectangleWidth) / 2;
    const rectangleY = (canvasHeight - rectangleHeight) / 2;
    let corners = [];
    let img; // Declare img globally
    let isDragging = false;
    let dragIndex = -1;
    let offsetX = 0;
    let offsetY = 0;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    imageInput.addEventListener('change', handleImageUpload);
    canvas.addEventListener('mousedown', startDragging);
    canvas.addEventListener('mousemove', dragCorner);
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseleave', stopDragging);
    document.getElementById('cropBtn').addEventListener('click', cropImage);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            img = new Image();
            img.onload = function() {
                const scaleFactor = Math.min(canvasWidth / img.width, canvasHeight / img.height);
                const scaledWidth = img.width * scaleFactor;
                const scaledHeight = img.height * scaleFactor;
                const offsetX = (canvasWidth - scaledWidth) / 2;
                const offsetY = (canvasHeight - scaledHeight) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
                markInitialRectangle();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function markInitialRectangle() {
        corners = [
            { x: rectangleX, y: rectangleY },
            { x: rectangleX + rectangleWidth, y: rectangleY },
            { x: rectangleX + rectangleWidth, y: rectangleY + rectangleHeight },
            { x: rectangleX, y: rectangleY + rectangleHeight }
        ];

        drawCorners();
    }

    function startDragging(event) {
        const rect = canvas.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        corners.forEach((corner, index) => {
            if (offsetX >= corner.x - 5 && offsetX <= corner.x + 5 &&
                offsetY >= corner.y - 5 && offsetY <= corner.y + 5) {
                isDragging = true;
                dragIndex = index;
            }
        });
    }

    function dragCorner(event) {
        if (isDragging && dragIndex >= 0) {
            const rect = canvas.getBoundingClientRect();
            corners[dragIndex] = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            drawCorners();
        }
    }

    function stopDragging() {
        isDragging = false;
        dragIndex = -1;
    }

    function drawCorners() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        corners.forEach(corner => {
            ctx.lineTo(corner.x, corner.y);
        });
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = 'red';
        corners.forEach(corner => {
            ctx.beginPath();
            ctx.arc(corner.x, corner.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function cropImage() {
        if (corners.length !== 4) {
            alert('Please mark all four corners before cropping.');
            return;
        }

        // Calculate crop area based on marked corners
        const minX = Math.min(...corners.map(corner => corner.x));
        const minY = Math.min(...corners.map(corner => corner.y));
        const maxX = Math.max(...corners.map(corner => corner.x));
        const maxY = Math.max(...corners.map(corner => corner.y));
        const cropWidth = maxX - minX;
        const cropHeight = maxY - minY;

        // Create a new canvas to hold the cropped image
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        // Draw the cropped image onto the new canvas
        croppedCtx.drawImage(img, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        // Display the cropped image on the main canvas
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        ctx.drawImage(croppedCanvas, 0, 0);
    }
});
