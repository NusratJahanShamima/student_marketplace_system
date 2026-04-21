
function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}

const params = new URLSearchParams(window.location.search);
const category = params.get('category');
const search = params.get('search');


let url = '/api/products';

let query = [];

if (category) query.push(`category=${encodeURIComponent(category)}`);
if (search) query.push(`search=${encodeURIComponent(search)}`);

if (query.length > 0) {
    url += '?' + query.join('&');
}


//FETCH 
fetch(url)
    .then(res => res.json())
    .then(data => {

        const container = document.getElementById('productList');
        container.innerHTML = '';

        if (data.length === 0) {
            container.innerHTML = "<p>No products found</p>";
            return;
        }

        data.forEach(product => {

            const user = getUser();

            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm h-100">

                        <img src="/uploads/${product.image}" class="card-img-top">

                        <div class="card-body d-flex flex-column">

                            <h5>${product.title}</h5>
                            <p class="text-muted">${product.category}</p>
                            <h6 class="text-success">৳ ${product.price}</h6>

                            <div class="mt-auto d-flex flex-column gap-2">

                                <a href="product-details.html?id=${product.id}"
                                   class="btn btn-outline-success w-100">
                                   View Details
                                </a>

                                <button onclick="contactSeller(${product.id}, ${product.seller_id})"
                                        class="btn btn-success w-100">
                                    Contact Seller
                                </button>

                                ${
                                    user ? `
                                    <button onclick="saveProduct(${product.id})"
                                            class="btn btn-outline-success w-100">
                                        Save
                                    </button>
                                    ` : ''
                                }

                            </div>

                        </div>

                    </div>
                </div>
            `;

            container.innerHTML += card;
        });

    })
    .catch(err => console.log(err));


//CONTACT
function contactSeller(productId, sellerId) {

    const user = getUser();

    if (!user) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    window.location.href = `chat.html?product_id=${productId}&seller_id=${sellerId}`;
}


//SAVE
function saveProduct(productId) {

    const user = getUser();

    if (!user) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    fetch('/api/products/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: user.id,
            product_id: productId
        })
    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {
            alert("Saved!");
        } else {
            alert(data.message || "Failed");
        }

    })
    .catch(err => console.log(err));
}


// SEARCH
const form = document.getElementById('searchForm');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const value = document.getElementById('searchInput').value.trim();

        if (value) {
            window.location.href = `products.html?search=${encodeURIComponent(value)}`;
        }
    });
}