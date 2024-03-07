// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    let data = await response.json();
    return { token: data.token, user_id: data.user_id };
  } else {
    throw new Error(
      `Received status ${response.status} when logging in. Expected 201`
    );
  }
};

export const signup = async (email, password, username) => {
  const payload = {
    email: email,
    password: password,
    username: username,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let response = await fetch(`${BACKEND_URL}/users`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    return;
  } else {
    throw new Error(
      `Received status ${response.status} when signing up. Expected 201`
    );
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.clear();
  console.log(localStorage);
};

export const checkToken = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(token)
  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);
  if (!response.ok) {
    const error = new Error("Token not valid");
    error.response = response;
    throw error;
  }
  const data = await response.json();
  return data;
};