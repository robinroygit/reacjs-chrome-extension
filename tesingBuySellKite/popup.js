document.getElementById('trade-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const symbol = document.getElementById('symbol').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const orderType = document.getElementById('order-type').value;
  
    const orderDetails = { symbol, quantity, price, orderType };
  
    try {
      const response = await placeOrder(orderDetails);
      document.getElementById('status').innerText = `Order placed: ${response.data.order_id}`;
    } catch (error) {
      document.getElementById('status').innerText = `Error: ${error.message}`;
    }
  });
  
  async function placeOrder(orderDetails) {
    // Call background script to place the order
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: 'placeOrder', data: orderDetails }, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }
  