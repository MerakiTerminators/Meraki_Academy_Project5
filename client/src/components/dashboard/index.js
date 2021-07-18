import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSports, getSport } from "../../reducers/sports";
import { setToken } from "../../reducers/login";
import { useHistory } from "react-router-dom";
import Footer from "./../footer/index";
import { CardDeck, Carousel, Card, Button, Row, Col } from "react-bootstrap";
import jwt from "jsonwebtoken";
import axios from "axios";
import "./dashboard.css";
import Images from "./../image/image";

const Dashboard = () => {
  const [type, setType] = useState("");
  const history = useHistory();
  localStorage.setItem("type", type);
  const icons = [
    "https://i.ibb.co/CK5npv6/humanpictos.png",
    "https://i.ibb.co/QM6f5gN/gloves.png",
    "https://i.ibb.co/XyLbknY/tennis.png",
    "https://i.ibb.co/gZ5vWbM/running.png",
    "https://i.ibb.co/Q9JrL0D/pilates.png",
    "https://i.ibb.co/StYs4M5/pilates-1.png",
  ];

  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      user: state.loginReducer.user,
      loggedIn: state.loginReducer.loggedIn,
      sports: state.sportReducer.sports,
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    getAllSports();
    saveToken(localStorage.getItem("token"));
  }, []);

  function saveToken(token) {
    const user = jwt.decode(token);
    // console.log("token decoded", user);
    if (user) {
      dispatch(setToken({ token, user, loggedIn: true }));
    }
  }
  useEffect(() => {
    
  }, []);

  const getAllSports = () => {
    axios
      .get("/sports")
      .then((result) => {
        if (result.length !== 0) {
          dispatch(setSports(result.data));
        } else {
          return "No Sports are found";
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const getSportByTypeButton = (e) => {
    axios.get(`/sport/${e.target.value}`).then((result) => {
      setType(e.target.value);
      dispatch(setSports(result.data));
      history.push(`/sports`);
      console.log("result.data....dashboard....", result.data);
    });
  };

  const getSportByType = (e) => {
    axios.get(`/sport/${e.target.id}`).then((result) => {
      setType(e.target.id);
      dispatch(setSports(result.data));
      history.push(`/sports`);
      console.log("result.data....dashboard....", result.data);
    });
  };

  const getSportByTypeImage = (e) => {
    axios.get(`/sport/${e.target.alt}`).then((result) => {
      setType(e.target.alt);
      dispatch(setSports(result.data));
      history.push(`/sports`);
      console.log("result.data....dashboard....", result.data);
    });
  };

  // you could see the state by
  console.log("úser", state);
  return (
    <>
      <Images />
      <div className="borderStyleAll">
        <div className="bigTittle2"> m o v e d &nbsp; &nbsp; c l u b</div>
        <div className="bigTittle">REACH YOUR <br/> GOALS‎</div>
        <div className="borderStyleT"></div>
      </div>
      <div className="redBorder">
        <Row md={3} className="g-4 padd1">
          {state.sports.map((elem, i) => (
            <Col>
              <Card style={{ width: "22rem", marginButton: "0rem", height: "22rem" }} className="newMarg">
                <Card.Img
                  variant="top"
                  src={icons[i]}
                  alt={elem.type}
                  className="imageCard pointer"
                  onClick={getSportByTypeImage}
                />
                <Card.Body>
                  <Card.Title id={elem.type} onClick={getSportByType} className="pointer boldStyle">
                    {elem.type}
                  </Card.Title>
                  <Card.Text className="descriptionStyle">{elem.description}</Card.Text>
                  <Button
                    variant="outline-dark"
                    value={elem.type}
                    className="buttonStyleHome"
                    onClick={getSportByTypeButton}
                  >
                    more{" "}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div className="slideshowDiv">
        <Carousel fade>
          <Carousel.Item>
            <img
              className="d-block imgH"
              src="https://www.davidlloyd.co.uk/cms/images/softwire-david-lloyd/image/upload/f_auto/v1/Tennis/tennis-hero.jpg"
              alt="Tennis"
            />
            <Carousel.Caption>
              <h3>Tennis</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block imgH"
              src="https://www.tributeboxing.com.au/uploads/slideshow/1536301415qkedwof37eb8x3o8qejg0s80h2s4kd.jpg"
              alt="Boxing"
            />
            <Carousel.Caption>
              <h3>Boxing</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block  imgH"
              src="https://www.runtastic.com/blog/wp-content/uploads/2018/05/thumbnail_1200x800-1-1024x683.jpg"
              alt="Running"
            />
            <Carousel.Caption>
              <h3>Running</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block imgH"
              src="https://www1.health.gov.au/internet/main/publishing.nsf/AttachmentsByTitle/sport-national-integrity-of-sport-unit-carousel-images/$FILE/10612%20Sport%20images19.jpg"
              alt="Swimming"
            />
            <Carousel.Caption>
              <h3>Swimming</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block  imgH"
              src="https://www.polar.com/sites/default/files/static/categories/team_sports-desktop.jpg"
              alt="Football"
            />
            <Carousel.Caption>
              <h3>Football</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block  imgH"
              src="https://cdn.workgreat.orchardroad.org/wp-content/uploads/2018/04/Battle-Ropes-900x450.jpg"
              alt="Gym"
            />
            <Carousel.Caption>
              <h3>Gym</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="QDiv">
        <div>
          <img className="quote1" src="https://i.ibb.co/zFN2g18/quote.png" alt="quote"></img>
        </div>
        <div>
          <p className="quoteText place">
            The point is whether or not I improved over yesterday. In long-distance running the only opponent you have
            to beat is yourself, the way you used to be.
          </p>
        </div>
        <div>
          <img className="quote2" src="https://i.ibb.co/zFN2g18/quote.png" alt="quote"></img>
        </div>
      </div>
      <div className="About">
        <CardDeck>
          <Card>
            <Card.Img variant="top" className="ourPhoto" src="https://i.ibb.co/WFdV0xQ/Pics-Art-07-14-12-25-59.jpg" />
            <Card.Body>
              <Card.Title style={{fontWeight: "600"}}>Bayan Daboubash</Card.Title>
              <Card.Text style={{height: "10"}}>I have an ambition to become the best programmer in the world.</Card.Text>
              <Card.Text>bayan.daboubash2000@gmail.com</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" className="ourPhoto" src="https://i.ibb.co/jLbL5k1/C18-Maisaa.jpg" />
            <Card.Body>
              <Card.Title style={{fontWeight: "600"}}>Maisaa Alkhder</Card.Title>
              <Card.Text style={{height: "10"}}>I have an ambition to become the best programmer in the world.</Card.Text>
              <Card.Text>maisaa.alkhedr@gmail.com</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" className="ourPhoto" src="https://f.top4top.io/p_19898rk101.jpeg" />
            <Card.Body>
              <Card.Title style={{fontWeight: "600"}}>Mohammad Alnabale</Card.Title>
              <Card.Text style={{height: "10"}}>I have an ambition to become the best programmer in the world.</Card.Text>
              <Card.Text>nabali@gmail.com</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img
              variant="top"
              className="ourPhoto"
              src="https://i.ibb.co/gjLZCB0/Whats-App-Image-2021-07-14-at-1-10-29-AM.jpg"
            />
            <Card.Body>
              <Card.Title style={{fontWeight: "600"}}>Ibrahem Tormenters</Card.Title>
              <Card.Text style={{height: "10"}}>I have an ambition to become the best programmer in the world</Card.Text>
              <Card.Text>ibrahim@gmail.com</Card.Text>
            </Card.Body>
          </Card>
        </CardDeck>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
