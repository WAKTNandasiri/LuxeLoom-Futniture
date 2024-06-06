let furnitureList = []
let user = {}


document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8080/api/v1/furniture/all')
        .then(response => response.json())
        .then(data => {
            furnitureList = data
            data.forEach(furniture => console.log(furniture))
            data.forEach(product => addProduct(product));
        })
        .catch(error => console.error('Error fetching products:', error));
});

$(document).ready(function() {
    $(".login-form").submit(function(event) {
        event.preventDefault();
        console.log("login");

        var email = $(".login-form input[name='email']").val();
        var password = $(".login-form input[name='password']").val();
        console.log(email + " " + password);
        login(email, password)
    });

    $(".register-form").submit(function (event) {
        event.preventDefault();
        var email = $(".register-form input[name='email']").val();
        var password = $(".register-form input[name='password']").val();
        console.log(email, password)
        register(email, password)
    })

    $('#cart-btn').click(function () {
        if(user) {
            handleUserCart(user.cart)
        }
    });

    if(localStorage.getItem('userId')){
        updateUser()
    }
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
    button.setAttribute('data-furniture-id', furniture.id);

    button.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        addToCart(furniture.id);
    });
    box.appendChild(button);
    boxContainer.appendChild(box);
}

function login(email, password) {
    $.ajax({
        url: "http://localhost:8080/api/v1/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email: email, password: password }),
        success: function (response) {
            console.log("Login successful", response);
            authenticateSuccessful(response)
        },
        error: function (xhr, status, error) {
            console.log("Login failed", status, error);
        }
    });
}

function register(email, password) {
    $.ajax({
        url: "http://localhost:8080/api/v1/user",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ email: email, password: password }),
        success: function (response) {
            console.log("Login successful", response);
            authenticateSuccessful(response)
        },
        error: function (xhr, status, error) {
            console.log("Login failed", status, error);
        }
    });
}

function authenticateSuccessful(response) {
    user = response
    localStorage.setItem("userId", response.id)
    document.querySelector('.account-form .register-form').classList.remove('active');
    document.querySelector('.account-form .login-form').classList.remove('active');
    // document.querySelector('.account-form .user-page').classList.add('active');
}

function addToCart(productId) {
    console.log(productId);
    $.ajax({
        url: 'http:/localhost:8080/api/v1/user/addToCart',
        type: 'POST',
        data: {
            userId: localStorage.getItem("userId"),
            productId: productId
        },
        success: function (response) {
            updateUser()
        },
        error: function (xhr, status, error) {
            console.error('Error fetching user:', status, error);
        }
    });
}

function updateUser() {
    $.ajax({
        url: 'http:/localhost:8080/api/v1/user',
        type: 'GET',
        data: {id: localStorage.getItem("userId")},
        success: function (response) {
            console.log("display cart", response)
            user = response
            handleUserCart(user.cart)
        },
        error: function (xhr, status, error) {
            console.error('Error fetching user:', status, error);
        }
    });
}

function handleUserCart(cart) {
    const cartItems = cart.map(furnitureId => {
        return furnitureList.find(item => item.id === furnitureId);
    }).filter(item => item !== undefined);

    displayCartItems(cartItems);
}

function removeFromCart(productId) {
    console.log(productId);
    $.ajax({
        url: 'http:/localhost:8080/api/v1/user/removeFromCart',
        type: 'POST',
        data: {
            userId: localStorage.getItem("userId"),
            productId: productId
        },
        success: function (response) {
            updateUser()
            typeof user.cart
            // handleUserCart(user.cart.filter(furnitureId => furnitureId !== productId));
        },
        error: function (xhr, status, error) {
            console.error('Error fetching user:', status, error);
        }
    });

}


function displayCartItems(cartItems) {
    const cartContainer = $('.cart-items-container');

    const cartItemsList = $('#cart-items-list');
    cartItemsList.empty(); // Clear the existing list

    // Populate the cart container with the cart items
    cartItems.forEach(item => {
        const cartItem = $('<div>').addClass('cart-item');

        const removeBtn = $('<span>').addClass('fas fa-times').click(() => removeFromCart(item.id));
        cartItem.append(removeBtn);

        const img = $('<img>').attr('src', item.imageUrls[0]).attr('alt', item.name);
        cartItem.append(img);

        const content = $('<div>').addClass('content');
        const title = $('<h3>').text(item.name);
        const price = $('<div>').addClass('price').text(`$${item.price.toFixed(2)}`);
        content.append(title).append(price);

        cartItem.append(content);

        cartItemsList.append(cartItem);
    });

    cartContainer.show();
}