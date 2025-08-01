import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import QuizContainer from './components/QuizContainer';
import AdminPerformancePage from './components/AdminPerformancePage';
import OldQuizDashboard from './components/OldQuizDashboard';
import StudentPerformance from './components/StudentPerformance';
import DefaultersPage from './components/DefaultersPage';
import ViewQuestions from './components/ViewQuestions';
import QuestionAnalysis from './components/QuestionAnalysis'; // ✅ Import
import SuperAdminEditor from './components/SuperAdminEditor';
import QuizCountPage from './components/QuizCountPage';
import ClassDetailsPage from './components/ClassDetailsPage';

function WrappedQuizContainer() {
  const { topicId } = useParams();
  return <QuizContainer topicId={topicId} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/quiz/:topicId" element={<WrappedQuizContainer />} />
        <Route path="/admin/performance/:topicId" element={<AdminPerformancePage />} />
        <Route path="/old-quizzes" element={<OldQuizDashboard />} />
        <Route path="/admin/student-performance" element={<StudentPerformance />} />
        <Route path="/admin/defaulters/:topicId" element={<DefaultersPage />} />
        <Route path="/admin/view-questions/:topicId" element={<ViewQuestions />} />
        <Route path="/admin/question-analysis/:topicId" element={<QuestionAnalysis />} /> {/* ✅ New Route */}
        <Route path="/superadmin-editor" element={<SuperAdminEditor />} />
        <Route path="/admin/quiz-count" element={<QuizCountPage />} />
        <Route path="/admin/class-details/:topicId" element={<ClassDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
