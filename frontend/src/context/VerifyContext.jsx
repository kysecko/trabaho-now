import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "clientVerification";

const initialData = {
  email: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dob: "",
  mobile: "",
  street: "",
  barangay: "",
  zip: "",
  skill: "",
  experience: "",
  bio: "",
};

const VerifyContext = createContext(null);

export function VerifyProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      return { ...initialData, ...JSON.parse(sessionStorage.getItem(STORAGE_KEY)) };
    } catch {
      return initialData;
    }
  });
  const [files, setFiles] = useState({});

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const setFile = (name, file) => setFiles((f) => ({ ...f, [name]: file }));

  const reset = () => {
    setData(initialData);
    setFiles({});
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  };

  return (
    <VerifyContext.Provider value={{ data, files, handleChange, setFile, reset }}>
      {children}
    </VerifyContext.Provider>
  );
}

export function useVerify() {
  const ctx = useContext(VerifyContext);
  if (!ctx) throw new Error("useVerify must be used inside <VerifyProvider>");
  return ctx;
}