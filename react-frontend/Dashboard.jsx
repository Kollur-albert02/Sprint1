import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Dashboard.css";

function Dashboard() {

    const [emergencyData, setEmergencyData] = useState({
        disaster_type: "",
        location: "",
        latitude: "",
        longitude: "",
        people_count: "",
        description: ""
    });

    const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);

    const [emergencyRequests, setEmergencyRequests] = useState([]);

    const [loadingRequests, setLoadingRequests] = useState(false);


    // ==========================================
    // FETCH USER EMERGENCY REQUESTS
    // ==========================================

    const fetchEmergencyRequests = async () => {

        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.log("No user ID found");
            return;
        }

        try {

            setLoadingRequests(true);

            const response = await axios.get(
                `http://localhost:5000/api/emergency/user/${userId}`
            );

            setEmergencyRequests(response.data);

        } catch (error) {

            console.error(
                "Error fetching emergency requests:",
                error
            );

        } finally {

            setLoadingRequests(false);

        }
    };


    // ==========================================
    // LOAD REQUESTS WHEN DASHBOARD OPENS
    // AND REFRESH EVERY 10 SECONDS
    // ==========================================

    useEffect(() => {

        fetchEmergencyRequests();

        const interval = setInterval(() => {
            fetchEmergencyRequests();
        }, 10000);

        return () => clearInterval(interval);

    }, []);


    // ==========================================
    // GET USER CURRENT LOCATION
    // ==========================================

    const getCurrentLocation = () => {

        if (!navigator.geolocation) {

            toast.error(
                "Geolocation is not supported by your browser"
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setEmergencyData((prev) => ({
                    ...prev,
                    latitude: latitude,
                    longitude: longitude
                }));

                toast.success("Location detected successfully");

            },

            (error) => {

                console.error(
                    "Location error:",
                    error
                );

                toast.error(
                    "Unable to get your location"
                );

            }

        );
    };


    // ==========================================
    // HANDLE INPUT CHANGES
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setEmergencyData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // ==========================================
    // SUBMIT EMERGENCY REQUEST
    // ==========================================

    const handleEmergencySubmit = async (e) => {

        e.preventDefault();

        const userId = localStorage.getItem("userId");

        if (!userId) {

            toast.error(
                "User information not found. Please login again."
            );

            return;
        }


        if (
            !emergencyData.disaster_type ||
            !emergencyData.location ||
            !emergencyData.people_count ||
            !emergencyData.description
        ) {

            toast.error(
                "Please fill all required fields"
            );

            return;
        }


        try {

            const response = await axios.post(
                "http://localhost:5000/api/emergency",
                {
                    user_id: userId,

                    disaster_type:
                        emergencyData.disaster_type,

                    location:
                        emergencyData.location,

                    latitude:
                        emergencyData.latitude,

                    longitude:
                        emergencyData.longitude,

                    people_count:
                        emergencyData.people_count,

                    description:
                        emergencyData.description
                }
            );


            console.log(
                "Emergency response:",
                response.data
            );


            toast.success(
                "Emergency request submitted successfully"
            );


            // Clear form

            setEmergencyData({
                disaster_type: "",
                location: "",
                latitude: "",
                longitude: "",
                people_count: "",
                description: ""
            });


            // Close popup

            setShowEmergencyPopup(false);


            // Refresh requests

            fetchEmergencyRequests();


        } catch (error) {

            console.error(
                "Emergency submission error:",
                error
            );

            toast.error(
                "Failed to submit emergency request"
            );

        }

    };


    // ==========================================
    // GET STATUS MESSAGE
    // ==========================================

    const getStatusMessage = (status) => {

        switch (status) {

            case "PENDING":
                return "Waiting for a response team";

            case "ASSIGNED":
                return "Response team has been assigned";

            case "IN_PROGRESS":
                return "Rescue operation is in progress";

            case "RESOLVED":
                return "Rescue operation completed";

            default:
                return "Status unavailable";

        }

    };


    // ==========================================
    // GET STATUS ICON
    // ==========================================

    const getStatusIcon = (status) => {

        switch (status) {

            case "PENDING":
                return "⏳";

            case "ASSIGNED":
                return "👨‍🚒";

            case "IN_PROGRESS":
                return "🚨";

            case "RESOLVED":
                return "✅";

            default:
                return "ℹ️";

        }

    };


    return (

        <div className="dashboard">


            {/* =====================================
                HEADER
            ====================================== */}

            <header className="dashboard-header">

                <div className="logo">
                    🚨 Disaster Alert
                </div>


                <nav>

                    <a href="#home">
                        Home
                    </a>

                    <a href="#alerts">
                        Alerts
                    </a>

                    <a href="#news">
                        News
                    </a>

                    <a href="#resources">
                        Resources
                    </a>

                </nav>

            </header>



            {/* =====================================
                HERO SECTION
            ====================================== */}

            <section
                className="hero"
                id="home"
            >

                <div className="hero-content">

                    <h1>
                        Stay Safe. Stay Informed.
                    </h1>

                    <p>
                        Get real-time disaster alerts
                        and request emergency assistance
                        when you need it.
                    </p>

                    <button
                        className="emergency-button"
                        onClick={() =>
                            setShowEmergencyPopup(true)
                        }
                    >
                        🚨 Request Emergency Assistance
                    </button>

                </div>

            </section>



            {/* =====================================
                QUICK ACTIONS
            ====================================== */}

            <section className="quick-actions">

                <h2>
                    Quick Actions
                </h2>


                <div className="quick-action-container">


                    <div className="quick-card">

                        <div className="quick-icon">
                            🚨
                        </div>

                        <h3>
                            Emergency Assistance
                        </h3>

                        <p>
                            Request help during
                            an emergency.
                        </p>

                        <button
                            onClick={() =>
                                setShowEmergencyPopup(true)
                            }
                        >
                            Request Help
                        </button>

                    </div>



                    <div className="quick-card">

                        <div className="quick-icon">
                            ⚠️
                        </div>

                        <h3>
                            Disaster Alerts
                        </h3>

                        <p>
                            Stay updated with
                            disaster alerts.
                        </p>

                        <button
                         onClick={() =>
        document.getElementById("alerts").scrollIntoView({
            behavior: "smooth"
        })
    }>
                            View Alerts
                        </button>

                    </div>



                    <div className="quick-card">

                        <div className="quick-icon">
                            📰
                        </div>

                        <h3>
                            Disaster News
                        </h3>

                        <p>
                            Read the latest
                            disaster news.
                        </p>

                        <button   onClick={() =>
        document.getElementById("news").scrollIntoView({
            behavior: "smooth"
        })
    }>
                            View News
                        </button>

                    </div>


                </div>

            </section>



            {/* =====================================
                MY EMERGENCY REQUESTS
            ====================================== */}

            <section className="my-requests">

                <div className="requests-header">

                    <div>

                        <h2>
                            My Emergency Requests
                        </h2>

                        <p>
                            Track the progress of
                            your emergency assistance.
                        </p>

                    </div>


                    <button
                        className="refresh-button"
                        onClick={fetchEmergencyRequests}
                    >
                        🔄 Refresh
                    </button>

                </div>



                {loadingRequests ? (

                    <div className="loading-requests">

                        Loading your requests...

                    </div>

                ) : emergencyRequests.length === 0 ? (

                    <div className="no-requests">

                        <div className="no-request-icon">
                            📋
                        </div>

                        <h3>
                            No Emergency Requests
                        </h3>

                        <p>
                            You haven't submitted
                            any emergency requests yet.
                        </p>

                    </div>

                ) : (

                    <div className="requests-container">


                        {emergencyRequests.map((request) => (

                            <div
                                className="request-card"
                                key={request.id}
                            >


                                {/* =================================
                                    REQUEST HEADER
                                ================================== */}

                                <div className="request-card-header">

                                    <div>

                                        <h3>
                                            {getStatusIcon(
                                                request.status
                                            )}{" "}

                                            {request.disaster_type}
                                        </h3>

                                        <span className="request-id">
                                            Request #{request.id}
                                        </span>

                                    </div>


                                    <span
                                        className={`request-status status-${request.status?.toLowerCase()}`}
                                    >
                                        {request.status === "IN_PROGRESS"
                                            ? "IN PROGRESS"
                                            : request.status}
                                    </span>

                                </div>



                                {/* =================================
                                    REQUEST DETAILS
                                ================================== */}

                                <div className="request-details">


                                    <div className="request-detail">

                                        <span className="detail-label">
                                            📍 Location
                                        </span>

                                        <span>
                                            {request.location}
                                        </span>

                                    </div>



                                    <div className="request-detail">

                                        <span className="detail-label">
                                            👥 People
                                        </span>

                                        <span>
                                            {request.people_count}
                                        </span>

                                    </div>



                                    <div className="request-detail">

                                        <span className="detail-label">
                                            🕒 Submitted
                                        </span>

                                        <span>
                                            {request.created_at}
                                        </span>

                                    </div>


                                </div>



                                {/* =================================
                                    DESCRIPTION
                                ================================== */}

                                <div className="request-description">

                                    <strong>
                                        Description
                                    </strong>

                                    <p>
                                        {request.description}
                                    </p>

                                </div>



                                {/* =================================
                                    OPERATION TEAM
                                ================================== */}

                                <div className="request-team">

                                    <div className="team-icon">
                                        🚑
                                    </div>


                                    <div className="team-info">

                                        <strong>
                                            Response Team
                                        </strong>

                                        <p>

                                            {request.assigned_team
                                                ? request.assigned_team
                                                : "Waiting for team assignment"}

                                        </p>

                                    </div>

                                </div>



                                {/* =================================
                                    RESCUE STATUS
                                ================================== */}

                                <div
                                    className={`request-progress progress-${request.status?.toLowerCase()}`}
                                >

                                    <div className="progress-icon">

                                        {getStatusIcon(
                                            request.status
                                        )}

                                    </div>


                                    <div className="progress-info">

                                        <strong>
                                            Rescue Status
                                        </strong>

                                        <p>
                                            {getStatusMessage(
                                                request.status
                                            )}
                                        </p>

                                    </div>

                                </div>



                                {/* =================================
                                    DYNAMIC STATUS TIMELINE
                                ================================== */}

                                <div className="status-timeline">


                                    {/* REQUEST SUBMITTED */}

                                    <div
                                        className={`timeline-step ${
                                            request.status === "PENDING"
                                                ? "active"
                                                : "completed"
                                        }`}
                                    >

                                        <div className="timeline-dot">
                                            ✓
                                        </div>

                                        <span>
                                            Request Submitted
                                        </span>

                                    </div>



                                    {/* TEAM ASSIGNED */}

                                    <div
                                        className={`timeline-step ${
                                            request.status === "ASSIGNED" ||
                                            request.status === "IN_PROGRESS" ||
                                            request.status === "RESOLVED"
                                                ? "completed"
                                                : ""
                                        }`}
                                    >

                                        <div className="timeline-dot">
                                            {request.status === "ASSIGNED" ||
                                            request.status === "IN_PROGRESS" ||
                                            request.status === "RESOLVED"
                                                ? "✓"
                                                : ""}
                                        </div>

                                        <span>
                                            Team Assigned
                                        </span>

                                    </div>



                                    {/* RESCUE IN PROGRESS */}

                                    <div
                                        className={`timeline-step ${
                                            request.status === "IN_PROGRESS"
                                                ? "active"
                                                : request.status === "RESOLVED"
                                                ? "completed"
                                                : ""
                                        }`}
                                    >

                                        <div className="timeline-dot">
                                            {request.status === "RESOLVED"
                                                ? "✓"
                                                : ""}
                                        </div>

                                        <span>
                                            Rescue In Progress
                                        </span>

                                    </div>



                                    {/* RESOLVED */}

                                    <div
                                        className={`timeline-step ${
                                            request.status === "RESOLVED"
                                                ? "completed"
                                                : ""
                                        }`}
                                    >

                                        <div className="timeline-dot">
                                            {request.status === "RESOLVED"
                                                ? "✓"
                                                : ""}
                                        </div>

                                        <span>
                                            Resolved
                                        </span>

                                    </div>


                                </div>


                            </div>

                        ))}


                    </div>

                )}

            </section>



            {/* =====================================
                ALERTS
            ====================================== */}

            <section
    className="dashboard-section"
    id="alerts"
>

    <h2>
        Latest Alerts
    </h2>

    <div className="info-cards">

        <a
            href="http://localhost:5500/"
            className="info-card"
        >
           <span className="info-icon">
                ⚠️
            </span>

            <h3>
                Disaster Alert
            </h3>

            <p>
                Stay alert and follow
                official safety instructions.
            </p> 
        </a>
          <a
            href="http://localhost:5500/alerts.html"
            className="info-card"
        >
            <span className="info-icon">
                🌧️
            </span>

            <h3>
                Weather Alert
            </h3>

            <p>
                Monitor weather conditions
                in your area.
            </p>
        </a>

    </div>

</section>
  {/* =====================================
                NEWS
     ====================================== */}

            <section
                className="dashboard-section"
                id="news"
            >

                <h2>
                    Disaster News
                </h2>

                <div className="info-cards">

                      <a
            href="http://localhost:5500/news.html"
            className="info-card"
        >
            <span className="info-icon">
                📰
            </span>

            <h3>
                Latest Updates
            </h3>

            <p>
                Get the latest information
                about disasters.
            </p>
        </a>
       </div>
        </section>



            {/* =====================================
                RESOURCES
            ====================================== */}
           <section
    className="dashboard-section"
    id="resources"
>

    <h2>
        Safety Resources
    </h2>

    <div className="resource-cards">

        <a
            href="http://localhost:5500/resources.html"
            className="info-card"
        >
            <span className="info-icon">
                🧰
            </span>

            <h3>
                Emergency Kit
            </h3>

             <p>
                Keep essential emergency
                supplies ready.
            </p>
        </a>


        <a
            href="http://localhost:5500/emercontact.html"
            className="info-card"
        >
            <span className="info-icon">
                📞
            </span>

            <h3>
                Emergency Contacts
            </h3>

              <p>
                Keep important emergency
                numbers accessible.
            </p>
        </a>

    </div>

</section>
            
                

                       
                     
           



            {/* =====================================
                FOOTER
            ====================================== */}

            <footer className="dashboard-footer">

                <p>
                    © 2026 Disaster Alert System
                </p>

                <p>
                    Stay Safe. Stay Informed.
                </p>

            </footer>



            {/* =====================================
                EMERGENCY POPUP
            ====================================== */}

            {showEmergencyPopup && (

                <div className="emergency-overlay">

                    <div className="emergency-popup">


                        <div className="popup-header">

                            <h2>
                                🚨 Emergency Assistance
                            </h2>

                            <button
                                className="close-button"
                                onClick={() =>
                                    setShowEmergencyPopup(false)
                                }
                            >
                                ✕
                            </button>

                        </div>



                        <form
                            onSubmit={handleEmergencySubmit}
                        >


                            {/* DISASTER TYPE */}

                            <div className="form-group">

                                <label>
                                    Disaster Type
                                </label>

                                <select
                                    name="disaster_type"
                                    value={
                                        emergencyData.disaster_type
                                    }
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select disaster type
                                    </option>

                                    <option value="Flood">
                                        Flood
                                    </option>

                                    <option value="Earthquake">
                                        Earthquake
                                    </option>

                                    <option value="Fire">
                                        Fire
                                    </option>

                                    <option value="Landslide">
                                        Landslide
                                    </option>

                                    <option value="Cyclone">
                                        Cyclone
                                    </option>

                                    <option value="Building Collapse">
                                        Building Collapse
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>



                            {/* LOCATION */}

                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        emergencyData.location
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter your location"
                                    required
                                />

                            </div>



                            {/* CURRENT LOCATION */}

                            <button
                                type="button"
                                className="location-button"
                                onClick={getCurrentLocation}
                            >
                                📍 Use My Current Location
                            </button>



                            {/* COORDINATES */}

                            {emergencyData.latitude &&
                                emergencyData.longitude && (

                                <div className="coordinates">

                                    📍 Coordinates detected

                                </div>

                            )}



                            {/* PEOPLE COUNT */}

                            <div className="form-group">

                                <label>
                                    Number of People
                                </label>

                                <input
                                    type="number"
                                    name="people_count"
                                    value={
                                        emergencyData.people_count
                                    }
                                    onChange={handleChange}
                                    min="1"
                                    placeholder="Enter number of people"
                                    required
                                />

                            </div>



                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label>
                                    Describe the Emergency
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        emergencyData.description
                                    }
                                    onChange={handleChange}
                                    placeholder="Describe what happened..."
                                    rows="4"
                                    required
                                />

                            </div>



                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="submit-emergency-button"
                            >
                                🚨 Submit Emergency Request
                            </button>


                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Dashboard;
