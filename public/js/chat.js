// AUTH
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    alert("Login first!");
    window.location.href = "login.html";
}

const user_id = user.id;

let currentReceiver = null;
let currentProduct = null;


// AUTO OPEN FROM PRODUCT PAGE
const params = new URLSearchParams(window.location.search);
const product_id = params.get('product_id');

const receiver_id =
  params.get('seller_id') || params.get('receiver_id');

if (product_id && receiver_id) {
    currentProduct = product_id;
    currentReceiver = receiver_id;
    document.getElementById('chatUser').innerText = "Seller";
    loadMessages();
}



function loadConversations() {

    fetch(`/api/messages/conversations/${user_id}`)
        .then(res => res.json())
        .then(data => {

            const list = document.getElementById('conversationList');
            list.innerHTML = '';

            if (data.length === 0) {
                list.innerHTML = "<p class='text-muted p-2'>No messages yet</p>";
                return;
            }

            data.forEach(c => {

                const item = `
                    <div class="conversation"
                        onclick="openChat(
                            ${c.chat_user_id},
                            ${c.product_id},
                            '${c.chat_user_name}'
                        )">

                        <strong>${c.chat_user_name}</strong><br>
                        <small>${c.title}</small>
                    </div>
                `;

                list.innerHTML += item;
            });
        });
}



function openChat(receiver, product, name) {

    currentReceiver = receiver;
    currentProduct = product;

    document.getElementById('chatUser').innerText = name;

    loadMessages();
}



function loadMessages() {

    if (!currentProduct) return;

    fetch(`/api/messages?user_id=${user_id}&product_id=${currentProduct}`)
        .then(res => res.json())
        .then(data => {

            const box = document.getElementById('chatBox');
            box.innerHTML = '';

            data.forEach(msg => {

                const cls = msg.sender_id == user_id ? 'sent' : 'received';

                box.innerHTML += `
                    <div class="message ${cls}">
                        ${msg.message}
                    </div>
                `;
            });

            box.scrollTop = box.scrollHeight;
        });

      
fetch('/api/messages/read', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        user_id: user_id,
        product_id: currentProduct,
        sender_id: currentReceiver
    })
});  
}

function loadNotificationCount() {

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    fetch(`/api/messages/unread/${user.id}`)
        .then(res => res.json())
        .then(data => {

            const badge = document.querySelector('.badge-notify');

            if (!badge) return;

            if (data.total > 0) {
                badge.innerText = data.total;
                badge.style.display = "inline-block";
            } else {
                badge.style.display = "none";
            }
        });
}



function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text) return;

    
    if (!currentReceiver || !currentProduct) {
        alert("Chat not ready");
        return;
    }

    fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sender_id: user_id,
            receiver_id: currentReceiver,
            product_id: currentProduct,
            message: text
        })
    }).then(() => {
        input.value = '';
        loadMessages();
        loadConversations();
    });
}



loadConversations();