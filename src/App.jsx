import React from "react";
import io from "socket.io-client";
import { ACTIONS } from "./soket/actions";

const socket = io("http://localhost:3001");

export const App = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    socket.on(ACTIONS.RECEIVE_MESSAGE, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off(ACTIONS.RECEIVE_MESSAGE);
    };
  }, []);

  const sendMessage = () => {
    socket.emit(ACTIONS.SEND_MESSAGE, message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebRTC Chat</h1>
      <div style={{ marginBottom: "20px" }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        style={{ marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};
