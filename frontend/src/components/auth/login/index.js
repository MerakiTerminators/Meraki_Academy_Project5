import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import axios from "axios";
import { setToken } from "../../../reducers/login";
import { Form, Button } from 'react-bootstrap';


const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      user: state.loginReducer.user,
      loggedIn: state.loginReducer.loggedIn,
      sports: state.sportReducer.sports,
    };
  });
  useEffect(() => {
    loggedOut();
  }, []);

  const loggedOut = () => {
    localStorage.clear();
    dispatch(setToken({ token: "", user: {}, loggedIn: false }));
  };
  //this function to handle the submitted form
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { email, password })
      .then((result) => {
        if (result) {
          const user = jwt.decode(result.data);
          dispatch(setToken({ token: result.data, user, loggedIn: true }));
          localStorage.setItem("token", result.data);
          setMessage("The user has been loggedIn successfully ");
          setTimeout(function () {
            history.push("/dashboard");
          }, 2000);
        } else {
          setMessage("Error happened while login, please try again");
        }
      })
      .catch((err) => {
        setMessage(err.response);
      });
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
        <Form.Text className="text-muted">
          {message && <div>{message}</div>}
        </Form.Text>
      </Form>
    </>
  );
};

export default Login;
