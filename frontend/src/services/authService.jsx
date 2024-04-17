
const API_URL = 'http://localhost:5001/'; 

export const login = async (email, password) => {
  try {
    const response = await fetch(API_URL + 'auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (email, username, password) => {
  try {
    const response = await fetch(API_URL + 'auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, username, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
