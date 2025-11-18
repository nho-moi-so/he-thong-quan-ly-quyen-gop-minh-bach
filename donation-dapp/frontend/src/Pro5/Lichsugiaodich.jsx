import React, { useState, useEffect } from "react";
import { Table, Card, Pagination, Tooltip, message } from "antd";

const Lichsugiaodich = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);

  // lấy token + email user từ localStorage
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email"); // ⭐ BỔ SUNG QUAN TRỌNG

  useEffect(() => {
    if (!token || !userEmail) return;

    const fetchDonations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:5000/api/donate/user?email=" + userEmail,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Không thể lấy lịch sử donate");

        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error(error);
        message.error(error.message || "Lấy dữ liệu thất bại");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [token, userEmail]);

  const handleChange = (page) => setCurrentPage(page);

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      width: 150,
      render: (text) => (
        <span style={{ fontSize: 12 }}>{text.slice(-6).toUpperCase()}</span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: 160,
      render: (text) => (
        <span style={{ fontSize: 12 }}>{new Date(text).toLocaleString()}</span>
      ),
    },
    {
      title: "Người chuyển",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 180,
      render: (text, record) => (
        <Tooltip title={record.anonymous ? "Ẩn danh" : text}>
          <span style={{ fontSize: 12 }}>
            {record.anonymous ? "Ẩn danh" : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "note",
      key: "note",
      align: "center",
      width: 250,
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ fontSize: 12 }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: 140,
      render: (amount) => (
        <span style={{ color: "#52c41a", fontWeight: "bold", fontSize: 12 }}>
          +{amount.toLocaleString()} VNĐ
        </span>
      ),
    },
  ];

  const paginatedData = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card
      title={
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          Lịch sử giao dịch của tôi
        </div>
      }
      style={{ marginTop: 20 }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={false}
          rowKey="_id"
          bordered
          loading={loading}
          style={{ tableLayout: "fixed", fontSize: 12 }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={transactions.length}
            onChange={handleChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Card>
  );
};

export default Lichsugiaodich;
