import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleAdminLogin = async (e) => {

    e.preventDefault();

    if (!username || !password) {
        toast.error("Please enter username and password.");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/admin/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {

            toast.error(data.message || "Invalid admin credentials.");

            return;
        }

        localStorage.setItem("adminLoggedIn", "true");

        localStorage.setItem(
            "adminId",
            data.admin.id
        );

        localStorage.setItem(
            "adminUsername",
            data.admin.username
        );

        toast.success("Admin login successful!");

        navigate("/admin");

    } catch (error) {

        console.error("Admin login error:", error);

        toast.error(
            "Unable to connect to the server."
        );

    }

};


    return (

        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="admin-login-icon">
                    🚨
                </div>

                <h1>
                    DisasterAlert
                </h1>

                <p className="admin-login-subtitle">
                    Administration Panel
                </p>


                <form onSubmit={handleAdminLogin}>

                    <div className="admin-form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter admin username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                        />

                    </div>


                    <div className="admin-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>


                    <button
                        type="submit"
                        className="admin-login-button"
                    >
                        Admin Login
                    </button>

                </form>


                <button
                    className="back-to-login"
                    onClick={() => navigate("/")}
                >
                    ← Back to User Login
                </button>

            </div>

        </div>

    );
}

export default AdminLogin;
