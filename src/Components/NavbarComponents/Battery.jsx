import React, { useEffect, useState, useMemo } from 'react';
import BatteryGauge from 'react-battery-gauge';
import { toast } from 'react-toastify';

const Battery = () => {
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [isCharging, setIsCharging] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!navigator.getBattery) {
      setIsSupported(false);
      toast.error('Battery API not supported');
      return;
    }

    const updateBatteryStatus = async () => {
      try {
        const battery = await navigator.getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      } catch (err) {
        toast.error('Failed to access battery');
        setIsSupported(false);
      }
    };

    updateBatteryStatus();
  }, []);

  if (!isSupported) {
    return <div className="flex items-center justify-center p-2 bg-base-200 text-base-content rounded-box text-xs">No Battery</div>;
  }

  const getBatteryColor = () => {
    if (isCharging) return '#3b82f6'; // Blue
    if (batteryLevel < 30) return '#ef4444'; // Red
    if (batteryLevel < 70) return '#f59e0b'; // Yellow
    return '#22c55e'; // Green
  };

  const customization = useMemo(() => ({
    batteryBody: { strokeWidth: 2, strokeColor: 'currentColor', cornerRadius: 4, fill: 'none' },
    batteryCap: { strokeWidth: 2, strokeColor: 'currentColor', cornerRadius: 2, fill: 'none' },
    batteryMeter: {
      fill: getBatteryColor(),
      lowBatteryValue: 30,
      lowBatteryFill: '#ef4444',
      outerGap: 1,
    },
    readingText: {
      fontSize: 10,
      fontFamily: 'inherit',
      lightColor: 'currentColor',
      darkColor: 'currentColor',
    },
  }), [batteryLevel, isCharging]);

  return (
    <div className="rounded-box">
      <BatteryGauge
        key={isCharging + '-' + batteryLevel} // перерендер при изменении
        value={batteryLevel}
        size={60}
        customization={customization}
        style={{ width: '60px', height: '60px' }}
      />
    </div>
  );
};

export default Battery;
