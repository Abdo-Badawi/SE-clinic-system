export const setAuth = (token, role, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
};

export const getToken = () => localStorage.getItem("token");
export const getUserRole = () => localStorage.getItem("role");