document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let corners = [];
    let img; // Declare img globally
    let isDragging = false;
    let dragIndex = -1;
    let offsetX = 0;
    let offsetY = 0;

    imageInput.addEventListener('change', handleImageUpload);
    document.getElementById('markCornersBtn').addEventListener('click', initializeCorners);
    document.getElementById('cropBtn').addEventListener('click', cropImage);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function initializeCorners() {
        const rect = canvas.getBoundingClientRect();
        const minX = rect.left;
        const minY = rect.top;
        const maxX = rect.right;
        const maxY = rect.bottom;

        corners = [
            { x: minX, y: minY },
            { x: maxX, y: minY },
            { x: maxX, y: maxY },
            { x: minX, y: maxY }
        ];

        drawCorners();
        addEventListeners();
    }

    function addEventListeners() {
        canvas.addEventListener('mousedown', startDragging);
        canvas.addEventListener('mousemove', dragCorner);
        canvas.addEventListener('mouseup', stopDragging);
        canvas.addEventListener('mouseleave', stopDragging);
    }

    function startDragging(event) {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        dragIndex = getDragIndex(offsetX, offsetY);
    }

    function dragCorner(event) {
        if (isDragging && dragIndex >= 0) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            corners[dragIndex] = { x, y };
            drawCorners();
        }
    }

    function stopDragging() {
        isDragging = false;
        dragIndex = -1;
    }

    function getDragIndex(x, y) {
        for (let i = 0; i < corners.length; i++) {
            const corner = corners[i];
            if (Math.abs(x - corner.x) < 10 && Math.abs(y - corner.y) < 10) {
                return i;
            }
        }
        return -1;
    }

    function drawCorners() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

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
