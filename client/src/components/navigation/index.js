import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decode } from "jsonwebtoken";
import { setSearch111 } from "./../../reducers/search";
import { FormControl, Form, Navbar, Nav, NavDropdown, Button, Image } from "react-bootstrap";
import axios from "axios";
import "./navigation.css";

const Navigation = () => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const user = decode(localStorage.getItem("token"));
  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      profile: state.profileReducers.profile,
    };
  });

  useEffect(() => {
    if (state.token) {
      axios
        .get(`/users/${user.userId}`)
        .then((res) => {
          setName(res.data[0].firstName + " " + res.data[0].lastName);
          setShow(!show);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const searchFun = async () => {
    const searchedGym = await axios.post("/search", {
      firstName: search,
    });
    if (searchedGym.data[0]) {
      dispatch(setSearch111(searchedGym.data));
      history.push("/search");
    } else {
      history.push("/search");
    }
  };

  const getName = () => {
    axios
      .get(`/users/${user.userId}`)
      .then((res) => {
        setName(res.data[0].firstName + " " + res.data[0].lastName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (state.token) {
      getName();
    }
  }, [show]);

  return (
    <>
      <Navbar className="colorNav" expand="lg" fixed="top">
        <Navbar.Brand href="#home">
          {" "}
          <Link to="/" style={{ color: "black" }}>
            <Image src="https://i.ibb.co/k94s0qF/Screenshot-1.png" alt="logo" className="logo" />
          </Link>{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              {!state.token ? (
                <Link to="/register" style={{ color: "black" }}>
                  Register
                </Link>
              ) : (
                ""
              )}
            </Nav.Link>
            <Nav.Link>
              {!state.token ? (
                <Link to="/signIn" style={{ color: "black" }}>
                  Login
                </Link>
              ) : (
                ""
              )}
            </Nav.Link>
            {state.token ? (
              <NavDropdown title={name} id="basic-nav-dropdown">
                {/* <NavDropdown.Item >{state.token ? <Link to="/dashboard" style={{color:"black"}}>Dashboard</Link> : ""}</NavDropdown.Item> */}
                {user && user.roleId === 2 ? (
                  <div></div>
                ) : (
                  <div>
                  <NavDropdown.Item>
                    <Link to="/posts" style={{color: "black"}}>My Posts</Link>
                  </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </div>
                )}
                {user && user.roleId === 2 ? (
                  <div>
                  <NavDropdown.Item>
                    <Link to="/user" style={{color: "black"}}>Profile</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  </div>
                ) : (
                  <div> 
                  <NavDropdown.Item>
                    <Link to="/profile" style={{color: "black"}}>Profile</Link>
                  </NavDropdown.Item>
                    <NavDropdown.Divider />
                  </div>
                )}
                <NavDropdown.Item>
                  {state.token ? (
                    <Link to="/signIn" style={{ color: "black" }}>
                      LogOut
                    </Link>
                  ) : (
                    ""
                  )}
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              ""
            )}
          </Nav>
          <Form inline>
            <FormControl
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              style={{ width: "20rem" }}
            />
            <Button className="styleButton" onClick={searchFun} variant="outline-dark">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Navigation;
