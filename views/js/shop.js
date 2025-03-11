import { GeneratePdf } from "./app.js"; // Ensure app.js correctly exports GeneratePdf

// Product List (Using Walmart Products)
const products = [
  {
    image: "../images/n1.jpg", // Ensure correct image path
    alt: "Fresh Tomatoes * 1lb",
    name: "Fresh Tomatoes",
    price: 5.99,
  },
  {
    image: "../images/n2.jpg", // Ensure correct image path
    alt: "Fresh Avocados * 1lb",
    name: "Fresh Avocados",
    price: 6.99,
  },
];

const cartProducts = [];

// Render Product List
const productList = document.getElementById("productList");
productList.innerHTML = ""; // Clear existing content before rendering

products.forEach((product, index) => {
  productList.innerHTML += `
    <div class="product">
      <img src="${product.image}" alt="${product.alt}">
      <div class="productDesc">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="cartAdd btn" data-index="${index}">Add to Cart</button>
      </div>
    </div>
  `;
});

// Add event listeners for "Add to Cart" buttons
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cartAdd").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      addToCart(products[index]);
      updateCartDisplay();
    });
  });
});

// Function to add product to cart
function addToCart(product) {
  cartProducts.push(product);
}

// Function to update cart display
function updateCartDisplay() {
  const cart = document.getElementById("cart");
  cart.innerHTML = ""; // Clear existing cart content

  cartProducts.forEach((product) => {
    cart.innerHTML += `
      <div class="cart-item">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
      </div>
    `;
  });

  document.getElementById("total").innerHTML = `<h2>Total: $${calculateTotal().toFixed(2)}</h2>`;
}

// Function to calculate total price
function calculateTotal() {
  return cartProducts.reduce((sum, product) => sum + product.price, 0);
}

// Invoice Class extending GeneratePdf
class Invoice extends GeneratePdf {
  printItems() {
    cartProducts.forEach((product) => {
      this.addText(`${product.name} - $${product.price.toFixed(2)}`);
    });
  }

  printTotal() {
    this.addText(`Total: $${calculateTotal().toFixed(2)}`);
  }
}

// Event Listener for "View Invoice"
document.getElementById("view").addEventListener("click", generateInvoice);

// Function to generate and display invoice
function generateInvoice() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString();

  let invCont = document.getElementById("invoiceCont");
  if (!document.getElementById("invoice")) {
    invCont.innerHTML = `<iframe id="invoice" src="" frameborder="0"></iframe>`;
  }

  const myPDF = new Invoice("invoice");
  myPDF.addHeader("Invoice - Walmart");
  myPDF.addText(`Date: ${formattedDate}`);
  myPDF.printItems();
  myPDF.printTotal();
  myPDF.showPdf();
}

// Event Listener for "Download Invoice"
document.getElementById("download").addEventListener("click", function () {
  const myPDF = new Invoice("invoice");
  myPDF.addHeader("Invoice - Walmart");
  myPDF.printItems();
  myPDF.printTotal();
  myPDF.downloadPdf();
});
