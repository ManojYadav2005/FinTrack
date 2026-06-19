import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-root)" }}>
      {children}
    </div>
  );
};

export default MainLayout;
