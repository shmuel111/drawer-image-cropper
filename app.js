document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let corners = [];
    let img; // Declare img globally
    let dragIndex = -1;
    let offsetX = 0;
    let offsetY = 0;

    imageInput.addEventListener('change', handleImageUpload);
    document.getElementById('markCornersBtn').addEventListener('click', markCorners);
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
                markInitialCorners();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function markInitialCorners() {
        corners = [
            { x: 100, y: 100 },
            { x: img.width - 100, y: 100 },
            { x: img.width - 100, y: img.height - 100 },
            { x: 100, y: img.height - 100 }
        ];
        drawCorners();
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

    function detectCorners(event) {
        const rect = canvas.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        dragIndex = -1;
        corners.forEach((corner, index) => {
            if (Math.abs(corner.x - offsetX) < 10 && Math.abs(corner.y - offsetY) < 10) {
                dragIndex = index;
            }
        });
    }

    function startDragging(event) {
        detectCorners(event);
        if (dragIndex >= 0) {
            canvas.addEventListener('mousemove', dragCorner);
            canvas.addEventListener('mouseup', stopDragging);
        }
    }

    function dragCorner(event) {
        const rect = canvas.getBoundingClientRect();
        corners[dragIndex] = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        drawCorners();
    }

    function stopDragging() {
        canvas.removeEventListener('mousemove', dragCorner);
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

    canvas.addEventListener('mousedown', startDragging);
});
