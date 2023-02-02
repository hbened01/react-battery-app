import React, { useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa";
import { TbFaceIdError } from "react-icons/tb";
import { BsArrowDownCircle } from "react-icons/bs";
import { format } from "date-fns";
import { AlertMsg } from "@/utils";
import "./BatteryComponent.scss";

const BatteryComponent = () => {
  const [isCharging, setIsCharging] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState("0%");
  const [keyframe, setKeyframe] = useState("battery-charge-full");
  const [batteryStatus, setBatteryStatus] = useState(null);
  const [batteryAnimationFillMode, setBatteryAnimationFillMode] =
    useState("infinite");
  const [isBatterySupported, setIsBatterySupported] = useState(
    "getBattery" in navigator
  );
  const [showLevel, setShowLevel] = useState(false);

  const setBatteryState = (battery) => {
    const { level, charging } = battery;
    const keyframeValue = getBatteryKeyframe(level * 100);
    setBatteryLevel(`${level * 100}%`);
    setKeyframe(keyframeValue);
    setBatteryAnimationFillMode("forwards");
    setIsCharging(charging);
    setShowLevel(true);
    setTimeout(() => {
      setShowLevel(false);
    }, 8000);
  };

  const getBatteryKeyframe = (v) => {
    switch (true) {
      case v < 25:
        return "battery-charge-lower";
      case v >= 25 && v < 50:
        return "battery-charge-lower-to-middle";
      case v >= 50 && v < 75:
        return "battery-charge-middle";
      case v >= 75 && v < 100:
        return "battery-charge-middle-to";
      default:
        return "battery-charge-full";
    }
  };

  const handleChargingChange = (e) => {
    setBatteryState(e.currentTarget);
  };

  const handleLevelChange = (e) => {
    setBatteryState(e.currentTarget);
  };

  useEffect(() => {
    setIsBatterySupported("getBattery" in navigator);
    if (!("getBattery" in navigator)) {
      setBatteryLevel(`0%`);
      setKeyframe("battery-charge-lower");
      setBatteryAnimationFillMode("forwards");
      AlertMsg({
        title: "Battery Information!",
        text: "Battery not supported",
        icon: "error",
        iconColor: "blue",
        confirmButtonText: "Exit",
        timer: 3000,
      });
      return;
    }

    // Get the battery API
    navigator.getBattery().then((battery) => {
      setBatteryStatus(battery);
      setBatteryState(battery);
    });
    // Add some specific events listener:
    batteryStatus &&
      batteryStatus.addEventListener("chargingchange", handleChargingChange);
    batteryStatus &&
      batteryStatus.addEventListener("levelchange", handleLevelChange);
    return () => {
      // Remove events listener:
      batteryStatus &&
        batteryStatus.removeEventListener(
          "chargingchange",
          handleChargingChange
        );
      batteryStatus &&
        batteryStatus.removeEventListener("levelchange", handleLevelChange);
    };
  }, [batteryStatus]);

  return (
    <>
      <div className="battery-widget">
        <div className="battery-widget__head" />
        <div className="battery-widget__body">
          {showLevel && (
            <span className="battery-widget__body__level">{batteryLevel}</span>
          )}
          {isCharging && isBatterySupported && (
            <FaBolt className="battery-widget__body__icon" />
          )}
          {!isCharging && isBatterySupported && (
            <BsArrowDownCircle className="battery-widget__body__icon" />
          )}
          {!isBatterySupported && (
            <TbFaceIdError className="battery-widget__body__icon !text-7xl !left-[30%]" />
          )}
          <div
            className="battery-widget__body__charge"
            style={{
              "--animationNameKeyframe": keyframe,
              "--level": batteryLevel,
              "--batteryAnimationFillMode": batteryAnimationFillMode,
            }}
          />
        </div>
      </div>
      {isBatterySupported && (
        <div className="battery-info">
          <span className="battery-info__head">
            <span className="text-2xl text-gray-500">
              {format(new Date(), "PPpp")}.
            </span>
            <br />
            <span className="text-xl text-blue-500">
              The Battery is {isCharging ? "charging" : "not charging"}.
            </span>
          </span>
          <span className="battery-info__body">
            The current percentage of load is: {batteryLevel}.
          </span>
        </div>
      )}
    </>
  );
};

export default BatteryComponent;
