chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'placeOrder') {
      placeOrder(message.data)
        .then(order => sendResponse({ success: true, data: order }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Indicates that the response is asynchronous
    }
  });
  
  async function placeOrder(orderDetails) {
    const { symbol, quantity, price, orderType } = orderDetails;
    
    // Zerodha Kite API endpoint and credentials
    const apiUrl = 'https://api.kite.trade/orders';
    const apiKey = '5a70autepepei38k';
    const accessToken = 'D48UdE0qEqP6GzJzzVCGd9BxZbloRj5v4gWazn07WILnvkkKw623dn4De5TDn9CwxQNGzWz1wWk4XIhKyi5mDDFtdu+ytmgzWpV95Otco6Ya15TF6kjDTQ==';
    
    const orderData = {
      exchange: 'NSE',
      tradingsymbol: symbol,
      transaction_type: orderType,
      quantity: quantity,
      order_type: 'LIMIT',
      price: price,
      product: 'CNC'
    };
  
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `token ${apiKey}:${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
  
    if (!response.ok) {
      throw new Error(`Failed to place order: ${response.statusText}`);
    }
  
    return response.json();
  }
  