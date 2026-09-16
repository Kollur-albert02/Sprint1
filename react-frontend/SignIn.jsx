import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

function SignIn() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email: email,
                    password: password
                }
            );
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("userEmail", response.data.email);
            toast.success("Login successful!");

            navigate("/dashboard");

        } catch (error) {

            if (error.response && error.response.status === 401) {

                toast.error("Invalid credentials");

            } else {

                toast.error("Something went wrong");

            }

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-container">

                {/* LEFT SIDE */}

                <div className="welcome-section">

                    <h1>🚨 DISASTER ALERT</h1>

                    <h2>
                        Disaster Management System
                    </h2>

                    <p>
                        Stay informed. Stay prepared.
                        Stay safe.
                    </p>

                    <p>
                        Create an account to receive
                        important disaster alerts and
                        emergency information.
                    </p>

                </div>


                {/* RIGHT SIDE */}

                <div className="form-section">

                    <h2>Welcome Back!</h2>

                    <p className="subtitle">
                        Sign in to your account
                    </p>


                    <form onSubmit={handleLogin}>

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />


                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />


                        <button type="submit">
                            Sign In
                        </button>

                    </form>


                    <p className="switch">

                        Don't have an account?

                        <Link
                            className="switch-button"
                            to="/register"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );
}

export default SignIn;
