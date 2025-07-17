import React from 'react';

interface InfoBoxProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  bgClass?: string;
  progress?: number;
}

const InfoBox: React.FC<InfoBoxProps> = ({ icon, title, value, bgClass = '', progress }) => {
  return (
    <div className={`system-monitor-card ${bgClass}`.trim()}>
      <div className="system-monitor-header">{title}</div>
      <div className="ram-icon-row">
        {icon}
        <span className="ram-usage-text">{value}</span>
      </div>
      <div className="ram-progress-bar">
        <div
          className={bgClass.includes('cpu') ? 'ram-progress-fill cpu-progress-fill' : 'ram-progress-fill'}
          style={{ width: progress !== undefined ? `${progress}%` : 0 }}
        ></div>
      </div>
    </div>
  );
};

export default InfoBox; 