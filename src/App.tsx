import Layout from "./components/layout/Layout"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Folder from "./pages/Folder"
import FAQ from "./pages/FAQ"
import QuizDetail from "./pages/QuizDetail"
import Feedback from "./pages/FeedBack"
import UserProfile from "./pages/UserProfile"
import UserGuide from "./pages/Guide"
import ActivityHistory from "./pages/ActivityHistory"
import RechargePaymentPage from "./pages/RechargePaymentPage"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<div>Tìm Kiếm</div>} />
          <Route path="/history" element={<ActivityHistory />} />
          <Route path="/folders" element={<Folder />} />
          <Route path="/UserGuide" element={<UserGuide />} />
          <Route path="/support" element={<FAQ />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/folders/quizzes/:id" element={<QuizDetail />} />
          <Route path="/recharge" element={<RechargePaymentPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
