const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    window.location.href = "login.html";
}

const user_id = user.id;

function loadSaved() {

    fetch(`/api/products/saved/${user_id}`)
        .then(res => res.json())
        .then(data => {

            const container = document.getElementById('savedContainer');
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = "<p>No saved items</p>";
                return;
            }

            data.forEach(p => {

                const card = `
                <div class="col-md-4">
                    <div class="card shadow-sm">

                        <img src="/uploads/${p.image}" class="card-img-top">

                        <div class="card-body">
                            <h6>${p.title}</h6>
                            <small>${p.category}</small>
                            <h6 class="text-success mt-2">৳ ${p.price}</h6>

                            <div class="d-flex justify-content-between mt-3">
                                <a href="product-details.html?id=${p.id}"
                                   class="btn btn-outline-success btn-sm">
                                   View
                                </a>

                                <button class="btn btn-outline-danger btn-sm"
                                    onclick="unsave(${p.id})">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
                
                container.innerHTML += card;
            });
        });
}

function unsave(product_id) {

    fetch('/api/products/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, product_id })
    }).then(() => loadSaved());
}

loadSaved();