import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const styles = {
  container: {
    maxWidth: 650,
    height: "80vh",
    margin: "20px auto",
    border: "1px solid #ddd",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#ECE5DD",
  },
  header: {
    backgroundColor: "#075E54",
    color: "white",
    padding: "15px",
    fontWeight: "bold",
    fontSize: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    userSelect: "none",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  messageRowSent: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 8,
    color: "rgba(0, 0, 0, 0.7)",
  },
  messageRowReceived: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 8,
    color: "rgba(0, 0, 0, 0.7)",
  },
  bubbleSent: {
    maxWidth: "60%",
    padding: 10,
    borderRadius: 8,
    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
    backgroundColor: "#25D366", // WhatsApp green for sent messages
    color: "white", // white text inside
    display: "flex",
    flexDirection: "column",
  },
  bubbleReceived: {
    maxWidth: "60%",
    padding: 10,
    borderRadius: "8px 8px 8px 0",
    boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
    backgroundColor: "#FFF",
    display: "flex",
    flexDirection: "column",
  },
  sender: {
    fontSize: 12,
    fontWeight: 600,
    color: "#075E54",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 6,
  },
  footer: {
    display: "flex",
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "1px solid #ccc",
    outline: "none",
    fontSize: 16,
    resize: "none",
  },
  fileInput: {
    cursor: "pointer",
  },
  sendBtn: {
    backgroundColor: "#075E54",
    color: "white",
    border: "none",
    borderRadius: 20,
    padding: "8px 16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  filePreview: {
    marginTop: 6,
    maxWidth: 150,
    borderRadius: 6,
  },
};

const socket = io("http://localhost:5000"); // adjust if backend URL is different

function MessagePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Try multiple keys to get current user name from localStorage
  const currentUserName =
    localStorage.getItem("name") ||
    localStorage.getItem("teacherName") ||
    localStorage.getItem("username") ||
    "Me";

  const currentUserModel = localStorage.getItem("model") || "student"; // or "teacher" accordingly

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch existing messages from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/messages")
      .then((res) => res.json())
      .then((data) => {
        // Map messages from backend to match local state shape
        const mapped = data.map((msg) => ({
          id: msg._id,
          sender: msg.senderName || "Unknown",
          senderModel: msg.senderModel,
          text: msg.text,
          file: msg.fileUrl
            ? {
                url: `http://localhost:5000${msg.fileUrl}`,
                type: msg.fileType,
                name: msg.fileUrl.split("/").pop(),
              }
            : null,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          sentByCurrentUser: (msg.senderName || "") === currentUserName,
        }));
        setMessages(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
      });
  }, [currentUserName]);

  // Listen for new messages from socket.io
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      // Map incoming message
      const incomingMsg = {
        id: msg._id,
        sender: msg.senderName || "Unknown",
        senderModel: msg.senderModel,
        text: msg.text,
        file: msg.fileUrl
          ? {
              url: `http://localhost:5000${msg.fileUrl}`,
              type: msg.fileType,
              name: msg.fileUrl.split("/").pop(),
            }
          : null,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sentByCurrentUser: (msg.senderName || "") === currentUserName,
      };
      setMessages((prev) => [...prev, incomingMsg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentUserName]);

  // Send message handler
  const handleSend = async () => {
    if (!input.trim() && !file) return;

    // Defensive check before sending
    if (!currentUserName || currentUserName === "Me" || currentUserName === "undefined") {
      alert("Your user name is not set properly. Please log in again.");
      return;
    }

    console.log("Sending message from user:", currentUserName);

    const formData = new FormData();
    formData.append("senderName", currentUserName);
    formData.append("senderModel", currentUserModel);
    formData.append("text", input);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to send message");

      await res.json();

      // We don't add message locally here, because socket.io will emit it back and update state
      setInput("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Group Chat</header>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={msg.sentByCurrentUser ? styles.messageRowSent : styles.messageRowReceived}
          >
            <div style={msg.sentByCurrentUser ? styles.bubbleSent : styles.bubbleReceived}>
              {!msg.sentByCurrentUser && <div style={styles.sender}>{msg.sender}</div>}
              {msg.text && <div>{msg.text}</div>}

              {msg.file && (
                <div style={{ marginTop: 6 }}>
                  {msg.file.type.startsWith("image/") ? (
                    <img src={msg.file.url} alt="attachment" style={styles.filePreview} />
                  ) : (
                    <a href={msg.file.url} download={msg.file.name} target="_blank" rel="noopener noreferrer">
                      {msg.file.name}
                    </a>
                  )}
                </div>
              )}

              <div style={styles.timestamp}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer style={styles.footer}>
        <input
          type="file"
          style={styles.fileInput}
          onChange={handleFileChange}
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        <textarea
          rows={1}
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendBtn}>
          Send
        </button>
      </footer>
    </div>
  );
}

export default MessagePage;
