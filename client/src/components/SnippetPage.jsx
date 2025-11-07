import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSnippetById } from "../features/snippetSlice";

const SnippetPage = () => {
  const { snippetId } = useParams();
  const dispatch = useDispatch();
  const { currentSnippet, isLoading, error } = useSelector(
    (state) => state.snippets
  );
  useEffect(() => {
    if (snippetId) {
      dispatch(fetchSnippetById(snippetId));
    }
  }, [snippetId, dispatch]);
  return (
    <div>
      this is current snippet page
      {isLoading && <p>Loading snippet...</p>}
      {error && <p>Error: {error}</p>}
      {currentSnippet ? (
        <div>
          <h2>{currentSnippet.name}</h2>
          <pre>{currentSnippet.content}</pre>
          <p>Language: {currentSnippet.language}</p>
        </div>
      ) : (
        !isLoading && <p>No snippet found.</p>
      )}
    </div>
  );
};

export default SnippetPage;
