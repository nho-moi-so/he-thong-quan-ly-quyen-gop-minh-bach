import React from "react"; 
import { Card, Typography, Button, Progress } from "antd";
import { BankOutlined, FieldTimeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const FundInfoBox = ({ fund }) => {
  const navigate = useNavigate();
  if (!fund) return null;

  const goal = fund.soTienMucTieu || 0;
  const raised = fund.raised || 0;
  const remainingDays = fund.daysLeft || 0;
  const percent = goal ? ((raised / goal) * 100).toFixed(1) : 0;

  const creatorLogo = fund.logo?.[0]?.url || "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Charity_logo.svg/512px-Charity_logo.svg.png";
  const creatorName = fund.nguoiLap?.tenNhom || "Người lập quỹ";

  return (
    <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.08)", padding: 10 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <img
          src={creatorLogo}
          alt={creatorName}
          width={60}
          height={60}
          style={{ marginRight: 12, objectFit: "cover", borderRadius: 8 }}
        />
        <div>
          <Text strong style={{ fontSize: 20 }}>{creatorName}</Text>
          <br />
          {fund.saoKeLink && (
            <a href={fund.saoKeLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 16, color: "#52c41a" }}>
              Xem sao kê tài khoản
            </a>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 17 }}><BankOutlined /> <b>Mục tiêu chiến dịch:</b></Text>
        <br />
        <Text strong style={{ color: "red", fontSize: 25 }}>{goal.toLocaleString("vi-VN")} VND</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 17 }}><FieldTimeOutlined /> <b>Thời gian còn lại:</b></Text>
        <br />
        <Text strong style={{ color: "red", fontSize: 25 }}>{remainingDays} ngày</Text>
      </div>

      <Progress percent={parseFloat(percent)} showInfo={false} strokeColor="linear-gradient(90deg, #b6eb7a 0%, #52c41a 100%)" style={{ marginBottom: 8 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text><CheckCircleOutlined /> Đã đạt được: <strong>{raised.toLocaleString("vi-VN")} VND</strong></Text>
        <Text strong style={{ color: "#52c41a" }}>{percent}%</Text>
      </div>

      <Button
        type="primary"
        block
        size="large"
        style={{
          background: "linear-gradient(90deg, #a8e063 0%, #56ab2f 100%)",
          border: "none",
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 22,
          height: 50,
          color: "white",
          letterSpacing: 0.5,
          marginBottom: 20,
        }}
        onClick={() => navigate(`/donate/${fund._id}`)}

      >
        Ủng hộ
      </Button>
    </Card>
  );
};

export default FundInfoBox;
