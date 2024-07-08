export const fetchWithRetry = async (url, options) => {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }
    return await res.json();
  };
  
  export const searchUsersByName = async (name) => {
    const url = `http://localhost:8000/api/users/search?name=${name}`;
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
  
    return fetchWithRetry(url, options);
  };
  
  export const fetchCollaboratorDetails = async (id) => {
    const url = `http://localhost:8000/api/users/${id}`;
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
  
    return fetchWithRetry(url, options);
  };
  