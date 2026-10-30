
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [institutionName, setInstitutionName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter your email and password.");
      return;
    }
    if (isRegistering && !userName.trim()) {
  setMessage("Please enter your full name.");
  return;
}
    if (isRegistering && !institutionName.trim()) {
      setMessage("Please enter your institution name.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      setMessage("Please wait...");

      const endpoint = isRegistering
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const payload = isRegistering
        ? {
            name: userName.trim(),
institutionName: institutionName.trim(),
          
            email: email.trim().toLowerCase(),
            password,
          }
        : {
            email: email.trim().toLowerCase(),
            password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        setMessage("Unexpected server response. Please try again.");
        return;
      }

      if (!response.ok) {
        setMessage(data.message || "Authentication failed.");
        return;
      }

      if (isRegistering) {
        setMessage("Registration successful! You can now log in.");
        setIsRegistering(false);
        setPassword("");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error("Login/Register error:", error);
      setMessage(error.message || "Could not connect to the backend.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eaf3ff] px-4 py-8 sm:px-8">

      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl md:min-h-[590px] md:grid-cols-2">

        {/* LEFT BRANDING PANEL */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#e8f4ff] via-[#dceeff] to-[#c8e7f5] px-8 pb-0 pt-10 sm:px-12">

          {/* AICTE logo-style emblem */}
          <div className="relative z-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#c99d35] bg-[#f7e9b9] shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#9b7724] text-center text-[10px] font-extrabold leading-tight text-[#765619]">
                AICTE
                <br />
                INDIA
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[#173b60]">
              AICTE
            </h1>

            <h2 className="mt-1 text-lg font-bold text-[#173b60]">
              Smart Approval Portal
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#496a87]">
              Streamlining Approvals, Empowering Institutions
            </p>

            <p className="mt-2 max-w-xs text-xs leading-5 text-[#64829b]">
              Building a Better Higher Education Ecosystem
            </p>
          </div>

          {/* College illustration */}
          <div className="relative mt-10 flex flex-1 items-end justify-center">

            <svg
              viewBox="0 0 460 280"
              className="w-full max-w-[440px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky clouds */}
              <circle cx="55" cy="65" r="25" fill="#ffffff" opacity=".45" />
              <circle cx="80" cy="55" r="33" fill="#ffffff" opacity=".4" />
              <circle cx="370" cy="45" r="28" fill="#ffffff" opacity=".4" />

              {/* Sun */}
              <circle cx="400" cy="90" r="24" fill="#f7d98a" opacity=".8" />

              {/* Background trees */}
              <path d="M0 205 Q30 155 55 205 Q80 145 105 205" fill="#7ebc9b" />
              <path d="M355 210 Q380 145 405 210 Q430 155 460 210" fill="#77b794" />

              {/* Main college building */}
              <rect x="85" y="125" width="290" height="112" fill="#f8fbff" stroke="#7396b4" strokeWidth="3" />

              {/* Roof */}
              <path d="M65 125 L230 72 L395 125 Z" fill="#7299b8" stroke="#557d9e" strokeWidth="3" />

              {/* Central section */}
              <rect x="190" y="105" width="80" height="132" fill="#d7e9f8" stroke="#7396b4" strokeWidth="2" />

              {/* Columns */}
              {[200, 220, 240, 260].map((x) => (
                <rect key={x} x={x} y="145" width="8" height="92" fill="#ffffff" stroke="#8aa9c4" strokeWidth="1" />
              ))}

              {/* Windows */}
              {[105, 145, 290, 330].map((x) => (
                <g key={x}>
                  <rect x={x} y="145" width="24" height="32" rx="2" fill="#83b8d8" />
                  <rect x={x} y="190" width="24" height="32" rx="2" fill="#83b8d8" />
                </g>
              ))}

              {/* Entrance */}
              <rect x="211" y="190" width="38" height="47" rx="16" fill="#6285a3" />
              <path d="M230 190 V237" stroke="#dcecff" strokeWidth="2" />

              {/* Flag */}
              <path d="M230 72 V35" stroke="#557d9e" strokeWidth="3" />
              <path d="M230 35 L260 43 L230 52 Z" fill="#f0a65b" />

              {/* Ground */}
              <path d="M0 237 Q100 215 230 238 Q350 215 460 238 V280 H0 Z" fill="#8bc7a5" />
              <path d="M0 254 Q130 235 230 255 Q360 235 460 255 V280 H0 Z" fill="#70b78e" />

              {/* Small plants */}
              {[30, 65, 390, 430].map((x) => (
                <g key={x}>
                  <path d={`M${x} 245 Q${x - 15} 220 ${x - 12} 210 Q${x + 5} 225 ${x} 245`} fill="#388b70" />
                  <path d={`M${x} 245 Q${x + 12} 218 ${x + 18} 215 Q${x + 16} 235 ${x} 245`} fill="#4b9d7b" />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* RIGHT LOGIN PANEL */}
        <div className="flex items-center justify-center bg-white px-7 py-10 sm:px-12">
          <div className="w-full max-w-md">

            {/* Tabs */}
            <div className="mb-9 grid grid-cols-2 border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setMessage("");
                }}
                className={`border-b-2 py-3 text-sm font-semibold transition ${
                  !isRegistering
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setMessage("");
                }}
                className={`border-b-2 py-3 text-sm font-semibold transition ${
                  isRegistering
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Register
              </button>
            </div>

            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {isRegistering ? "Create Your Account" : "Welcome Back!"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {isRegistering
                  ? "Register your institution to continue"
                  : "Login to your account to continue"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
  <label htmlFor="userName" className="mb-2 block text-sm font-medium text-slate-700">
    Full Name
  </label>
  <input
    id="userName"
    type="text"
    value={userName}
    onChange={(e) => setUserName(e.target.value)}
    placeholder="Enter your full name"
    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    required
  />
</div>
              {isRegistering && (
                
                <div>
                  <label
                    htmlFor="institutionName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Institution Name
                  </label>

                  <input
                    id="institutionName"
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Enter institution name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email / Username
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {!isRegistering && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMessage("Please contact your portal administrator to reset your password.")}
                    className="text-xs font-medium text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {message && (
                <p
                  role="status"
                  className={`rounded-lg border p-3 text-sm ${
                    message.includes("successful")
                      ? "border-green-200 bg-green-50 text-green-700"
                      : message === "Please wait..."
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                {isRegistering ? "Register Institution" : "Login"}
              </button>
            </form>

            {!isRegistering && (
              <>
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <button
                  type="button"
                  onClick={() => setMessage("Google login is not configured yet. Please use your institution email.")}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="font-bold text-red-500">G</span>
                  Login with Google
                </button>

                <button
                  type="button"
                  onClick={() => setMessage("Government ID login is not configured yet. Please use your institution email.")}
                  className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <span>▣</span>
                  Login with Government ID
                </button>
              </>
            )}

            <p className="mt-7 text-center text-xs text-slate-500">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setMessage("");
                }}
                className="font-semibold text-blue-700 hover:underline"
              >
                {isRegistering ? "Login here" : "Register here"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
