const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  const port = import.meta.env.VITE_API_PORT;

  if (url && port && !url.match(/:\d+$/)) {
    return `${url}:${port}/api`;
  }
  if (url) {
    return url.endsWith("/api") ? url : `${url}/api`;
  }
  return "http://localhost:8001/api";
};

const baseurl = getBaseURL();

export const AuthApi = {
  Login: baseurl + "/auth/login",
  Signup: baseurl + "/auth/register",
};
