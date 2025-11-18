import React, { useState, useEffect } from "react";
import { Typography, Table, Divider, Tabs, Pagination } from "antd";
import { HeartFilled, InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

const FundDescription = ({ description, fundId }) => {
  const [donors, setDonors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 🔥 Gọi API lấy danh sách người ủng hộ theo quỹ
  useEffect(() => {
  if (!fundId) return;

  const fetchDonors = async () => {
    try {
      const res = await axios.get(`/api/quyen-gop/${fundId}`);
      console.log("API response:", res.data);
      const donorsData = res.data.danhSachNguoiUngHo || [];
      const mappedDonors = donorsData.map((d, index) => ({
        _id: d._id || index,
        name: d.name,
        amount: d.amount,
        date: d.date
      }));
      setDonors(mappedDonors);
    } catch (err) {
      console.error("Error fetching donors:", err);
    }
  };

  fetchDonors();
}, [fundId]);


  const startIndex = (currentPage - 1) * pageSize;
  const currentDonors = donors.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: "Tên người ủng hộ",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amt) => (
        <Text style={{ color: "#52c41a", fontWeight: 600 }}>
          +{(amt || 0).toLocaleString("vi-VN")} VND
        </Text>
      ),
    },
    {
      title: "Thời gian",
  dataIndex: "date",
  key: "date",
  align: "center",
  render: (d) => <Text type="secondary">{new Date(d.$date).toLocaleString()}</Text>
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        marginTop: 40,
      }}
    >
      <Tabs
        defaultActiveKey="1"
        size="large"
        tabPosition="top"
        items={[
          {
            key: "1",
            label: (
              <span>
                <InfoCircleOutlined /> Giới thiệu
              </span>
            ),
            children: (
              <>
                <Title level={3} style={{ color: "#52c41a" }}>
                  🌿 Giới thiệu về chiến dịch
                </Title>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: "#444" }}>
                  {description || "Chưa có mô tả"}
                </Paragraph>
              </>
            ),
          },
          {
            key: "2",
            label: (
              <span>
                <HeartFilled style={{ color: "#ff4d4f" }} /> Người ủng hộ
              </span>
            ),
            children: (
              <>
                <Title level={3} style={{ color: "#52c41a" }}>
                  ❤️ Danh sách người ủng hộ
                </Title>
                <Divider />

                <Table
                  dataSource={currentDonors}
                  columns={columns}
                    rowKey="_id"
                  pagination={false}
                />

                <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={donors.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                  />
                </div>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default FundDescription;
