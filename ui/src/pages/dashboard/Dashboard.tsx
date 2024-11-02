import React, { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import UserList from "../../components/dashboard/userlist/UserList";
import MessageDisplay from "../../components/dashboard/message/MessageDisplay";
import { User } from "../../components/dashboard/types";
import "./dashboard.style.scss";
import { get, post, recordActivity } from "../../utils/network";
import { getLocalStorageItem } from "../../utils/localStorageUtils";
import ChatInput from "../../components/dashboard/chatinput/ChatInput";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [friends, setFriends] = useState<User[]>([]);

  const [users, setUsers] = useState<any>([]);

  const [messages, setMessages] = useState<any>([]);

  const userId = getLocalStorageItem("userId");

  const [chatEnabled, setChatEnabled] = useState({
    id: "",
    flag: false,
  });

  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response: any = await get(
        "/api/v1/user",
        getLocalStorageItem("access_token")
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendList = async () => {
    setLoading(true);
    try {
      const response: any = await get(
        "/api/v1/friend",
        getLocalStorageItem("access_token")
      );
      setFriends(response.data.friends);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response: any = await get(
        `/api/v1/user/activity?userId=${userId}`,
        getLocalStorageItem("access_token")
      );
      setMessages(response.data.activityLogs);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
    fetchFriendList();
    fetchMessages();
  }, []);

  if (loading) {
    return <Loader />;
  }
  const addFriend = async (id?: string) => {
    try {
      const response: any = await post(
        "/api/v1/friend",
        {
          friendId: id,
        },
        getLocalStorageItem("access_token")
      );
      recordActivity(
        userId,
        `Friend added ${id}`,
        getLocalStorageItem("access_token")
      );
      fetchFriendList();
      fetchUserList();
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const enableChat = async (id?: string) => {
    setChatEnabled({
      id: id || "",
      flag: true,
    });
  };

  const chatWithFriend = async (id: string, msg: string) => {
    try {
      const response: any = await post(
        "/api/v1/chat",
        {
          receiverId: id,
          message: msg,
        },
        getLocalStorageItem("access_token")
      );
      console.log("response", response);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="dashboard">
        <UserList users={users} label="Add friend" cb={addFriend} />
        <UserList users={friends} label="Chat" cb={enableChat} />
        <MessageDisplay messages={messages} />
        {chatEnabled.flag && (
          <ChatInput receiverId={chatEnabled.id} sendMsg={chatWithFriend} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
