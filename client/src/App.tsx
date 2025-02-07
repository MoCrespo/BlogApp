import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './pages/login';
import Register from './pages/register';
import Posts from './pages/posts';
import PostDetail from './pages/postDetail';
import Profile from './pages/profile';
import ProfileEdit from './pages/ProfileEdit';
import NewPost from './pages/NewPost';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          <Route path="/posts/new" element={<NewPost />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
