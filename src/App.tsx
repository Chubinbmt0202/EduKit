import Layout from "./components/layout/Layout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<div>Tìm Kiếm</div>} />
          <Route path="/history" element={<div>Lịch Sử</div>} />
          <Route path="/folders" element={<div>Bộ Đề Đã Tạo</div>} />
          <Route path="/guides" element={<div>Hướng Dẫn Sử Dụng</div>} />
          <Route path="/feedback" element={<div>Phản Hồi Và Góp Ý</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
