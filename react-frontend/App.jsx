import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignIn from "./SignIn";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AdminDashboard from "./Admindashboard";
import AdminLogin from "./AdminLogin";


// ======================================================
// PROTECTED ADMIN ROUTE
// ======================================================

function ProtectedAdminRoute() {

    const isAdminLoggedIn =
        localStorage.getItem("adminLoggedIn") === "true";


    if (!isAdminLoggedIn) {

        return <Navigate to="/admin-login" replace />;

    }


    return <AdminDashboard />;

}


function App() {

    return (

        <BrowserRouter>

            <Toaster position="top-right" />

            <Routes>

                {/* USER */}

                <Route
                    path="/"
                    element={<SignIn />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* ADMIN LOGIN */}

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />


                {/* PROTECTED ADMIN DASHBOARD */}

                <Route
                    path="/admin"
                    element={<ProtectedAdminRoute />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
