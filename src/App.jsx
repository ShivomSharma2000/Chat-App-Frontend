import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { Container, Button, TextField, Typography, Stack } from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";

const App = () => {
  const socket = useMemo(()=> io("http://localhost:3000"), [])
  const [message, setmMessage] = useState("");
  const [messages, setmMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  console.log("messages:: ",messages);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected: ", socket.id);
    });

    socket.on("welcome", (message) => {
      console.log(message);
    });
    
    socket.on("receive-message", (message) => {
    console.log("message=> ",message);
      setmMessages(messages=> [...messages, message]);
    })

    //when our useEffect refresh or run then initally our reuturn/cleanup function will call.
    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoomHandler = async(e) => {
    e.preventDefault();
    socket.emit('join-room', roomName);
    setRoomName("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    socket.emit("message", {room, message});
    setmMessage("");
  };

  return (
    <Container>
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
         <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Join Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setmMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />

        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Socket Id"
          variant="outlined"
        />

        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {
          messages.map((m, i)=> (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>
    </Container>
  );
};

export default App;
