import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Progress } from "antd";

const campaigns = [
  {
    id: 1,
    title: "Cứu trợ miền Trung",
    description: "Giúp đỡ đồng bào chịu ảnh hưởng thiên tai.",
    image: "https://picsum.photos/300/200?random=1",
    daysLeft: 12,
    goal: 200000000,
    donated: 120000000,
  },
  {
    id: 2,
    title: "Quỹ học bổng cho trẻ em",
    description: "Trao cơ hội học tập cho trẻ em nghèo hiếu học.",
    image: "https://picsum.photos/300/200?random=2",
    daysLeft: 20,
    goal: 150000000,
    donated: 85000000,
  },
  {
    id: 3,
    title: "Xây cầu vùng cao",
    description: "Mang con đường đến gần hơn với trẻ nhỏ.",
    image: "https://picsum.photos/300/200?random=3",
    daysLeft: 15,
    goal: 100000000,
    donated: 60000000,
  },
  {
    id: 4,
    title: "Hỗ trợ bệnh nhân ung thư",
    description: "Chung tay thắp lên hy vọng sống.",
    image: "https://picsum.photos/300/200?random=4",
    daysLeft: 8,
    goal: 120000000,
    donated: 90000000,
  },
  {
    id: 5,
    title: "Bữa ăn cho người vô gia cư",
    description: "Một bữa ăn - Một niềm tin vào ngày mai.",
    image: "https://picsum.photos/300/200?random=5",
    daysLeft: 10,
    goal: 100000000,
    donated: 70000000,
  },
];

const FeaturedCampaigns = () => {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex((prev) =>
      prev === 0 ? campaigns.length - visibleCount : prev - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= campaigns.length ? 0 : prev + 1
    );
  };

  const visibleItems = campaigns.slice(startIndex, startIndex + visibleCount);
  const itemsToDisplay =
    visibleItems.length < visibleCount
      ? [...visibleItems, ...campaigns.slice(0, visibleCount - visibleItems.length)]
      : visibleItems;

  const formatMoney = (num) => num.toLocaleString("vi-VN") + "₫";

  return (
    <div
      style={{
        background: "#fff",
        padding: "50px 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "1500px",
          margin: "0 auto 40px auto",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            margin: 0,
          }}
        >
          Các chiến dịch nổi bật
        </h2>
        <a
          href="/funds"
          style={{
            position: "absolute",
            right: "150px",
            bottom: "-22px",
            color: "#117529",
            fontSize: "15px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Xem tất cả →
        </a>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={handlePrev}
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            color: "#333",
            marginRight: "10px",
          }}
        >
          <LeftOutlined />
        </button>

        <div
          style={{
            display: "flex",
            gap: "30px",
            overflow: "hidden",
            width: "80%",
            justifyContent: "center",
          }}
        >
          {itemsToDisplay.map((item, index) => {
            const percent = Math.min((item.donated / item.goal) * 100, 100);
            return (
              <div
                key={index}
                onClick={() => navigate(`/funds/${item.id}`)} // 👉 điều hướng khi click
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  width: "30%",
                  minWidth: "250px",
                  textAlign: "left",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "rgba(255,255,255,0.9)",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      color: "#117529",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    ⏰ {item.daysLeft} ngày còn lại
                  </div>
                </div>

                <div style={{ padding: "15px" }}>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#117529",
                      marginBottom: "8px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minHeight: "48px",
                    }}
                  >
                    {item.title}
                  </h3>

                  <Progress
                    percent={percent}
                    showInfo={false}
                    strokeColor="#52c41a"
                    trailColor="#f0f0f0"
                    style={{ marginBottom: "10px" }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "#117529", fontWeight: 600 }}>
                      {formatMoney(item.donated)}
                    </span>
                    <span style={{ color: "#999" }}>
                      {formatMoney(item.goal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
            color: "#333",
            marginLeft: "10px",
          }}
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
};

export default FeaturedCampaigns;
