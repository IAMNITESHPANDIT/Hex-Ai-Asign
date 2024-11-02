import GlassCard from "../glasscard/GlassCard";
import { User } from "../types";
import Button from "../../button";
import "./userlist.style.scss";
import Avtar from "../../../assets/avatar.jpeg";
import Nodata from "../../nodata/Nodata";

export interface CardsProps {
  users: User[];
  cb: (id?: string) => void;
  label: string;
}

const UserList: React.FC<CardsProps> = ({
  users,
  cb,
  label = "Add Friend",
}) => {
  return (
    <div className="user-list-container">
      {users.length > 0 ? (
        users.map((user: any) => (
          <GlassCard key={user._id} className="profile-card">
            <img
              src={user.profilePicture || Avtar}
              alt={`${user.name}'s profile`}
              className="profile-picture"
            />
            <div className="profile-details">
              <h4 className="profile-name">{user.name}</h4>
              <p className="profile-username">@{user.username}</p>
              <Button
                label={label}
                type="button"
                onClick={() => cb(user?._id || "")}
                className="add-friend-button"
              />
            </div>
          </GlassCard>
        ))
      ) : (
        <Nodata msg="No user available" />
      )}
    </div>
  );
};

export default UserList;
