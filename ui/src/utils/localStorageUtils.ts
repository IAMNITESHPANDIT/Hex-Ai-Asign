
// Function to set an item in localStorage
export const setLocalStorageItem = (key: string, value: any): void => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error setting item in localStorage:', error);
  }
};

// Function to get an item from localStorage
export const getLocalStorageItem = (key: string): any => {
  try {
    const jsonValue = localStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return null;
  }
};

// Function to remove an item from localStorage
export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};
