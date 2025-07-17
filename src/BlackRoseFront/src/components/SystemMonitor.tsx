import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { FaMemory, FaMicrochip, FaNetworkWired, FaTachometerAlt } from 'react-icons/fa';
import api from '../services/api';
import InfoBox from './InfoBox';

// تعریف نوع برای NetworkUsageReport
interface NetworkUsageReport {
  totalBytesReceived: number;
  totalBytesSent: number;
  // اگر فیلدهای دیگری هم هست اضافه کنید
}

interface DiskReport {
  totalSpaceGB :number;
  freeSpaceGB :number;
  usedSpaceGB :number;
}

function SystemMonitor() {
  

  const [ramUsage, setRamUsage] = useState(0);
  const [totalRam, setTotalRam] = useState(0);
  const [ramPercent, setRamPercent] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);

  const [diskReport, setDiskReport] = useState<DiskReport>();

  const [dailyNetworkReport, setDailyNetworkReport] = useState<NetworkUsageReport[]>([]);
  const [weeklyNetworkReport, setWeeklyNetworkReport] = useState<NetworkUsageReport[]>([]);
  const [monthlyNetworkReport, setMonthlyNetworkReport] = useState<NetworkUsageReport[]>([]);
  const [totalNetworkReport, setTotalNetworkReport] = useState<NetworkUsageReport[]>([]);

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
      setUploadSpeed(data.sentSpeed);
      setDownloadSpeed(data.receivedSpeed)
    });

    // دریافت اطلاعات دیسک
    api.get('/api/SystemMonitor/get-disk-space')
      .then((response) => {
        setDiskReport(response.data || 0);
        console.log(diskReport)
      })
      .catch((err) => { 
        console.error('خطا در دریافت drives:', err);
      });
    // دریافت گزارش روزانه
    api.get('/api/SystemMonitor/network-usage-report/Daily')
      .then((response) => {
        setDailyNetworkReport(response.data.networkUsageReports || []);
      })
      .catch((err) => { 
        console.error('خطا در دریافت dailyNetworkReport:', err);
      });
    // دریافت گزارش هفتگی
    api.get('/api/SystemMonitor/network-usage-report/Weekly')
      .then((response) => {
        setWeeklyNetworkReport(response.data.networkUsageReports || []);
      })
      .catch((err) => {
        console.error('خطا در دریافت weeklyNetworkReport:', err);
      });
    // دریافت گزارش ماهانه
    api.get('/api/SystemMonitor/network-usage-report/Monthly')
      .then((response) => {
        setMonthlyNetworkReport(response.data.networkUsageReports || []);
      })
      .catch((err) => {
        console.error('خطا در دریافت monthlyNetworkReport:', err);
      });
    // دریافت گزارش کلی
    api.get('/api/SystemMonitor/network-usage-report/Total')
      .then((response) => {
        setTotalNetworkReport(response.data.networkUsageReports || []);
      })
      .catch((err) => {
        console.error('خطا در دریافت totalNetworkReport:', err);
      });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .system-monitor-wrapper {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div className="system-monitor-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <InfoBox
          icon={<FaNetworkWired className="ram-icon" />}
          title="مصرف روزانه"
          value={dailyNetworkReport.length > 0 ? `${(dailyNetworkReport[0].totalBytesReceived / 1000000000).toFixed(1)} / ${(dailyNetworkReport[0].totalBytesSent / 1000000000).toFixed(1)}` : '0 / 0'}
          bgClass="cpu-card"
        />
        <InfoBox
          icon={<FaNetworkWired className="ram-icon" />}
          title="مصرف هفتگی"
          value={weeklyNetworkReport.length > 0 ? `${(weeklyNetworkReport[0].totalBytesReceived / 1000000000).toFixed(1)} / ${(weeklyNetworkReport[0].totalBytesSent / 1000000000).toFixed(1)}` : '0 / 0'}
          bgClass="cpu-card"
        />
        <InfoBox
          icon={<FaNetworkWired className="ram-icon" />}
          title="مصرف ماهانه"
          value={monthlyNetworkReport.length > 0 ? `${(monthlyNetworkReport[0].totalBytesReceived / 1000000000).toFixed(1)} / ${(monthlyNetworkReport[0].totalBytesSent / 1000000000).toFixed(1)}` : '0 / 0'}
          bgClass="cpu-card"
        />
        <InfoBox
          icon={<FaNetworkWired className="ram-icon" />}
          title="مصرف کلی"
          value={totalNetworkReport.length > 0 ? `${(totalNetworkReport[0].totalBytesReceived / 1000000000).toFixed(1)} / ${(totalNetworkReport[0].totalBytesSent / 1000000000).toFixed(1)}` : '0 / 0'}
          bgClass="cpu-card"
        />
        <InfoBox
          icon={<FaMicrochip className="ram-icon" />}
          title="پردازنده"
          value={`${cpuUsage.toFixed(1)}%`}
          bgClass="cpu-card"
          progress={cpuUsage}
        />
        <InfoBox
          icon={<FaMemory className="ram-icon" />}
          title="رم"
          value={`${ramUsage} / ${totalRam}GB (${ramPercent.toFixed(0)}%)`}
          bgClass="ram-card"
          progress={ramPercent}
        />
        <InfoBox
          icon={<FaMemory className="ram-icon" />}
          title="دیسک"
          value={diskReport ? `${diskReport.usedSpaceGB} / ${diskReport.totalSpaceGB}GB` : '---'}
          bgClass="ram-card"
          progress={diskReport ? diskReport.usedSpaceGB / diskReport.totalSpaceGB * 100 : 0 }
        />
        <InfoBox
          icon={<FaTachometerAlt className="ram-icon" />}
          title="سرعت دانلود و آپلود"
          value={`${(uploadSpeed/1000000*8).toFixed(2)}UP(Mb/s) | ${(downloadSpeed/1000000*8).toFixed(2)}Down(Mb/s)`}
          bgClass="ram-card"
        />
      </div>
    </>
  );
}

export default SystemMonitor;