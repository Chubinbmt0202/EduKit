import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';

// ... (Các imports components của bạn) ...

// Layout chính có Header/Sidebar
import Layout from "./components/layout/Layout"
// Layout tối giản cho Quiz (hoặc không có layout nào)
import LayoutQuiz from './pages/Student/layout/layoutQuizPage';
import StudentQuizPage from './pages/Student/StudentQuizPage';
import ActivityHistory from './pages/ActivityHistory';
import FAQ from './pages/FAQ';
import Folder from './pages/Folder';
import UserGuide from './pages/Guide';
import Home from './pages/Home';
import QuizDetail from './pages/QuizDetail';
import RechargePaymentPage from './pages/RechargePaymentPage';
import UserProfile from './pages/UserProfile';
import Feedback from './pages/FeedBack';
// ... (Các imports trang khác) ...

// Placeholders for components not yet fully built
const SearchPage = () => <div style={{ padding: 24 }}>Trang Tìm Kiếm</div>;


// Component chứa các routes sử dụng Layout (CustomLayout)
// Dùng Outlet để hiển thị component con
const StandardLayoutWrapper: React.FC = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ROUTE ĐỘC LẬP (Sử dụng LayoutQuiz) */}
        {/* Bạn có thể đặt LayoutQuiz ở đây hoặc ngay trong StudentQuizPage nếu cần */}
        <Route
          path="/quiz/play/:id"
          element={
            <LayoutQuiz>
              <StudentQuizPage />
            </LayoutQuiz>
          }
        />

        {/* 2. ROUTE CHÍNH (Sử dụng CustomLayout/Layout) */}
        {/* Dùng Layout lồng nhau: path="/" là Layout, các path con kế thừa Layout */}
        <Route path="/" element={<StandardLayoutWrapper />}>
          {/* Routes Chuẩn (Có Header & Sidebar) */}
          <Route index element={<Home />} /> {/* index route cho path="/" */}
          <Route path="search" element={<SearchPage />} />
          <Route path="history" element={<ActivityHistory />} />
          <Route path="folders" element={<Folder />} />
          <Route path="UserGuide" element={<UserGuide />} />
          <Route path="support" element={<FAQ />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="folders/quizzes/:id" element={<QuizDetail />} />
          <Route path="recharge" element={<RechargePaymentPage />} />
        </Route>

        {/* Optional: Thêm trang Not Found (404) */}
        <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;