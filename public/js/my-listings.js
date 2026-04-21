const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    window.location.href = "login.html";
}

const user_id = user.id;

function loadListings() {

    fetch(`/api/products?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById('listingContainer');
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = "<p>No products yet</p>";
                return;
            }

            data.forEach(p => {

                const card = `
                <div class="col-md-4">
                    <div class="card shadow-sm">

                        <img src="/uploads/${p.image}" class="card-img-top">

                        <div class="card-body">
                            <h6>${p.title}</h6>
                            <small class="text-muted">${p.category}</small>
                            <h6 class="text-success mt-2">৳ ${p.price}</h6>

                            <div class="d-flex justify-content-between mt-3">
                                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">
                                    <i class="bi bi-trash"></i>
                                </button>

                                <a href="product-details.html?id=${p.id}" class="btn btn-sm btn-outline-success">
                                    View
                                </a>
                            </div>
                        </div>

                    </div>
                </div>`;
                container.innerHTML += card;
            });
        });
}

function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    fetch(`/api/products/${id}`, {
        method: "DELETE"
    }).then(() => loadListings());
}

loadListings();