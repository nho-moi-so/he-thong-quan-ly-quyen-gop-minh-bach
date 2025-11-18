import React, { useEffect, useState } from "react";
import { Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import CoverSection from "../Pro5/CoverSection";
import Infor from "../Pro5/Infor";
import Thongke from "../Pro5/Thongke";
import Lichsugiaodich from "../Pro5/Lichsugiaodich";
import FooterSection from "../components/FooterSection";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // 1. Lấy localStorage trước
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          message.error("Chưa đăng nhập!");
          navigate("/login", { replace: true });
          return;
        }
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id || parsedUser.id;
        if (!userId) {
          message.error("Thông tin người dùng không hợp lệ!");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        // 2. Fetch dữ liệu mới nhất từ server
        const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`);

        // 3. Map dữ liệu an toàn
        const safeUser = {
          ...data,
          _id: data._id || data.id,
          gioiTinh: data.gioiTinh || "",
          bio: data.bio || "",
          dienThoai: data.dienThoai || "",
          diaChi: data.diaChi || "",
          avatar: data.avatar || data.logo?.[0] || "https://i.pravatar.cc/150?img=3",
        };

        // 4. Lưu lại localStorage để tránh flash lần sau
        localStorage.setItem("user", JSON.stringify(safeUser));
        setUser(safeUser);

      } catch (err) {
        console.error("Lỗi load user từ server:", err);
        message.error("Không tải được thông tin người dùng!");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontSize: 18 }}>
        Đang tải thông tin...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <CoverSection user={user} />
      <div style={{ maxWidth: 1500, margin: "0 auto", padding: "10px 20px 40px" }}>
        <Row gutter={20}>
          <Col span={8}>
            <Infor user={user} />
          </Col>
          <Col span={16}>
            <Thongke user={user} />
            <Lichsugiaodich />
          </Col>
        </Row>
      </div>
      <FooterSection />
    </div>
  );
};

export default ProfilePage;
