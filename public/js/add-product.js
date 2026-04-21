const form = document.getElementById('addProductForm');

const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    window.location.href = "login.html";
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('title', document.getElementById('title').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('seller_id', user.id);

    // FILE
    formData.append('image', document.getElementById('image').files[0]);

    const res = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        body: formData
    });

    const data = await res.json();

    if (data.success) {
        alert("Product Added!");
        window.location.href = "seller-dashboard.html";
    } else {
        alert("Upload failed");
    }
});












