import { API_URL } from "../config";
import "./Admindashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function AdminDashboard() {

  const navigate = useNavigate();

  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchEmergencies = () => {
    fetch(`${API_URL}/api/emergency`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Emergency data:", data);
        setEmergencies(data);

        if (selectedEmergency) {
          const updatedEmergency = data.find(
            (emergency) =>
              emergency.id === selectedEmergency.id
          );

          if (updatedEmergency) {
            setSelectedEmergency(updatedEmergency);
          }
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching emergencies:",
          error
        );
      });
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  // ADMIN LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminUsername");

    navigate("/admin-login");
  };

  const handleSelectEmergency = (emergency) => {
    setSelectedEmergency(emergency);

    setSelectedTeam(
      emergency.assigned_team || ""
    );

    setSelectedStatus(
      emergency.status || "PENDING"
    );
  };

  const handleAssignTeam = () => {
    if (!selectedEmergency) {
      return;
    }

    if (!selectedTeam) {
      alert("Please select an operation team.");
      return;
    }

    fetch(
    `${API_URL}/api/emergency/${selectedEmergency.id}/assign`,
    
     {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assigned_team: selectedTeam,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Assign team response:", data);
        alert("Operation team assigned successfully.");
        fetchEmergencies();
      })
      .catch((error) => {
        console.error(
          "Error assigning team:",
          error
        );
        alert("Failed to assign operation team.");
      });
  };

  const handleUpdateStatus = () => {
    if (!selectedEmergency) {
      return;
    }

    if (!selectedStatus) {
      alert("Please select a status.");
      return;
    }

    fetch(
    `${API_URL}/api/emergency/${selectedEmergency.id}/status`,
    
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(
          "Update status response:",
          data
        );
        alert("Emergency status updated successfully.");
        fetchEmergencies();
      })
      .catch((error) => {
        console.error(
          "Error updating status:",
          error
        );
        alert("Failed to update emergency status.");
      });
  };

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div className="admin-brand">

          <div className="admin-logo">
            🚨
          </div>

          <div>
            <h1>
              DisasterAlert
            </h1>

            <span>
              Administration Panel
            </span>
          </div>

        </div>

        <div className="admin-profile">

          <div className="admin-avatar">
            A
          </div>

          <div>
            <strong>
              Administrator
            </strong>

            <span>
              Control Center
            </span>
          </div>

          {/* LOGOUT BUTTON */}
          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="admin-content">

        <div className="page-heading">

          <div>
            <h2>
              Emergency Management
            </h2>

            <p>
              Monitor and manage incoming emergency requests.
            </p>
          </div>

          <div className="request-count">

            <span>
              {emergencies.length}
            </span>

            <small>
              Total Requests
            </small>

          </div>

        </div>

        <div className="dashboard-grid">

          <section className="emergency-panel">

            <div className="panel-header">

              <div>
                <h3>
                  Emergency Requests
                </h3>

                <p>
                  Select a request to view its details
                </p>
              </div>

              <span className="live-indicator">

                <span className="live-dot"></span>

                LIVE

              </span>

            </div>

            <div className="emergency-list">

              {emergencies.map((emergency) => (

                <div
                  key={emergency.id}
                  className={`emergency-card ${
                    selectedEmergency?.id === emergency.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectEmergency(emergency)
                  }
                >

                  <div className="emergency-icon">

                    {emergency.disaster_type === "Flood"
                      ? "🌊"
                      : emergency.disaster_type === "Earthquake"
                      ? "🏚️"
                      : emergency.disaster_type === "Landslide"
                      ? "⛰️"
                      : "🚨"}

                  </div>

                  <div className="emergency-info">

                    <div className="emergency-title">

                      <h4>
                        #{emergency.id} -{" "}
                        {emergency.disaster_type}
                      </h4>

                      <span className="status-badge">
                        {emergency.status}
                      </span>

                    </div>

                    <p className="location">
                      📍 {emergency.location}
                    </p>

                    <p className="people">
                      👥 {emergency.people_count} people affected
                    </p>

                    <p className="user-id">
                      👤 User ID: {emergency.user_id}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </section>

          <section className="details-panel">

            {selectedEmergency ? (

              <>

                <div className="details-header">

                  <div>

                    <span className="details-label">
                      SELECTED EMERGENCY
                    </span>

                    <h3>
                      #{selectedEmergency.id}{" "}
                      {selectedEmergency.disaster_type}
                    </h3>

                  </div>

                  <span className="status-badge large">
                    {selectedEmergency.status}
                  </span>

                </div>

                <div className="details-body">

                  <div className="detail-item">

                    <span>
                      📍 Location
                    </span>

                    <strong>
                      {selectedEmergency.location}
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      👥 People Affected
                    </span>

                    <strong>
                      {selectedEmergency.people_count}
                    </strong>

                  </div>

                  <div className="detail-item">

                    <span>
                      👤 User ID
                    </span>

                    <strong>
                      {selectedEmergency.user_id}
                    </strong>

                  </div>

                  <div className="detail-item full">

                    <span>
                      📝 Description
                    </span>

                    <p>
                      {selectedEmergency.description}
                    </p>

                  </div>

                  <div className="detail-item full">

                    <span>
                      🚑 Assigned Operation Team
                    </span>

                    <strong>
                      {selectedEmergency.assigned_team
                        ? selectedEmergency.assigned_team
                        : "No team assigned"}
                    </strong>

                  </div>

                  <div className="admin-control full">

                    <label>
                      Assign Operation Team
                    </label>

                    <select
                      value={selectedTeam}
                      onChange={(e) =>
                        setSelectedTeam(e.target.value)
                      }
                    >

                      <option value="">
                        Select a team
                      </option>

                      <option value="Medical Response Team">
                        Medical Response Team
                      </option>

                      <option value="Fire & Rescue Team">
                        Fire & Rescue Team
                      </option>

                      <option value="Flood Rescue Team">
                        Flood Rescue Team
                      </option>

                      <option value="Police Response Team">
                        Police Response Team
                      </option>

                    </select>

                    <button
                      onClick={handleAssignTeam}
                    >
                      Assign Team
                    </button>

                  </div>

                  <div className="admin-control full">

                    <label>
                      Update Emergency Status
                    </label>

                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value)
                      }
                    >

                      <option value="PENDING">
                        PENDING
                      </option>

                      <option value="ASSIGNED">
                        ASSIGNED
                      </option>

                      <option value="IN_PROGRESS">
                        IN PROGRESS
                      </option>

                      <option value="RESOLVED">
                        RESOLVED
                      </option>

                    </select>

                    <button
                      onClick={handleUpdateStatus}
                    >
                      Update Status
                    </button>

                  </div>

                  <div className="coordinates">

                    <div className="coordinate">

                      <span>
                        Latitude
                      </span>

                      <strong>
                        {selectedEmergency.latitude}
                      </strong>

                    </div>

                    <div className="coordinate">

                      <span>
                        Longitude
                      </span>

                      <strong>
                        {selectedEmergency.longitude}
                      </strong>

                    </div>

                  </div>

                  <MapContainer
                    center={[
                      Number(selectedEmergency.latitude),
                      Number(selectedEmergency.longitude)
                    ]}
                    zoom={13}
                    style={{
                      height: "400px",
                      width: "100%"
                    }}
                  >

                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker
                      position={[
                        Number(selectedEmergency.latitude),
                        Number(selectedEmergency.longitude)
                      ]}
                    />

                  </MapContainer>

                </div>

              </>

            ) : (

              <div className="no-selection">

                <div className="empty-icon">
                  🗺️
                </div>

                <h3>
                  No Emergency Selected
                </h3>

                <p>
                  Select an emergency request from the list
                  to view its details and location.
                </p>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;
