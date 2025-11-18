import React from "react";
import { Avatar } from "antd";

const CoverSection = ({ user }) => {
  const getLatestLogo = () => {
    if (user?.logo && Array.isArray(user.logo) && user.logo.length > 0) {
      const latest = user.logo[user.logo.length - 1];
      return `http://localhost:5000${latest.startsWith("/") ? "" : "/"}${latest}`;
    }
    return null;
  };

  const avatarUrl = getLatestLogo() || "https://i.pravatar.cc/150?img=3";

  const displayName = user?.hoTen || "Người dùng";
  const username = user?.email ? user.email.split("@")[0] : "user";

  const vaiTroText = (() => {
    if (!user?.vaiTro) return "Thành viên";
    switch (user.vaiTro) {
      case "CaNhan": return "Cá nhân";
      case "NguoiSangLap": return "Người sáng lập quỹ";
      case "ChuNhiem": return "Chủ nhiệm quỹ";
      default: return user.vaiTro;
    }
  })();

  return (
    <div style={{ background: "#f0f2f5", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 0,
          paddingBottom: "28%", 
          overflow: "hidden",
          background: "#000",
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2021/08/20/03/57/boy-6559419_1280.jpg"
          alt="Cover"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

   
      <div style={{ background: "#fff", position: "relative", marginTop: -70 }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 20px 0",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            
           
            <div style={{ marginTop: -80 }}>
              <Avatar
                src={avatarUrl}
                size={168}
                style={{
                  border: "5px solid #fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  display: "block",
                }}
              />
          
              <div
                style={{
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 140,
                  height: 20,
                  background: "#fff",
                  borderRadius: "0 0 100px 100px",
                }}
              />
            </div>

            {/* TÊN + THÔNG TIN - NẰM DƯỚI PHẦN TRẮNG */}
            <div style={{ paddingTop: 20 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#1c1e21",
                  lineHeight: 1.2,
                }}
              >
                {displayName}
              </h1>
              <p
                style={{
                  margin: "6px 0 10px",
                  fontSize: 17,
                  color: "#606770",
                  fontWeight: 500,
                }}
              >
                @{username}
              </p>
              <span
                style={{
                  fontSize: 15,
                  color: "#1c1e21",
                  background: "#e7f3ff",
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                {vaiTroText}
              </span>
            </div>
          </div>
        </div>

        {/* Đường kẻ phân cách */}
        <div
          style={{
            height: 1,
            background: "#ccd0d5",
            marginTop: 20,
            maxWidth: 1200,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    </div>
  );
};

export default CoverSection;