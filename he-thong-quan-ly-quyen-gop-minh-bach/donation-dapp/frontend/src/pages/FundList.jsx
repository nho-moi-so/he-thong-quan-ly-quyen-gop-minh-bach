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

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState(categoryFromQuery || "all");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    setFilterCategory(categoryFromQuery || "all");
    setCurrentPage(1);
  }, [categoryFromQuery]);

  const allFunds = [
    { id: 1, title: "Góp sách cho trẻ em vùng cao", status: "ongoing", category: "Giáo dục", image: "https://i.pinimg.com/1200x/af/f5/25/aff52590d6f46600a43f886c18182a71.jpg", raised: 3200, goal: 5000, donors: 45, daysLeft: 12 },
    { id: 2, title: "Trồng 1000 cây xanh", status: "finished", category: "Môi trường", image: "https://i.pinimg.com/1200x/b0/13/e9/b013e903c7da80140f8e648a66e47b00.jpg", raised: 5000, goal: 5000, donors: 48, daysLeft: 0 },
    { id: 3, title: "Cứu trợ đồng bào bão lũ miền Trung", status: "ongoing", category: "Thiên tai", image: "https://i.pinimg.com/1200x/1d/c1/f5/1dc1f57e33f3fd1588c6739715f73086.jpg", raised: 4100, goal: 5000, donors: 100, daysLeft: 7 },
    { id: 4, title: "Hỗ trợ học bổng sinh viên khó khăn", status: "finished", category: "Giáo dục", image: "https://i.pinimg.com/1200x/87/11/a8/8711a8ff55506fb013ac7a4a265e69b4.jpg", raised: 5000, goal: 5000, donors: 10, daysLeft: 0 },
    { id: 5, title: "Cung cấp nước sạch cho vùng nông thôn", status: "ongoing", category: "Môi trường", image: "https://thiennhienmoitruong.vn/upload/images/btv/btv6/btv6.5/nuoc-sach.jpeg", raised: 2700, goal: 5000, donors: 1, daysLeft: 15 },
    { id: 6, title: "Hỗ trợ xây dựng thư viện cộng đồng", status: "finished", category: "Giáo dục", image: "https://cdn.giaoducthoidai.vn/images/b4508baace0d9fe4c8bbd296e259642e2c96bee36a1f0f69ace9c8fb809818aaadea65d7c5890ea1519685b1d66a89eaad2d7a6329194204001f07da96921db2d9da16ca34a4d281236177c05dae4ac2cf73f2d975e8fd997c11cc880ba480c4/hieu-qua-tu-mo-hinh-thu-vien-cong-dong-2-6069.jpg", raised: 5000, goal: 5000, donors: 15, daysLeft: 0 },
    { id: 7, title: "Góp quỹ máy tính cho học sinh nghèo", status: "ongoing", category: "Giáo dục", image: "https://media.baobinhphuoc.com.vn/upload/news/10_2021/f_13122126102021.jpg", raised: 3500, goal: 5000, donors: 7, daysLeft: 10 },
    { id: 8, title: "Chăm sóc sức khỏe cho người cao tuổi", status: "finished", category: "Người cao tuổi", image: "https://moh.gov.vn/documents/174521/889001/151020~1.JPG/70620022-fc1c-4883-9c3a-41ec230158dd?t=1624863530380", raised: 5000, goal: 5000, donors: 6, daysLeft: 0 },
    { id: 9, title: "Hỗ trợ trang thiết bị y tế cho bệnh viện nhỏ", status: "ongoing", category: "Khác", image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/10/22/kham-benh-lai-chau-8-1697983964567950751564.jpg", raised: 4200, goal: 5000, donors: 22, daysLeft: 5 },
    { id: 10, title: "Xây dựng khu vui chơi cho trẻ em", status: "finished", category: "Trẻ em", image: "https://media-cdn-v2.laodong.vn/storage/newsportal/2024/7/17/1367917/Trao-Qua-2.JPG", raised: 5000, goal: 5000, donors: 19, daysLeft: 0 },
    { id: 11, title: "Tặng quà Trung Thu cho trẻ em nghèo", status: "ongoing", category: "Trẻ em", image: "https://cdncongthuong.quangtrung.vn//static_files/haiyen/images/2025/10/06/chuong-trinh-trung-thu-cho-em-cham-cham-gan-ket-ngot-ngao-ce74.png", raised: 2900, goal: 5000, donors: 21, daysLeft: 8 },
    { id: 12, title: "Hỗ trợ đồng bào bị ảnh hưởng dịch bệnh", status: "finished", category: "Khác", image: "https://images.hcmcpv.org.vn/res/news/2020/06/05-06-2020-tren-20792-ty-dong-cham-lo-ho-tro-doan-vien-nguoi-lao-dong-bi-anh-huong-dich-covid-19-8A917678.jpg", raised: 5000, goal: 5000, donors: 8, daysLeft: 0 },
  ];

  const filteredFunds = allFunds.filter(
    (fund) =>
      (filterStatus === "all" || fund.status === filterStatus) &&
      (filterCategory === "all" || fund.category === filterCategory) &&
      fund.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFunds = filteredFunds.slice(startIndex, startIndex + pageSize);

  const statusMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => { setFilterStatus("all"); setCurrentPage(1); }}>
        Tất cả trạng thái
      </Menu.Item>
      <Menu.Item key="ongoing" onClick={() => { setFilterStatus("ongoing"); setCurrentPage(1); }}>
        Đang thực hiện
      </Menu.Item>
      <Menu.Item key="finished" onClick={() => { setFilterStatus("finished"); setCurrentPage(1); }}>
        Đã kết thúc
      </Menu.Item>
    </Menu>
  );

  const categoryMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => { setFilterCategory("all"); setCurrentPage(1); }}>
        Tất cả danh mục
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px 50px", maxWidth: 1500, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 50, marginTop: 50, color: "#52c41a" }}>
          Danh sách các quỹ gây quỹ
        </h1>
{/* tim kiem */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Dropdown overlay={statusMenu} placement="bottomLeft">
              <Button style={{ borderColor: "#52c41a", color: "#52c41a" }}>
                {filterStatus === "all" ? "Tất cả trạng thái" :
                 filterStatus === "ongoing" ? "Đang thực hiện" : "Đã kết thúc"} <DownOutlined />
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
{/* danh sach quy */}
        <Row gutter={[20, 20]}>
          {paginatedFunds.length > 0 ? (
            paginatedFunds.map((fund) => (
              <Col key={fund.id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => navigate(`/funds/${fund.id}`)}
                  style={{ borderColor: "#52c41a", height: 380, borderRadius: 10, display: "flex", flexDirection: "column", cursor: "pointer" }}
                  bodyStyle={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}
                  cover={
                    <div style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
                      <img
                        alt={fund.title}
                        src={fund.image}
                        style={{ width: "100%", height: 270, objectFit: "cover", borderRadius: 10 }}
                      />
                      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, backgroundColor: "rgba(255,255,255,0.8)", padding: "4px 8px", borderRadius: 4 }}>
                        <Progress
                          percent={Math.min((fund.raised / fund.goal) * 100, 100)}
                          size="small"
                          strokeColor="#52c41a"
                          showInfo={false}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: "bold", color: "#52c41a", marginTop: 2 }}>
                          <span>{fund.raised.toLocaleString()}₫</span>
                          <span>{fund.goal.toLocaleString()}₫</span>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <h3 style={{ color: "#52c41a", marginBottom: 10, fontWeight: "bold", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fund.title}
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
