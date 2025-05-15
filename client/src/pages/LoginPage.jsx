import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });



  const {loginMutation, isPending, error} = useLogin()

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      data-theme="forest"
    >
      <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Left Section - Login Form */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 bg-base-300">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <ShipWheelIcon className="size-9" />
              Strimo
            </h1>
          </div>
          {/* ERROR MESSAGE */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}
          <div className="mb-6">
            <h2 className="text-xl font-medium">Welcome Back</h2>
            <p className="text-sm opacity-70">
              Sign in to your account to continue your language journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="input input-bordered w-full"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-sm mt-4">
              Don't have an account?
              <Link to="/signup" className="text-primary hover:underline">
                {" "}
                Create one
              </Link>
            </div>
          </form>
        </div>

        {/* Right Section - Illustration */}
        <div className="w-full lg:w-1/2 bg-primary/20 p-6 sm:p-8 hidden lg:flex flex-col justify-center items-center text-center">
          <div className="max-w-md">
            <div className="mb-8">
              <img
                src="/i.png"
                alt="Language learning illustration"
                className="w-64 h-64 mx-auto"
              />
            </div>

            <h3 className="text-xl font-medium mb-2">
              Connect with language partners worldwide
            </h3>
            <p className="opacity-80">
              Practice conversations, make friends, and improve your language
              skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
