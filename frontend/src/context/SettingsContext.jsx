/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSiteSettings, updateSiteSettings } from "../services/siteSettings";

const SettingsContext = createContext();

export function useSettings() {
  return useContext(SettingsContext);
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getSiteSettings();
      setSettings(data);
      setLoading(false);
    })();
  }, []);

  const refresh = useCallback(async () => {
    const data = await getSiteSettings();
    setSettings(data);
  }, []);

  const save = useCallback(async (newSettings) => {
    await updateSiteSettings(newSettings);
    setSettings(newSettings);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh, save }}>
      {children}
    </SettingsContext.Provider>
  );
}
