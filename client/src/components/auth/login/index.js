import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import axios from "axios";
import { setToken } from "../../../reducers/login";
import GoogleLogin from "react-google-login";
import { Form, Button, Image } from "react-bootstrap";
import "./login.css";

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
      sports: state.sportReducer.sports,
    };
  });

  const loginWithGoogle = (response) => {
    //go data base and save the response if the response
    // exists login directly if not signup this user
    // in data base and put the role_id is 2 like user
    localStorage.setItem("token", response.accessToken);
    dispatch(setToken({ token: response.accessToken}));
    history.push("/");
  };

  useEffect(() => {
    loggedOut();
  }, []);

  const loggedOut = () => {
    localStorage.clear();
    dispatch(setToken({ token: "", user: {} }));
  };
  //this function to handle the submitted form
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/login", { email, password })
      .then((result) => {
        if (result) {
          const user = jwt.decode(result.data);
          dispatch(setToken({ token: result.data, user }));
          localStorage.setItem("token", result.data);
          setMessage("The user has been loggedIn successfully ");
          setTimeout(function () {
            if (user.roleId == 3 || user.roleId == 4) {
              history.push("/posts");
            } else {
              history.push("/dashboard");
              window.location.reload();
            }
          }, 0);
        } else {
          setMessage("Error happened while login, please try again");
        }
      })
      .catch((err) => {
        setMessage("Password or Email is incorrect");
      });
  };
  const validateForm = () => {
    return email.length > 0 && password.length > 0;
  };

  return (
    <>
      <div className="Login body1">
        <div className="containerL1">
          <Form onSubmit={handleSubmit}>
            <h2 className="TextStyle">Login</h2>
            <Form.Group size="lg" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group size="lg" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Button size="lg" variant="outline-dark" type="submit" className="styleButton1">
                Login
              </Button>
            </Form.Group>
            <GoogleLogin
              clientId="701876201185-nj6jqs8eqjrehl98410phe5vu3spjfgb.apps.googleusercontent.com"
              buttonText="login with google"
              onSuccess={loginWithGoogle}
              onFailure={loginWithGoogle}
              cookiePolicy={"single_host_origin"}
              className="pointer marg styleButton1"
            />
            <Form.Label>{message && <div>{message}</div>}</Form.Label>
          </Form>
          <div>
            <Image
              className="loginImage"
              src="https://i.ibb.co/QdMHGDn/logan-weaver-p-YQ2-ASycjg-I-unsplash.jpg"
              alt="logan-weaver-p-YQ2-ASycjg-I-unsplash"
              border="0"
              rounded
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
