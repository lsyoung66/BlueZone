import React, { useState, useEffect } from 'react';
import { FaWifi } from 'react-icons/fa';

function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
      <div className="status-bar">
      <div className="wifi-icon"><FaWifi /></div>
        <div className="time">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
  );
}

export default StatusBar;