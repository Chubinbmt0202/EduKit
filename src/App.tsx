import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { ROUTES } from './constants';

// Layouts
import Layout from "./components/layout/Layout"

// Pages
import Home from './pages/Home';
import LayoutQuiz from './pages/Student/layout/layoutQuizPage';
import StudentQuizPage from './pages/Student/StudentQuizPage';
import ActivityHistory from './pages/ActivityHistory';
import FAQ from './pages/FAQ';
import Folder from './pages/Folder';
import UserGuide from './pages/Guide';
import QuizDetail from './pages/QuizDetail';
import RechargePaymentPage from './pages/RechargePaymentPage';
import UserProfile from './pages/UserProfile';
import Feedback from './pages/FeedBack';

const NotFoundPage = () => <div style={{ padding: 24 }}>404 - Trang không tìm thấy</div>;

// Wrapper component
const StandardLayoutWrapper: React.FC = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Quiz routes */}
        <Route
          path={ROUTES.HOME.replace(':id', ':id')}
          element={
            <LayoutQuiz>
              <StudentQuizPage />
            </LayoutQuiz>
          }
        />

        {/* Main layout routes */}
        <Route path="/" element={<StandardLayoutWrapper />}>
          <Route index element={<Home />} />
          <Route path="history" element={<ActivityHistory />} />
          <Route path="folders" element={<Folder />} />
          <Route path="UserGuide" element={<UserGuide />} />
          <Route path="support" element={<FAQ />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="folders/quizzes/:id" element={<QuizDetail />} />
          <Route path="recharge" element={<RechargePaymentPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;