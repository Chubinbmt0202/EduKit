import Layout from "./components/layout/Layout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Folder from "./pages/Folder"
import QuizDetail from "./pages/QuizDetail"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<div>Tìm Kiếm</div>} />
          <Route path="/history" element={<div>Lịch Sử</div>} />
          <Route path="/folders" element={<Folder />} />
          <Route path="/guides" element={<div>Hướng Dẫn Sử Dụng</div>} />
          <Route path="/feedback" element={<div>Phản Hồi Và Góp Ý</div>} />
          <Route path="/folders/quizzes/:id" element={<QuizDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
