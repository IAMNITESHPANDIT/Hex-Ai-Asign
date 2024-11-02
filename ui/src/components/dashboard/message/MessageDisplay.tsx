import React from "react";
import GlassCard from "../glasscard/GlassCard";
import { FaCheckCircle } from "react-icons/fa";
import "./message.style.scss";
import Nodata from "../../nodata/Nodata";
interface ActivityLog {
  activity: string;
  date: string;
}

interface MessageDisplayProps {
  messages: ActivityLog[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => (
  <GlassCard className="activity-log-card">
    <h3 className="activity-log-title">Activity Log</h3>
    <ul className="activity-log-list">
      {messages.length > 0 ? (
        messages.map((log: any, index) => (
          <li className="activity-log-item" key={log._id || index}>
            <div className="activity-log-icon">
              <FaCheckCircle />
            </div>
            <div className="activity-log-content">
              <p className="activity-text">{log.activity}</p>
              <p className="activity-date">
                {new Date(log.date).toLocaleString()}
              </p>
            </div>
          </li>
        ))
      ) : (
        <Nodata msg="No Activity found" />
      )}
    </ul>
  </GlassCard>
);

export default MessageDisplay;
