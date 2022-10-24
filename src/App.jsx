import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { Container } from 'semantic-ui-react';
import Layout from './layouts/Layout';
import AuthProvider from './context/auth';
import AuthRoute from './shared/AuthRoute';
import PostItem from './components/PostItem';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />
            <Route path="/posts/:postId" element={<PostItem />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
