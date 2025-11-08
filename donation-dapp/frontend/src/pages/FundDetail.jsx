import React from "react";
import { Row, Col, Typography, Breadcrumb, Divider } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";
import FundGallery from "../Details/FundGallery";
import FundInfoBox from "../Details/FundInfoBox";
import FundDescription from "../Details/FundDescription";
import FundCreatorInfo from "../Details/FundCreatorInfo"; 
import FundOtherCampaigns from "../Details/FundOtherCampaigns";

const { Title } = Typography;

const FundDetail = () => {
  return (
    <>
      <Navbar />

      <div style={{ background: "#fff", padding: "40px 0" }}>
        <div
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
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
              {
                title: "Chi tiết quỹ",
              },
            ]}
          />

          <Title
            level={3}
            style={{
              marginTop: 24,
              marginBottom: 20,
              color: "#222",
              fontWeight: 600,
            }}
          >
            Hướng về Cao Bằng: Chung tay khắc phục hậu quả bão lũ 2025
          </Title>

          <Divider style={{ margin: "12px 0 30px 0" }} />

          <Row gutter={[40, 40]}>
            <Col xs={24} md={16}>
              <FundGallery />
              <FundDescription />
            </Col>

            <Col xs={24} md={8}>
              <FundInfoBox />
              <FundCreatorInfo /> 
            </Col>
          </Row>
          <FundOtherCampaigns />
        </div>
      </div>

      <FooterSection />
    </>
  );
};

export default FundDetail;
