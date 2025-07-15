import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { FaMemory, FaMicrochip } from 'react-icons/fa';

function SystemMonitor() {
  const [ramUsage, setRamUsage] = useState(0);
  const [totalRam, setTotalRam] = useState(0);
  const [ramPercent, setRamPercent] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5073/systemMonitorHub')
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        connection.invoke('SendSystemUsage');
      })
      .catch((err: any) => console.error('Connection failed: ', err));

    connection.on('ReceiveSystemUsage', (data: any) => {
      setRamUsage(data.ramUsage);
      setTotalRam(data.totalRam);
      setRamPercent(((data.ramUsage / data.totalRam) * 100) || 0);
      setCpuUsage(data.cpuUsage || 0);
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="system-monitor-wrapper">
      {/* CPU Box */}
      <div className="system-monitor-card cpu-card">
        <div className="system-monitor-header">پردازنده</div>
        <div className="ram-icon-row">
          <FaMicrochip className="ram-icon" />
          <span className="ram-usage-text">
            {cpuUsage.toFixed(1)}%
          </span>
        </div>
        <div className="ram-progress-bar">
          <div
            className="ram-progress-fill cpu-progress-fill"
            style={{ width: `${cpuUsage}%` }}
          ></div>
        </div>
      </div>
      {/* RAM Box */}
      <div className="system-monitor-card ram-card">
        <div className="system-monitor-header">رم</div>
        <div className="ram-icon-row">
          <FaMemory className="ram-icon" />
          <span className="ram-usage-text">
            {ramUsage} / {totalRam}GB ({ramPercent.toFixed(0)}%)
          </span>
        </div>
        <div className="ram-progress-bar">
          <div
            className="ram-progress-fill"
            style={{ width: `${ramPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default SystemMonitor;