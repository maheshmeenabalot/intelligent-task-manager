import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form'; 
import TaskList from './modules/Dashboard/TaskList';
import { Route, Routes, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children , auth = false }) => {
  const isLoggedIn = localStorage.getItem('user:token') != null || false;

  if (!isLoggedIn && auth) {
    return <Navigate to={'/user/sign_in'}></Navigate>; 
  } else if (isLoggedIn && ['/user/sign_up', '/user/sign_in'].includes(window.location.pathname)) {
    return <Navigate to={'/'}></Navigate>;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute auth={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/user/sign_up' element={
        <ProtectedRoute>
          <Form isSignInPage={false} />
        </ProtectedRoute>
      } />
      <Route path='/user/sign_in' element={
        <ProtectedRoute>
          <Form isSignInPage={true} />
        </ProtectedRoute>
      } />
      <Route path='/tasks' element={
        <ProtectedRoute auth={true}>
          <TaskList />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
