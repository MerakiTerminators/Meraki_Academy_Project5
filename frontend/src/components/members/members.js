import React from "react";
import "./style.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMembers, setMembersType, setUserId } from "../../reducers/members";
import { decode } from "jsonwebtoken";

const Members = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => {
    return {
      members: state.MembersReducer.members,
      id: state.MembersReducer.id,
    };
  });

  const getAllMember = async () => {
    const allUsers = await axios.get("http://localhost:5000/usersPost");
    console.log("all", allUsers.data);
    dispatch(setMembers(allUsers.data));
  };
  const getToken = async () => {
    const user = await decode(localStorage.getItem("token"));
    dispatch(setUserId({ userId: user.userId, role: user.roleId }));
  };

  useEffect(() => {
    getToken();
    getAllMember();
  }, []);

  return (
    <>
      {state.id.role == 3 ? (
        <div className="allmembers">
          {state.members &&
            state.members.map((ele) => {
              console.log("userId", state.id.userId);
              console.log("posterId", ele.poster_id);
              if (state.id.userId === ele.poster_id) {
                return (
                  <div className="">
                    <button>{ele.firstName}</button>
                    <button>chat</button>
                    <button
                      onClick={async (e) => {
                        await axios.delete(`http://localhost:5000/usersPost`, {
                          userId: ele.user_Id,
                          postId: ele.post_id,
                        });
                      }}
                    >
                      delete
                    </button>
                  </div>
                );
              }
            })}
        </div>
      ) : state.id.role == 4 ? (
        <div className="allmembers">
          {state.members.map((ele) => {
            if (state.id.userId === ele.poster_id) {
              return (
                <div className="">
                  <button>{ele.firstName}</button>
                  <button>video</button>
                  <button>chat</button>
                  <button
                    onClick={async (e) => {
                      await axios.delete(`http://localhost:5000/usersPost`, {
                        userId: ele.user_Id,
                        postId: ele.post_id,
                      });
                    }}
                  >
                    delete
                  </button>{" "}
                </div>
              );
            }
          })}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Members;
