import { API_URL } from "./config";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

function Register() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleRegister = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {

            toast.error("Passwords do not match");

            return;
        }


        try {

            await axios.post(
                `${API_URL}/api/auth/register`,
                {
                    email: email,
                    password: password
                }
            );

            toast.success("Registration successful!");

            setTimeout(() => {
                navigate("/");
            }, 1000);


        } catch (error) {

            if (error.response && error.response.status === 409) {

                toast.error("Email already exists");

            } else {

                toast.error("Registration failed");

            }

        }

    };


    return (

        <div className="register-page">

            <div className="register-container">

                {/* LEFT SIDE */}

                <div className="register-info">

                    <h1>🚨 DISASTER ALERT</h1>

                    <h2>
                        Join Disaster Alert
                    </h2>

                    <p>
                        Create an account and stay
                        informed about important
                        disaster alerts and emergencies.
                    </p>

                </div>


                {/* RIGHT SIDE */}

                <div className="register-form">

                    <h2>Create Account</h2>

                    <p className="register-subtitle">
                        Register for Disaster Alert
                    </p>


                    <form onSubmit={handleRegister}>

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
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />


                        <label>Confirm Password</label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />


                        <button type="submit">
                            Register
                        </button>

                    </form>


                    <p className="login-link">

                        Already have an account?

                        <Link to="/">
                            Sign In
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );
}

export default Register;
