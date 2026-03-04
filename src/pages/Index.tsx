import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.href = "/chat.html";
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <p>Laddar chatten...</p>
    </div>
  );
};

export default Index;
