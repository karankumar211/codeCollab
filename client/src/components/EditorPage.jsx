import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSnippetById, updateSnippet } from "../features/snippetSlice";
import Navbar from "./Navbar";

import AceEditor from "react-ace";
import ace from "ace-builds";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
ace.config.set("basePath", "/");
import { io } from "socket.io-client";

const EditorPage = () => {
  const { snippetId } = useParams();
  const dispatch = useDispatch();

  const { currentSnippet, isLoading } = useSelector((state) => state.snippets);

  const [code, setCode] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    const socket = socketRef.current;
    socket.emit("join-snippet", snippetId);

    socket.on("receive-code-change", (receivedContent) => {
      // --- ADDED THIS LOG (from previous step) ---
      console.log("--- RECEIVED CODE CHANGE:", receivedContent);
      setCode(receivedContent);
    });
    return () => {
      socket.disconnect();
    };
  }, [snippetId]);

  useEffect(() => {
    if (snippetId) {
      dispatch(fetchSnippetById(snippetId));
    }
  }, [dispatch, snippetId]);

  useEffect(() => {
    if (currentSnippet) {
      setCode(currentSnippet.content);
    }
  }, [currentSnippet]);

  // This function is correct
  const onEditorchange = (newCode) => {
    setCode(newCode);
    // --- ADDED THIS LOG (from previous step) ---
    console.log("--- EMITTING CODE CHANGE:", newCode);
    socketRef.current.emit("code-change", {
      snippetId: snippetId,
      content: newCode,
    });
  };

  const handleSave = () => {
    dispatch(updateSnippet({ snippetId, content: code }));
  };

  if (isLoading || !currentSnippet) {
    return (
      <div>
        <Navbar />
        <p>Loading Editor...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h3>Editing: {currentSnippet.name}</h3>

      <AceEditor
        mode={currentSnippet.language}
        theme="monokai"
        // --- FIX: This now calls your function instead of just setCode ---
        onChange={onEditorchange}
        value={code}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        width="100%"
        height="600px"
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditorPage;