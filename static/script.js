function createCardElement(p) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <div class="price">${p.price} MDL</div>
        <button onclick="deleteProduct(${p.id})">Удалить</button>
    `;
    return card;
}

async function loadProducts() {
    try {
        const res = await fetch('/products');
        if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
        const data = await res.json();
        const container = document.getElementById('productList');
        container.innerHTML = '';
        data.forEach(p => {
            const card = createCardElement(p);
            container.appendChild(card);
        });
    } catch (e) {
        alert(e.message);
    }
}

async function addOrUpdateProduct() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value.trim();
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').value.trim();

    if (!name || !price || !image) {
        alert('Заполните все поля!');
        return;
    }

    const payload = JSON.stringify({ name, price, image });
    const url = id ? `/products/${id}` : '/products';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });
        if (!res.ok) throw new Error('Ошибка при сохранении!');

        document.getElementById('id').value = '';
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';
        document.getElementById('image').value = '';

        loadProducts();
    } catch (e) {
        alert(e.message);
    }
}

async function deleteProduct(id) {
    try {
        const res = await fetch(`/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Ошибка при удалении!');
        loadProducts();
    } catch (e) {
        alert(e.message);
    }
}

window.onload = loadProducts;
