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
        // Clear previous corners
        corners = [];

        // Add four corners based on mouse click positions
        canvas.addEventListener('click', addCorner);

        function addCorner(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            corners.push({ x, y });

            if (corners.length === 4) {
                canvas.removeEventListener('click', addCorner); // Stop listening for clicks
                drawCorners();
            }
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
        // Crop image logic
    }
});
