import React, { useState } from "react";
import axios from "axios";
import { Card, Input, Button, Select, message } from "antd";

const { TextArea } = Input;

const Infor = ({ user }) => {
  const [formData, setFormData] = useState({
    hoTen: user.hoTen || "",
    gioiTinh: user.gioiTinh || "",
    dienThoai: user.dienThoai || "",
    email: user.email || "",
    diaChi: user.diaChi || "",
    bio: user.bio || "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleButtonClick = async () => {
    if (!editing) {
      setEditing(true);
      return;
    }

    setLoading(true);

    try {
      const userId = user._id || user.id;

      // Lọc các field có giá trị và không phải email
      const updates = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && key !== "email") {
          // map gioiTinh → gioiTinh khi gửi server
          updates[key === "gioiTinh" ? "gioiTinh" : key] = formData[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        message.warning("Không có gì để cập nhật!");
        setLoading(false);
        return;
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updates
      );

      if (res.status === 200) {
        const updated = res.data.user;

const safeUser = {
  ...updated,
  gioiTinh: updated.gioiTinh || "", // map giới tính
  bio: updated.bio || "",
  dienThoai: updated.dienThoai || "",
  diaChi: updated.diaChi || "",
  _id: updated._id,
  hoTen: updated.hoTen,
  email: updated.email,
};

localStorage.setItem("user", JSON.stringify(safeUser));


        message.success("Cập nhật thành công!");
        setEditing(false);
      } else {
        console.error("Response không thành công:", res);
        message.error("Cập nhật thất bại, kiểm tra console!");
      }
    } catch (err) {
      console.error("Lỗi axios khi cập nhật user:", err.response || err);

      if (err.response) {
        message.error(
          `Lỗi từ server: ${err.response.data.error || err.response.statusText}`
        );
      } else {
        message.error("Không thể kết nối server!");
      }
    }

    setLoading(false);
  };

  const fieldStyle = { marginBottom: 15 };

  return (
    <Card title="Thông tin cá nhân">
      <div style={fieldStyle}>
        <label>Tên tài khoản</label>
        <Input
          value={formData.hoTen}
          onChange={(e) => handleChange("hoTen", e.target.value)}
          disabled={!editing}
        />
      </div>

      <div style={fieldStyle}>
        <label>Giới tính</label>
        <Select
          value={formData.gioiTinh}
          onChange={(v) => handleChange("gioiTinh", v)}
          disabled={!editing}
          style={{ width: "100%" }}
        >
          <Select.Option value="Nam">Nam</Select.Option>
          <Select.Option value="Nữ">Nữ</Select.Option>
          <Select.Option value="Khác">Khác</Select.Option>
        </Select>
      </div>

      <div style={fieldStyle}>
        <label>Số điện thoại</label>
        <Input
          value={formData.dienThoai}
          onChange={(e) => handleChange("dienThoai", e.target.value)}
          disabled={!editing}
        />
      </div>

      <div style={fieldStyle}>
        <label>Email</label>
        <Input value={formData.email} disabled />
      </div>

      <div style={fieldStyle}>
        <label>Địa chỉ</label>
        <Input
          value={formData.diaChi}
          onChange={(e) => handleChange("diaChi", e.target.value)}
          disabled={!editing}
        />
      </div>

      <div style={fieldStyle}>
        <label>Giới thiệu bản thân</label>
        <TextArea
          rows={3}
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          disabled={!editing}
        />
      </div>

      <Button type="primary" loading={loading} onClick={handleButtonClick}>
        {editing ? "Cập nhật" : "Chỉnh sửa"}
      </Button>
    </Card>
  );
};

export default Infor;
