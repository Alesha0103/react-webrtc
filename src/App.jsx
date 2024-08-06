import React from "react";
import io from "socket.io-client";
import { ACTIONS } from "./soket/actions";

import styles from "./App.module.scss";
import classNames from "classnames";

const socket = io("http://localhost:3001");

export const App = () => {
  const [ clientId, setClientId ] = React.useState("");
  const [ message, setMessage ] = React.useState("");
  const [ messages, setMessages ] = React.useState([]);

  const addDividerCheck = (messages) => {
    let isIncommingMessage;
    const newMessages = [...messages];

    newMessages.reduce((acc, currentMessage, index, array) => {
      if (!!index) {
        isIncommingMessage = currentMessage.id !== array[index - 1].id;
      }
    }, []);

    return isIncommingMessage;
  };

  React.useEffect(() => {
    socket.on(ACTIONS.RECEIVE_MESSAGE, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on(ACTIONS.SOCKET_ID, (id) => {
      setClientId(id);
    });

    return () => {
      socket.off(ACTIONS.RECEIVE_MESSAGE);
    };
  }, []);

  const sendMessage = () => {
    const messageWithId = {
      id: socket.id,
      text: message
    };
    socket.emit('send-message', message);
    setMessages((prevMessages) => [...prevMessages, messageWithId]);
    setMessage('');
  };

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>WebRTC Chat</h1>
      <div className={styles.chat}>
        {messages.map((msg, index) => (
          <div
            key={msg.id+index}
            className={classNames(
              styles.messages,
              { [styles.incommingMessages]: msg.id !== clientId }
            )}
          >
            <span>
              {msg.text}
            </span>
          </div>
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
