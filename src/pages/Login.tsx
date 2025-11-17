/* eslint-disable @typescript-eslint/no-explicit-any */
// Đã thêm Divider vào import từ antd
import { Button, Checkbox, Form, Grid, Input, theme, Typography, Divider } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function Login() {
    const { token } = useToken();
    const screens = useBreakpoint();
    const navigate = useNavigate();

    // Loại bỏ hàm handleLoginGoogle không dùng đến khi sử dụng <GoogleLogin />

    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
        // Ở đây, bạn sẽ gửi email/password lên backend để đăng nhập
    };

    const styles = {
        container: {
            margin: "0 auto",
            padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
            width: "380px"
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: "center" as const,
            width: "100%"
        },
        forgotPassword: {
            float: "right" as const
        },
        header: {
            marginBottom: token.marginXL
        },
        section: {
            alignItems: "center",
            backgroundColor: token.colorBgContainer,
            display: "flex",
            height: screens.sm ? "100vh" : "auto",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
        },
        text: {
            color: token.colorTextSecondary
        },
        title: {
            fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
        },
        // Thêm style cho phần Google Login để căn giữa
        googleLoginContainer: {
            display: 'flex',
            justifyContent: 'center', // Căn giữa nút Google
            marginTop: token.marginLG,
            marginBottom: token.marginLG,
        }
    };

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Giữ nguyên icon */}
                        <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
                        <path
                            d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
                            fill="white"
                        />
                        <path
                            d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
                            fill="white"
                        />
                        <path
                            d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
                            fill="white"
                        />
                    </svg>

                    <Title style={styles.title}>Đăng nhập</Title>
                    <Text style={styles.text}>
                        Chào mừng bạn trở lại với EduKit! Vui lòng nhập thông tin của bạn bên dưới để đăng nhập.
                    </Text>
                </div>
                {/* FORM ĐĂNG NHẬP EMAIL/PASSWORD */}
                <Form
                    name="normal_login"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                                message: "Vui lòng điền Email của bạn",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng điền mật khẩu của bạn",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Ghi nhớ mật khẩu</Checkbox>
                        </Form.Item>
                        <a style={styles.forgotPassword} href="">
                            Quên mật khẩu?
                        </a>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: "0px" }}>
                        <Button block type="primary" htmlType="submit">
                            Đăng nhập
                        </Button>
                        <div style={styles.footer}>
                            <Text style={styles.text}>Bạn chưa có tài khoản?</Text>{" "}
                            <Link href="">Đăng ký ngay</Link>
                        </div>
                    </Form.Item>
                </Form>

                {/* PHÂN CÁCH VÀ GOOGLE LOGIN */}
                <Divider>Hoặc tiếp tục với</Divider>

                <div style={styles.googleLoginContainer}>
                    {/* Component GoogleLogin hiển thị nút Google mặc định */}
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            const ID_TOKEN = credentialResponse.credential;
                            console.log("ID_TOKEN:", ID_TOKEN);
                            axios.post('http://localhost:5000/api/auth/google', {
                                token: ID_TOKEN
                            }, { withCredentials: true }).then(response => {

                                const { user } = response.data;
                                localStorage.setItem('user', JSON.stringify(user));
                                console.log("Đăng nhập thành công:", response.data);
                                // chuyển hướng sang trang home
                                navigate('/');
                            }).catch(error => {
                                console.error("Lỗi đăng nhập:", error);
                            });
                            // TODO: Gửi credentialResponse.credential lên backend để xác thực
                        }}
                        onError={() => console.log("đăng nhập không thành công")}
                    />
                </div>
            </div>
        </section>
    );
}