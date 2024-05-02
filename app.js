document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let corners = [];
    let width = 0;
    let height = 0;
    let img; // Declare img globally

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
        // Logic to allow user to mark corners on the canvas
        // For simplicity, let's draw four circles at hardcoded positions
        corners = [
            { x: 100, y: 100 },
            { x: 300, y: 100 },
            { x: 300, y: 300 },
            { x: 100, y: 300 }
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

    function cropImage() {
        // Crop image logic
    }
});
