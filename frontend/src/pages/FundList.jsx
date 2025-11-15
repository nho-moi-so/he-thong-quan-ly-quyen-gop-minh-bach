import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Progress,
  Pagination,
  Dropdown,
  Menu,
  Button,
  Input,
  Spin,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const { Search } = Input;

const FundList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");

  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState(categoryFromQuery || "all");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // ==== Fetch dữ liệu từ API ====
  useEffect(() => {
    const fetchFunds = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/funds");
        const data = await res.json();

        const enriched = data.map(fund => ({
          ...fund,
          raised: Number(fund.soTienHienTai || 0),
          donors: Number(fund.donors || 0),
          soTienMucTieu: Number(fund.soTienMucTieu || 0),
          daysLeft: fund.ngayKetThuc
            ? Math.max(Math.ceil((new Date(fund.ngayKetThuc) - new Date()) / (1000 * 60 * 60 * 24)), 0)
            : 0,
          danhMuc: fund.danhMuc || [],
          anhChinh: fund.anhChinh || [],
        }));

        setFunds(enriched);
      } catch (err) {
        console.error("Error fetching funds:", err);
      }
      setLoading(false);
    };
    fetchFunds();
  }, []);

  useEffect(() => {
    setFilterCategory(categoryFromQuery || "all");
    setCurrentPage(1);
  }, [categoryFromQuery]);

  const filteredFunds = funds.filter(
    fund =>
      (filterStatus === "all" || fund.trangThai === filterStatus) &&
      (filterCategory === "all" || fund.danhMuc.includes(filterCategory)) &&
      fund.tenQuy.toLowerCase().includes(searchText.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFunds = filteredFunds.slice(startIndex, startIndex + pageSize);

  // ==== Menu lọc trạng thái ====
  const statusMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => { setFilterStatus("all"); setCurrentPage(1); }}>
        Tất cả trạng thái
      </Menu.Item>
      <Menu.Item key="DangMo" onClick={() => { setFilterStatus("DangMo"); setCurrentPage(1); }}>
        Đang thực hiện
      </Menu.Item>
      <Menu.Item key="ChoDuyet" onClick={() => { setFilterStatus("ChoDuyet"); setCurrentPage(1); }}>
        Chờ duyệt
      </Menu.Item>
      <Menu.Item key="DaKetThuc" onClick={() => { setFilterStatus("DaKetThuc"); setCurrentPage(1); }}>
        Đã kết thúc
      </Menu.Item>
    </Menu>
  );

  // ==== Menu lọc danh mục ====
  const categoryMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => { setFilterCategory("all"); setCurrentPage(1); }}>
        Tất cả danh mục
      </Menu.Item>
      {Array.from(new Set(funds.flatMap(f => f.danhMuc))).map(cat => (
        <Menu.Item key={cat} onClick={() => { setFilterCategory(cat); setCurrentPage(1); }}>
          {cat}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px 50px", maxWidth: 1500, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 50, marginTop: 50, color: "#52c41a" }}>
          Danh sách các quỹ gây quỹ
        </h1>

        {/* ======= Bộ lọc & Tìm kiếm ======= */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Dropdown overlay={statusMenu} placement="bottomLeft">
              <Button style={{ borderColor: "#52c41a", color: "#52c41a" }}>
                {filterStatus === "all" ? "Tất cả trạng thái" : filterStatus} <DownOutlined />
              </Button>
            </Dropdown>
            <Dropdown overlay={categoryMenu} placement="bottomLeft">
              <Button style={{ borderColor: "#52c41a", color: "#52c41a" }}>
                {filterCategory === "all" ? "Tất cả danh mục" : filterCategory} <DownOutlined />
              </Button>
            </Dropdown>
          </div>

          <Search
            placeholder="Tìm theo tên quỹ"
            allowClear
            enterButton
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* ======= Danh sách quỹ ======= */}
        <Row gutter={[20, 20]}>
          {loading ? (
            <Col span={24} style={{ textAlign: "center", padding: 50 }}>
              <Spin size="large" />
            </Col>
          ) : paginatedFunds.length > 0 ? (
            paginatedFunds.map(fund => (
              <Col key={fund._id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => navigate(`/funds/${fund._id}`)}
                  style={{ borderColor: "#52c41a", height: 380, borderRadius: 10, display: "flex", flexDirection: "column", cursor: "pointer" }}
                  bodyStyle={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}
                  cover={
                    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                      <img
                        alt={fund.tenQuy}
                        src={fund.anhChinh[0]?.url || ""}
                        style={{ width: "100%", height: 270, objectFit: "cover", borderRadius: 10 }}
                      />
                      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, backgroundColor: "rgba(255,255,255,0.8)", padding: "4px 8px", borderRadius: 4 }}>
                        <Progress
                          percent={fund.soTienMucTieu > 0 ? Math.min((fund.raised / fund.soTienMucTieu) * 100, 100) : 0}
                          size="small"
                          strokeColor="#52c41a"
                          showInfo={false}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: "bold", color: "#52c41a", marginTop: 2 }}>
                          <span>{fund.raised.toLocaleString()}₫</span>
                          <span>{fund.soTienMucTieu.toLocaleString()}₫</span>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <h3 style={{ color: "#52c41a", marginBottom: 10, fontWeight: "bold", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fund.tenQuy}
                  </h3>
                  <Row style={{ marginTop: "auto", color: "#888", fontWeight: "normal" }}>
                    <Col span={12}>{fund.donors.toLocaleString()} lượt ủng hộ</Col>
                    <Col span={12} style={{ textAlign: "right" }}>{fund.daysLeft} ngày còn lại</Col>
                  </Row>
                </Card>
              </Col>
            ))
          ) : (
            <Col span={24} style={{ textAlign: "center", padding: 50, color: "#888" }}>
              Không có quỹ nào phù hợp
            </Col>
          )}
        </Row>

        {/* ======= Pagination ======= */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredFunds.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            style={{ borderRadius: 6, padding: "2px 8px" }}
          />
        </div>
      </div>
      <FooterSection />
    </>
  );
};

export default FundList;
