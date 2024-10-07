const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
//console.log(menu);

let cart = [];

//abrir o modal do carrinho de compras
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  //alert('Você está tentando fechar o modal');
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    // Adicionar no carrinho de compras
    addToCart(name, price);
  }
});

// Função adicionar no carrinho de compras
function addToCart(name, price) {
  //alert("O item é " + name);
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    //Verifica se o item já existe e incrementa a quantidade
    existingItem.quantity += 1;
    //return;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartModal();
}

// Atualiza carrinho de compras
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");

    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
        <div>
        <p class="font-medium">Produto: ${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        
        <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
        </button>
        
        </div>
        `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerText = cart.length;
}

// remover item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    //console.log(name);
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    //console.log(item);
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

// endereco funcao
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("boder-red-500");
    addressWarn.classList.add("hidden");
  }
  //
});

// finalizar pedido
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    //alert("O RESTAURANTE BURGUER ESTÁ FEFCHADO NO MOEMENTO!");

    Toastify({
      text: "O RESTAURANTE BURGUER ESTÁ FEFCHADO NO MOEMENTO!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444"
      }
    }).showToast();

    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  // enviar o pedido
  const cartItems = cart
    .map(item => {
      return `
      Burguer: ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |
      `;
    })
    .join("");

  //console.log(cartItems);
  const message = encodeURIComponent(cartItems);
  const phone = "94991790035";
  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );
  cart = [];
  updateCartModal();
});

// verificar a hora e manipular o card horario
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 18;
  // true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
