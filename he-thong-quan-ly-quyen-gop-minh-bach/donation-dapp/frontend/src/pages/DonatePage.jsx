import React, { useState } from "react";
import { Row, Col, Card, Typography, Progress, Form, Input, InputNumber, Button, Avatar, Checkbox, message } from "antd";
import Navbar from "../components/Navbar";
import FooterSection from "../components/FooterSection";

const { Title, Text } = Typography;

const DonatePage = () => {
  const [raisedAmount, setRaisedAmount] = useState(50000000);
  const [form] = Form.useForm();
  const [anonymous, setAnonymous] = useState(false);
  const [thankMessage, setThankMessage] = useState("");

  const fundInfo = {
    organization: "Hội chữ thập đỏ Việt Nam",
    logo: "https://i.pinimg.com/736x/a4/0b/05/a40b050278d6c4ba8f9f959100722ad8.jpg",
    coverImage: "https://i.pinimg.com/736x/11/38/8b/11388b2d0d07b266ff21062c8b01a519.jpg",
    fundName: "Quỹ Vì Miền Trung",
    goal: 100000000,
    daysLeft: 10,
  };

  const progressPercent = Math.min(
    Math.round((raisedAmount / fundInfo.goal) * 100),
    100
  );

  const onFinish = async (values) => {
    try {
      const fundId = "648e6f6e5f3a3b0012345678"; // ID quỹ từ database
      const donorName = values.anonymous ? "" : values.name;
      const donorEmail = values.anonymous ? "" : values.email;

      const res = await fetch("http://localhost:5000/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fundId,
          name: donorName,
          email: donorEmail,
          amount: values.amount,
          note: values.note,
          anonymous: values.anonymous || false,
        }),
      });

      if (!res.ok) throw new Error("Gửi donate thất bại");

      const data = await res.json();
      setRaisedAmount(prev => prev + data.amount);

      setThankMessage(
        `Cảm ơn ${values.anonymous ? "Ẩn danh" : values.name} đã ủng hộ ${data.amount.toLocaleString()} VND!`
      );

      form.resetFields(["amount", "note", "anonymous", "name", "email"]);
      setAnonymous(false);
      setTimeout(() => setThankMessage(""), 5000);
    } catch (error) {
      console.error(error);
      message.error("Gửi donate thất bại");
    }
  };

  return (
    <>
      <Navbar />

      {thankMessage && (
        <div
          style={{
            maxWidth: "1400px",
            margin: "16px auto",
            padding: "12px",
            backgroundColor: "#d4edda",
            color: "#155724",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          {thankMessage}
        </div>
      )}

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card style={{ padding: "20px" }}>
              <Row align="middle" gutter={16}>
                <Col>
                  <Avatar size={64} src={fundInfo.logo} />
                </Col>
                <Col>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1.4 }}>
                    <Text style={{ fontSize: "16px" }}>Tiền ủng hộ được chuyển đến</Text>
                    <Title level={4} style={{ margin: 0, fontSize: "20px" }}>{fundInfo.organization}</Title>
                  </div>
                </Col>
              </Row>

              <div
                style={{
                  width: "100%",
                  height: "450px",
                  marginTop: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {fundInfo.coverImage ? (
                  <img
                    src={fundInfo.coverImage}
                    alt="Hình đại diện quỹ"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <Text type="secondary">Chưa có hình ảnh</Text>
                )}

                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    backgroundColor: "rgba(202, 202, 202, 0.85)",
                    color: "#000",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {fundInfo.daysLeft} ngày còn lại
                </div>
              </div>

              <Title level={4} style={{ marginTop: "16px", fontSize: "22px" }}>{fundInfo.fundName}</Title>
              <Text strong style={{ fontSize: "16px" }}>Mục tiêu quỹ:</Text> <Text style={{ fontSize: "16px" }}>{fundInfo.goal.toLocaleString()} VND</Text>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <Text strong style={{ fontSize: "16px" }}>
                  Số tiền đã đạt được: <span style={{ color: "#28a745", fontSize: "18px" }}>{raisedAmount.toLocaleString()} VND</span>
                </Text>
                <Text style={{ fontSize: "16px" }}>{progressPercent}%</Text>
              </div>

              <Progress
                percent={progressPercent}
                showInfo={false}
                strokeColor={{ '0%': '#28a745', '100%': '#7ed957' }}
                style={{ marginTop: "8px", height: "18px", borderRadius: "8px" }}
              />

              <div style={{ marginTop: "16px", fontStyle: "italic", color: "#555", fontSize: "15px" }}>
                Hãy chung tay để đạt mục tiêu quỹ sớm nhất!
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Thông tin ủng hộ" style={{ padding: "10px" }}>
              <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                  label={<span style={{ fontSize: "16px", fontWeight: 500 }}>Số tiền ủng hộ</span>}
                  name="amount"
                  rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
                >
                  <InputNumber
                    min={1000}
                    style={{
                      width: "100%",
                      fontSize: "20px",
                      height: "20px",
                      textAlign: "right",
                      color: "#155724",
                      fontWeight: "bold",
                    }}
                    placeholder="Nhập số tiền"
                    formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                    parser={value => value.replace(/\./g, "")}
                    addonAfter={<span style={{ color: "#28a745", fontWeight: "bold" }}>VND</span>}
                  />
                </Form.Item>

                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px"
                  }}
                >
                  {[50000, 100000, 200000, 500000].map((amt) => (
                    <Button
                      key={amt}
                      type="default"
                      style={{
                        fontSize: "16px",
                        background: "linear-gradient(90deg, #28a745, #7ed957)",
                        color: "#fff",
                        border: "none",
                        flex: 1,
                      }}
                      onClick={() => form.setFieldsValue({ amount: amt })}
                      onMouseOver={e => e.currentTarget.style.filter = "brightness(1.1)"}
                      onMouseOut={e => e.currentTarget.style.filter = "brightness(1)"}
                    >
                      {amt.toLocaleString()}
                    </Button>
                  ))}
                </div>

                <Form.Item
                  label={<span style={{ fontSize: "16px", fontWeight: 500 }}>Nội dung chuyển khoản</span>}
                  name="note"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                  <Input style={{ fontSize: "16px" }} placeholder="Ví dụ: Ủng hộ Quỹ Vì Miền Trung" />
                </Form.Item>

                <Form.Item name="anonymous" valuePropName="checked">
                  <Checkbox
                    onChange={(e) => setAnonymous(e.target.checked)}
                    style={{ fontSize: "16px", color: "#155724" }}
                  >
                    Ủng hộ ẩn danh
                  </Checkbox>
                </Form.Item>

                <Title level={5} style={{ marginTop: "24px", fontSize: "18px" }}>Thông tin của bạn</Title>

                <Form.Item
                  label={<span style={{ fontSize: "16px", fontWeight: 500 }}>Họ và tên</span>}
                  name="name"
                  rules={[{ required: !anonymous, message: "Vui lòng nhập tên!" }]}
                >
                  <Input placeholder="Nguyễn Văn A" disabled={anonymous} style={{ fontSize: "16px" }} />
                </Form.Item>

                <Form.Item
                  label={<span style={{ fontSize: "16px", fontWeight: 500 }}>Email</span>}
                  name="email"
                  rules={[
                    { required: !anonymous, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="example@mail.com" disabled={anonymous} style={{ fontSize: "16px" }} />
                </Form.Item>

                <Form.Item>
                  <Button
                    htmlType="submit"
                    block
                    style={{
                      fontSize: "18px",
                      padding: "12px 0",
                      borderRadius: "8px",
                      background: "linear-gradient(90deg, #28a745, #7ed957)",
                      color: "#fff",
                      border: "none",
                    }}
                    onMouseOver={e => e.currentTarget.style.filter = "brightness(1.1)"}
                    onMouseOut={e => e.currentTarget.style.filter = "brightness(1)"}
                  >
                    Ủng hộ ngay
                  </Button>

                  <div style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#155724",
                    textAlign: "center",
                  }}>
                    Ủng hộ của bạn sẽ được chuyển thẳng đến quỹ, hoàn toàn minh bạch
                  </div>
                </Form.Item>

              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      <FooterSection />
    </>
  );
};

export default DonatePage;
