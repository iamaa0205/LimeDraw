const API_URL = 'http://127.0.0.1:5001'; // Replace with your actual backend URL

// Function to encrypt data
export async function encryptData(text) {
  try {
    const response = await fetch(`${API_URL}/api/encrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });

    if (!response.ok)
      throw new Error(`Encryption failed! Status: ${response.status}`);

    const data = await response.json();
    return data.encryptedText;
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
}

// Function to decrypt data
export async function decryptData(encryptedValue) {
  try {
    const response = await fetch(`${API_URL}/api/decrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedText: encryptedValue }),
    });

    if (!response.ok)
      throw new Error(`Decryption failed! Status: ${response.status}`);

    const data = await response.json();
 
    return data.decryptedText;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
}



export async function buy() {
  try {
    const response = await fetch(`${API_URL}/api/buyTicket`, {
      method: 'GET',  
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok)
      throw new Error(`Failed to buy ticket! Status: ${response.status}`);

    const data = await response.json();
    console.log("data",data)
    return data.decryptedText || data; 
  } catch (error) {
    console.error('Error buying ticket:', error);
    return null;
  }
}

