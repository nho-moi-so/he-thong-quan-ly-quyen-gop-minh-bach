import React, { useState, useEffect } from "react";
import { Card, Typography, Space, Image, Spin } from "antd";
import { HomeOutlined, MailOutlined, FacebookOutlined, PhoneOutlined } from "@ant-design/icons";

const { Text, Link, Title } = Typography;

const FundCreatorInfo = ({ fundId }) => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fundId) return;
    const fetchFund = async () => {
      try {
        const res = await fetch(`http://localhost:5000/fund/${fundId}`); // sửa URL backend nếu cần
        const data = await res.json();
        setCreator(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu quỹ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFund();
  }, [fundId]);

  if (loading) return <Spin tip="Đang tải dữ liệu quỹ..." />;
  if (!creator) return <Text>Không tìm thấy quỹ.</Text>;

  const logoUrl =
    Array.isArray(creator.logo) && creator.logo.length > 0
      ? creator.logo[0].url
      : creator.logo ||
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Charity_logo.svg/512px-Charity_logo.svg.png";

  const name = creator.tenNhom || creator.name || "Quỹ Thiện Nguyện Việt Nam";
  const address = creator.diaChi || creator.address || "123 Nguyễn Trãi, Quận 5, TP.HCM";
  const email = creator.email || "support@quythiennguyen.vn";
  const facebook = creator.facebook || "https://facebook.com/quythiennguyen";
  const phone = creator.phone || "0909 123 456";

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        marginTop: 20,
        padding: "30px 40px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Image
          src={logoUrl}
          alt={name}
          width={140}
          preview={false}
          style={{ marginBottom: 16, borderRadius: "50%", objectFit: "cover" }}
        />
        <Title level={3} style={{ color: "#1677ff", fontWeight: 700, margin: 0 }}>
          {name}
        </Title>
      </div>

      <Space direction="vertical" size="large" style={{ width: "100%", alignItems: "flex-start" }}>
        <Space>
          <HomeOutlined style={{ color: "#52c41a", fontSize: 20 }} />
          <Text strong>Địa chỉ:</Text>
          <Text>{address}</Text>
        </Space>
        <Space>
          <MailOutlined style={{ color: "#faad14", fontSize: 20 }} />
          <Text strong>Email:</Text>
          <Link href={`mailto:${email}`} style={{ transition: "color 0.3s" }}>
            {email}
          </Link>
        </Space>
        <Space>
          <FacebookOutlined style={{ color: "#1677ff", fontSize: 20 }} />
          <Text strong>Facebook:</Text>
          <Link href={facebook} target="_blank" style={{ transition: "color 0.3s" }}>
            {facebook.replace(/^https?:\/\//, "")}
          </Link>
        </Space>
        <Space>
          <PhoneOutlined style={{ color: "#eb2f96", fontSize: 20 }} />
          <Text strong>Số điện thoại:</Text>
          <Text>{phone}</Text>
        </Space>
      </Space>
    </Card>
  );
};

export default FundCreatorInfo;
