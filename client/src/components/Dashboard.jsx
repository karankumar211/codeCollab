import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpaces } from "../features/spaceSlice";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Read the state from the spaceSlice
  const { spaces, isLoading, error } = useSelector((state) => state.spaces);

  // When the component loads, dispatch the thunk
  useEffect(() => {
    dispatch(getSpaces());
  }, [dispatch]);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    // update redux state and localStorage
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <Navbar />
      <h2>
        Welcome{user?.username ? `, ${user.username}` : ""} to your Dashboard!
      </h2>

      <h3>Your Spaces</h3>
      {/* 3. Render based on the state */}
      {isLoading && <p>Loading spaces...</p>}
      {error && <p>Error: {error}</p>}

      {spaces && spaces.length > 0 ? (
        <ul>
          {spaces.map((space) => (
            <li key={space._id}>
              <Link to={`/space/${space._id}`}>
              {space.name}
              </Link>
              </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>You have no spaces. Create one!</p>
      )}

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
