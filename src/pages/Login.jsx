import logo from "../assets/logo.png";
import background from "../assets/circle-login.svg";
function Login() {
  return (
    <div className="flex items-center min-h-screen justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
        <figure>
          <img src={logo} alt="Logo" className="h-20 w-20" />
        </figure>
        <img src={background} />
        {/* google sign up logic */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Sign in with Google{" "}
        </button>
      </div>
    </div>
  );
}

export default Login;
