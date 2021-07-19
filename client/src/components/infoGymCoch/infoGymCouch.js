import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setGymOrCoach, setGymOrCoachPost } from "./../../reducers/infoGymCoch";
import { AddComment, setComment } from "./../../reducers/commints";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import jwt, { decode } from "jsonwebtoken";
import io from "socket.io-client";
import "./infoGymCoch.css";
let socket;
const CONNECTION_PORT = "http://localhost:5000";

socket = io(CONNECTION_PORT);
//gymInfo
const GymAndCouchInfo = ({ id }) => {
  const [comments, setAComments] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // const decoratedOnClick = useAccordionToggle(eventKey, onClick);
  const history = useHistory();
  const role = useParams().id;
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      token: state.loginReducer.token,
      GymOrCouch: state.infoGymCochReducer.GymOrCouch,
      allPosts: state.infoGymCochReducer.allPosts,
      comments: state.commentsReducer.comments,
    };
  });
  const user = decode(state.token);

  const getSportByType = () => {
    axios.get(`/usersInfo/${role}`).then((result) => {
      dispatch(setGymOrCoach(result.data));
    });
  };
  const getAllPosts = () => {
    axios.get(`/usersPost1/${role}`).then((result) => {
      dispatch(setGymOrCoachPost(result.data));
      result.data.map((ele) => {
        axios.get(`/comments/${ele.post_id}/`).then((result) => {
          result.data.map((elm) => {
            dispatch(
              setComment([
                {
                  postID: ele.post_id,
                  comment: elm.comment,
                  firstName: elm.firstName,
                },
              ])
            );
          });
        });
      });
    });
  };
  /////socket io
  socket.on("receive_message", (data) => {
    setMessageList([...messageList, data]);
  });

  const connectToRoom = () => {
    //role = rome number
    socket.emit("join_room", role); //raise event
  };

  const sendMessage = () => {
    if(message){
      const user = jwt.decode(state.token);
      console.log("....user....", user);
      const messageContent = {
        role,
        content: {
          author: user.firstName,
          message,
          authorPhoto: user.image,
        },
      };
      
      socket.emit("send_message", messageContent); //raise event
      setMessageList([...messageList, messageContent.content]);
      setMessage("");
    }
  };

  const addToFav = async () => {
    const postId = "";
  };

  //////////////////////////// end socket io ...
  useEffect(() => {
    getSportByType();
    getAllPosts();
    connectToRoom();
  }, []);

  return (
    <div className="GymCooch">
      <div className="hamish"></div>
      <div className="devDes">
        <div>
          <img
            className="ImgCoachGym"
            src={state.GymOrCouch && state.GymOrCouch[0].image}
            alt=""
          ></img>
        </div>
        <div>
          <div className="NameLabel">
            {state.GymOrCouch &&
              state.GymOrCouch[0].firstName +
                `  ` +
                state.GymOrCouch[0].lastName}
          </div>
          <div className="DesLabel">
            {state.GymOrCouch && state.GymOrCouch[0].description}
          </div>
        </div>
        {state.token ? 
        <div className="buttonLeft">
          <Button className="styleButton123" variant="outline-dark">
            <a href="http://localhost:3032/" className="aHrefStyle">
              video
            </a>
          </Button>
          <Button
            className="styleButton123"
            variant="outline-dark"
            onClick={async () => {
              const user = await jwt.decode(state.token);
              console.log("user", user);
              history.push(`/chat/${role}/${user.userId}`);
            }}
            >
            chat
          </Button>
        </div>
            : <div> </div>}
      </div>

      <div className="devPosts">
        <div>
          {state.allPosts &&
            state.allPosts.map((ele, a) => {
              return (
                <div className="postPhotoInfoPage">
                  <div className="backgroundPhotoCard">
                    <img
                      alt="postPhoto"
                      src={ele.photo}
                      className="photoPostSlider"
                    />
                    {state.token ? 
                    <Button
                    className="styleButton123  favButton"
                    variant="outline-dark"
                    onClick={async () => {
                      const user = jwt.decode(state.token);
                      console.log("user", user);
                      const userID = user.userId;
                      const postID = ele.post_id;
                      const a = await axios.post("/favorite", {
                        userID,
                        postID,
                      });
                    }}
                    >
                      Add to favorite
                    </Button>
                      : <div> </div>}
                  </div>
                  <div className="colPostAndComments">
                    <div className="row1Post">
                      <p>{ele.post}</p>
                    </div>
                    <div>
                      <div className="titleCommentStyle1"> Comments </div>
                      <div className="row2Comments">
                        {state.comments &&
                          state.comments.map((elem) => {
                            if (elem[0].postID === ele.post_id) {
                              return (
                                <div className="borderCommentStyle9">
                                  <span className="nameUserAddCommentStyle1">
                                    {elem[0].firstName} :{" "}
                                  </span>{" "}
                                  &nbsp;
                                  <span>{elem[0].comment}</span>
                                </div>
                              );
                            }
                          })}
                      </div>
                    </div>
                    {state.token ? (
                      <div className="inpitAndButtonStyle1">
                        <input
                          className="inputStyle1"
                          value={comments}
                          onChange={(e) => {
                            setAComments(e.target.value);
                          }}
                          placeholder="comment here"
                        ></input>
                        <Button
                          variant="outline-dark"
                          className="buttonStyleAddComment5"
                          onClick={async () => {
                            dispatch(
                              AddComment([
                                {
                                  postID: ele.post_id,
                                  comment: comments,
                                  firstName: user.firstName,
                                },
                              ])
                            );
                            setAComments("");
                            await axios.post("/comments", {
                              comment: comments,
                              post_id: ele.post_id,
                              commenter_id: user.userId,
                            });
                          }}
                        >
                          add comments
                        </Button>
                      </div>
                    ) : (
                      <div> </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="devChat">
        <div className="publicChatStyle1">
          {messageList.map((ele, i) => {
            console.log(".....elemant.....", ele);
            return (
              <div className="liveChatGridStyle1">
                <div>
                  <img
                    src={ele.authorPhoto}
                    className="imageLiveChatStyle1"
                    alt=" "
                    />
                </div>
                <div key={i} className="allStyle1">
                  <div className="liveChatAutherNameStyle1">
                    [ {ele.author} ]
                  </div>
                  <div className="liveChatAutherMessageStyle1">
                    {ele.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          {state.token ? 
        <div className="textereaChatStyle1">
          <input
            value={message}
            className="textereaBoxStyle1"
            type="text"
            placeholder="Write your message here ..."
            onChange={(e) => setMessage(e.target.value)}
            required
            />
          <Button
            variant="outline-dark"
            className="buttonTextereaStyle1"
            onClick={sendMessage}
            >
            Send
          </Button>
        </div>
      : <div> 
        <Button
            variant="outline-dark"
            className="joinUsAndRegisterButton"
            onClick={ () =>{
              history.push("/register")
            }}
            >
            Join Us Now
          </Button>
          <Button
            variant="outline-dark"
            className="joinUsAndRegisterButton2"
            onClick={() =>{ history.push("/login")}}
            >
            Login
          </Button>
        </div>}
      </div>
      <div className="haish"></div>
    </div>
  );
};

export default GymAndCouchInfo;
