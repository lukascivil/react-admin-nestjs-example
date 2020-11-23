import { AuthProvider } from "react-admin";

const authProvider: AuthProvider = {
  login: (params) => {
    const { username, password } = params;
    const request = new Request("http://localhost:3000/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((auth) => {
        localStorage.setItem("auth", JSON.stringify(auth));
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },
  checkError: (error) => Promise.resolve(),
  checkAuth: (params) => {
    const token = localStorage.getItem("auth");
    console.log(params);

    if (!token) {
      return Promise.reject();
    }

    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem("auth");

    return Promise.resolve();
  },
  getPermissions: (params) => Promise.resolve(),
};

export default authProvider;
