import { GeneratePdf } from "./app.js"; // Import from app.js

document.addEventListener("DOMContentLoaded", function () {
  const products = [
    {
      image: "images/n1.jpg",
      alt: "Fresh Tomatoes * 1lb",
      name: "Fresh Tomatoes",
      price: 5.99,
    },
    {
      image: "images/n2.jpg",
      alt: "Fresh Avocados * 1lb",
      name: "Fresh Avocados",
      price: 6.99,
    },
  ];

  const cartProducts = [];

  // Render Product List
  const productList = document.getElementById("productList");
  productList.innerHTML = "";

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

  document.querySelectorAll(".cartAdd").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      addToCart(products[index]);
    });
  });

  function addToCart(product) {
    cartProducts.push(product);
    updateCartDisplay();
    updateButtonState();
  }

  function updateCartDisplay() {
    const cart = document.getElementById("cart");
    cart.innerHTML = "";

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

  function calculateTotal() {
    return cartProducts.reduce((sum, product) => sum + product.price, 0);
  }

  function updateButtonState() {
    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const hasItems = cartProducts.length > 0;
    const isValid = name !== "" && email !== "";

    document.getElementById("view").disabled = !(hasItems && isValid);
    document.getElementById("download").disabled = !(hasItems && isValid);
  }

  document.getElementById("customerName").addEventListener("input", updateButtonState);
  document.getElementById("customerEmail").addEventListener("input", updateButtonState);

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

  document.getElementById("view").addEventListener("click", generateInvoice);

  function generateInvoice() {
    if (cartProducts.length === 0) {
      alert("Your cart is empty! Add items before viewing the invoice.");
      return;
    }

    const customerName = document.getElementById("customerName").value;
    const customerEmail = document.getElementById("customerEmail").value;
    const invoiceNumber = Math.floor(10000000 + Math.random() * 90000000);
    const date = new Date().toLocaleDateString();

    let invCont = document.getElementById("invoiceCont");
    if (!document.getElementById("invoice")) {
      invCont.innerHTML = `<iframe id="invoice" src="" frameborder="0"></iframe>`;
    }

    const myPDF = new Invoice("invoice");
    myPDF.addHeader("Invoice - Walmart");
    myPDF.addText(`Invoice Number: ${invoiceNumber}`);
    myPDF.addText(`Date: ${date}`);
    myPDF.addText(`Customer: ${customerName}`);
    myPDF.addText(`Email: ${customerEmail}`);
    myPDF.addText(" ");
    myPDF.addText("Itemized List:");

    myPDF.printItems();
    myPDF.printTotal();
    myPDF.showPdf();
  }

  document.getElementById("download").addEventListener("click", function () {
    if (cartProducts.length === 0) {
      alert("Your cart is empty! Add items before downloading the invoice.");
      return;
    }

    const myPDF = new Invoice("invoice");
    myPDF.addHeader("Invoice - Walmart");
    myPDF.printItems();
    myPDF.printTotal();
    myPDF.downloadPdf();
  });
});