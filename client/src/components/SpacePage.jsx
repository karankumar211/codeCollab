import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSnippetsBySpace, createSnippet } from "../features/snippetSlice";
import { inviteUser, clearInviteStatus } from "../features/spaceSlice";
import Navbar from "./Navbar";

const SpacePage = () => {
  const { spaceId } = useParams();
  const dispatch = useDispatch();
  const { snippets, isLoading, error } = useSelector((state) => state.snippets);
  const { inviteLoading, inviteError, inviteSuccess } = useSelector(
    (state) => state.spaces
  );

  const [snippetName, setSnippetName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    if (spaceId) {
      dispatch(fetchSnippetsBySpace(spaceId));
    }
    return () => {
      dispatch(clearInviteStatus());
    };
  }, [dispatch, spaceId]);

  const handleCreateSnippet = (e) => {
    e.preventDefault();
    if (snippetName.trim()) {
      const snippetData = {
        name: snippetName,
        parentSpace: spaceId,
        language: "javascript",
      };
      dispatch(createSnippet(snippetData));
      setSnippetName("");
    }
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      dispatch(inviteUser({ spaceId, email: inviteEmail }));
      setInviteEmail("");
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Space Details</h2>

      <div>
        <h3>Invite a Member</h3>
        <form onSubmit={handleInvite}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter user's email"
          />
          <button type="submit" disabled={inviteLoading}>
            {inviteLoading ? "Sending..." : "Invite"}
          </button>
          {inviteSuccess && <p style={{ color: "green" }}>{inviteSuccess}</p>}
          {inviteError && <p style={{ color: "red" }}>{inviteError}</p>}
        </form>
      </div>
      <hr />

      <h3>Create Snippet</h3>
      <form onSubmit={handleCreateSnippet}>
        <input
          type="text"
          value={snippetName}
          onChange={(e) => setSnippetName(e.target.value)}
          placeholder="New Snippet Name"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Snippet"}
        </button>
      </form>
      <hr />

      <h3>Snippets</h3>

      {isLoading && snippets.length === 0 && <p>Loading snippets...</p>}
      {error && <p>Error: {error}</p>}

      {snippets && snippets.length > 0 ? (
        <ul>
          {snippets.map((snippet) => (
            <li key={snippet._id}>
              <Link to={`/snippet/${snippet._id}`}>{snippet.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>This space has no snippets. Create one!</p>
      )}
    </div>
  );
};

export default SpacePage;
