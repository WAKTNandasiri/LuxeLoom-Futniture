document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8080/api/v1/furniture/all')
        .then(response => response.json())
        .then(data => {
            data.forEach(furniture => console.log(furniture))
            data.forEach(product => addProduct(product));
        })
        .catch(error => console.error('Error fetching products:', error));
});

function addProduct(furniture) {
    const productSection = document.querySelector('#product');
    const boxContainer = productSection.querySelector('.box-container');

    const box = document.createElement('div');
    box.className = 'box';

    const heartLink = document.createElement('a');
    heartLink.href = '#';
    heartLink.className = 'fas fa-heart';
    box.appendChild(heartLink);

    const eyeLink = document.createElement('a');
    eyeLink.href = '#';
    eyeLink.className = 'fas fa-eye';
    box.appendChild(eyeLink);

    const img = document.createElement('img');
    img.src = furniture.imageUrls[0];
    img.alt = furniture.title;
    box.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = furniture.name;
    box.appendChild(title);

    const stars = document.createElement('div');
    stars.className = 'stars';

    for (let i = 0; i < Math.floor(furniture.rating); i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        stars.appendChild(star);
    }

    if (furniture.stars % 1 !== 0) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        stars.appendChild(halfStar);
    }

    box.appendChild(stars);

    const discountedPrice = furniture.price * (100 - furniture.discount) / 100;

    const price = document.createElement('div');
    price.className = 'price';
    price.innerHTML = `$${ (discountedPrice.toFixed(2) )} <span>$${furniture.price.toFixed(2)}</span>`;
    box.appendChild(price);

    const button = document.createElement('a');
    button.href = '#';
    button.className = 'btn';
    button.textContent = 'add to cart';
    box.appendChild(button);

    boxContainer.appendChild(box);

}