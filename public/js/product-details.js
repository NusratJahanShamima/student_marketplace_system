
function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}


const params = new URLSearchParams(window.location.search);
const id = params.get('id');


fetch(`/api/products/${id}`)
    .then(res => res.json())
    .then(product => {

        const user = getUser(); 

        const container = document.getElementById('productDetails');

        container.innerHTML = `
            <div class="row">

                <div class="col-md-6">
                    <img src="/uploads/${product.image}" class="product-img">
                </div>

                <div class="col-md-6">

                    <h2>${product.title}</h2>
                    <p class="text-muted">${product.category}</p>
                    <h4 class="text-success">৳ ${product.price}</h4>

                    <p class="mt-3">${product.description}</p>

                    <hr>

                    <p>
                        <strong>Posted on:</strong><br>
                        ${new Date(product.created_at).toLocaleString()}
                    </p>

                    <div class="d-flex gap-2 mt-3">

                        <button id="contactBtn" class="btn btn-success">
                            <i class="bi bi-chat-dots"></i> Contact Seller
                        </button>

                        ${
                            user ? `
                            <button id="saveBtn" class="btn btn-outline-success">
                                <i class="bi bi-bookmark"></i> Save
                            </button>
                            ` : ''
                        }

                    </div>

                </div>
            </div>
        `;

        setupContactButton(product);
        if (user) setupSaveButton(product.id);
    });



function setupContactButton(product) {

    const btn = document.getElementById('contactBtn');

    btn.addEventListener('click', () => {

        const user = getUser(); 

        if (!user) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        
       window.location.href =
  `chat.html?product_id=${id}&seller_id=${product.seller_id}`;
    });
}


//SAVE BUTTON
function setupSaveButton(product_id) {

    const btn = document.getElementById('saveBtn');

    btn.addEventListener('click', () => {

        const user = getUser(); 

        if (!user) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        const user_id = user.id;

        // UNSAVE
        if (btn.classList.contains('btn-success')) {

            fetch('/api/products/unsave', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ user_id, product_id })
            })
            .then(res => res.json())
            .then(() => {
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-success');
                btn.innerHTML = '<i class="bi bi-bookmark"></i> Save';
            });

        } 
        // SAVE
        else {

            fetch('/api/products/save', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ user_id, product_id })
            })
            .then(res => res.json())
            .then(() => {
                btn.classList.remove('btn-outline-success');
                btn.classList.add('btn-success');
                btn.innerHTML = '<i class="bi bi-bookmark-fill"></i> Saved';
            });

        }

    });
}