import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useAuth from "../hooks/useAuth";
import axios from "axios";
function Login() {
  const navigate = useNavigate();
  const { googleSignIn, logOut } = useAuth();
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn().then((result) => {
        console.log(result);
        axios.post(`${import.meta.env.VITE_API_URL}/users`, {
          name: result.displayName,
          email: result.email,
          tasks: {},
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div className="flex items-center min-h-screen justify-center bg-login-bg ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
        <h3 className="text-3xl font-bold py-12">Welcome Back!</h3>
        <figure>
          <img src={logo} alt="Logo" className="h-20 w-20" />
        </figure>
        {/* google sign up logic */}
        <button
          onClick={handleGoogleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Sign in with Google{" "}
        </button>
        <button onClick={logOut}>Logout</button>
      </div>
    </div>
  );
}

export default Login;
