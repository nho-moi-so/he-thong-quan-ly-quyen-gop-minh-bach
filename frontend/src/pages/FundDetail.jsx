import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Breadcrumb, Divider, Spin } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import FundGallery from "../Details/FundGallery";
import FundInfoBox from "../Details/FundInfoBox";
import FundDescription from "../Details/FundDescription";
import FundCreatorInfo from "../Details/FundCreatorInfo";
import FundOtherCampaigns from "../Details/FundOtherCampaigns";

const { Title } = Typography;

const FundDetail = () => {
  const { id } = useParams(); // Lấy _id từ URL
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFund = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/funds/${id}`);
        const data = await res.json();

        const enriched = {
          ...data,
          raised: Number(data.soTienHienTai || 0),
          donors: (data.danhSachNguoiUngHo || []).length,
          soTienMucTieu: Number(data.soTienMucTieu || 0),
          daysLeft: data.ngayKetThuc
            ? Math.max(Math.ceil((new Date(data.ngayKetThuc) - new Date()) / (1000 * 60 * 60 * 24)), 0)
            : 0,
          danhMuc: data.danhMuc || [],
          anhChinh: data.anhChinh || [],
          anhThumbnail: data.anhThumbnail || [],
        };

        setFund(enriched);
      } catch (err) {
        console.error("Error fetching fund:", err);
      }
      setLoading(false);
    };
    fetchFund();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: 100 }}>
          <Spin size="large" />
        </div>
        <FooterSection />
      </>
    );
  }

  if (!fund) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: 100, color: "#888" }}>
          Không tìm thấy quỹ.
        </div>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ background: "#fff", padding: "40px 0" }}>
        <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "0 20px" }}>
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to="/" style={{ color: "#1677ff" }}>
                    <HomeOutlined /> Trang chủ
                  </Link>
                ),
              },
              {
                title: (
                  <Link to="/funds" style={{ color: "#1677ff" }}>
                    Danh sách quỹ
                  </Link>
                ),
              },
              { title: fund.tenQuy || "Chi tiết quỹ" },
            ]}
          />

          <Title level={3} style={{ marginTop: 24, marginBottom: 20, color: "#222", fontWeight: 600 }}>
            {fund.tenQuy}
          </Title>

          <Divider style={{ margin: "12px 0 30px 0" }} />

          <Row gutter={[40, 40]}>
            <Col xs={24} md={16}>
              <FundGallery images={fund.anhChinh} thumbnails={fund.anhThumbnail} />
              <FundDescription description={fund.moTa} />
            </Col>

            <Col xs={24} md={8}>
              <FundInfoBox fund={fund} />
              <FundCreatorInfo creator={fund.nguoiLap} />
            </Col>
          </Row>

          <FundOtherCampaigns currentFundId={fund._id} />
        </div>
      </div>

      <FooterSection />
    </>
  );
};

export default FundDetail;
