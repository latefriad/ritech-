import { useSettings } from "../../context/SettingsContext";

export default function Topbar() {
  const { settings } = useSettings();

  if (!settings) return null;

  return (
    <div className="topbar">
      <span>{settings.topbarText}</span>
      <a href={`tel:${settings.topbarPhone}`}>📞 {settings.topbarPhone}</a>
    </div>
  );
}
