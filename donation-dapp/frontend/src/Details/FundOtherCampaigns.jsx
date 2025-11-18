import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const FundOtherCampaigns = ({ currentFundId }) => {
  const [otherFunds, setOtherFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtherFunds = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/funds");
        const data = await res.json();
        setOtherFunds(data.filter(f => f._id !== currentFundId).slice(0, 6));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOtherFunds();
  }, [currentFundId]);

  if (loading) return <Spin style={{ display: "block", margin: "50px auto" }} />;

  return (
    <div style={{ marginTop: 50 }}>
      <h2 style={{ color: "#52c41a", marginBottom: 24 }}>Các chiến dịch khác</h2>
      <Row gutter={[20, 20]}>
        {otherFunds.map(fund => (
          <Col key={fund._id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={<img src={fund.anhChinh?.[0]?.url || "https://via.placeholder.com/400x180"} alt={fund.tenQuy} style={{ height: 180, objectFit: "cover", borderRadius: 12 }} />}
              onClick={() => navigate(`/funds/${fund._id}`)}
            >
              <h3 style={{ color: "#52c41a", fontWeight: 600 }}>{fund.tenQuy}</h3>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FundOtherCampaigns;
