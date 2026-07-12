import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();

  return <h1>Home</h1>;
};

export default Home;
