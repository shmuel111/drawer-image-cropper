document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let corners = [];
    let width = 0;
    let height = 0;
    let img; // Declare img globally
    let drag = false; // Flag to track dragging

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
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function markCorners() {
        // Clear previous corners
        corners = [];

        // Add four corners based on mouse click positions
        canvas.addEventListener('mousedown', startDrag);
        canvas.addEventListener('mousemove', dragCorner);
        canvas.addEventListener('mouseup', endDrag);

        function startDrag(event) {
            drag = true;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            corners.push({ x, y });
        }

        function dragCorner(event) {
            if (drag) {
                const rect = canvas.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                corners[corners.length - 1] = { x, y };
                drawCorners();
            }
        }

        function endDrag() {
            drag = false;
        }
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

        // Calculate the crop area based on the marked corners
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
 
