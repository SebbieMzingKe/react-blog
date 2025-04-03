import Navbar from './Navbar';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Create from './Create';
import BlogDetails from './blogdetails';
import NotFound from './notfound';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import { AuthProvider } from './AuthContext';
import Signup from './SignUp';
import { useState } from 'react';

function App() {
  const [localBlogs, setLocalBlogs] = useState([]);

  const addNewBlog = (newBlog) => {
    setLocalBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Home localBlogs={localBlogs} addNewBlog={addNewBlog} />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <PrivateRoute path="/create" component={() => <Create addNewBlog={addNewBlog} />} />
              <PrivateRoute path="/blogs/:id" component={BlogDetails} />
              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;