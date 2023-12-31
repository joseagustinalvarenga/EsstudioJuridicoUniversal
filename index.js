//Acatengo que poner la clave publica digamo 
const mercadopago = new MercadoPago("TEST-652cf701-588a-4608-bf5c-86ed8a9f697d", {
  locale: "es-AR", // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

//De aca tengo que traer los datos del html
document.getElementById("checkout-btn").addEventListener("click", function () {
  const orderData = {
    quantity: 1,
    description: "JUICIO",
    price: 300.00,
  };

  fetch("http://localhost:8080/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData), //aca envia los datos que trajo del html seria los precios cantidad etc
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (preference) {
      createCheckoutButton(preference.id);
    })
    .catch(function () {
      alert("Unexpected error");
    });
});

function createCheckoutButton(preferenceId) {
  // Initialize the checkout
  const bricksBuilder = mercadopago.bricks();

  const renderComponent = async (bricksBuilder) => {
    if (window.checkoutButton) window.checkoutButton.unmount();
    await bricksBuilder.create(
      "wallet",
      "button-checkout", // class/id where the payment button will be displayed
      {
        initialization: {
          preferenceId: preferenceId,
        },
        callbacks: {
          onError: (error) => console.error(error),
          onReady: () => {},
        },
      }
    );
  };
  window.checkoutButton = renderComponent(bricksBuilder);
}
