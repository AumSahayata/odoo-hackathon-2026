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

  getUser: baseurl + "/auth/me",
};

export const MasterAPI = {

  Dashboard: baseurl + "/dashboard",

  VehicleAdd: baseurl + "/vehicles",
  VehicleList: baseurl + "/vehicles",
  VehicleUpdate: baseurl + "/vehicles/{id}",
  VehicleDelete: baseurl + "/vehicles/{id}",

  DriversAdd: baseurl + "/drivers",
  DriversList: baseurl + "/drivers",
  DriversUpdate: baseurl + "/drivers/{id}",
  DriversDelete: baseurl + "/drivers/{id}",

  TripsAdd: baseurl + "/trips",
  TripsList: baseurl + "/trips",
  TripsCancel: baseurl + "/trips/{id}/cancel",
  TripsDispatch: baseurl + "/trips/{id}/dispatch",
  TripsComplete: baseurl + "/trips/{id}/complete",
};
