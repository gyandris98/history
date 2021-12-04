import React, { FunctionComponent } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AdminIndex from '../../components/custom/Admin/AdminIndex';
import AdminUsers from '../../components/custom/Admin/AdminUsers';
import NewArticle from '../../components/custom/Admin/NewArticle';
import EditArticle from '../../components/custom/Admin/EditArticle';
import ProtectedRoute from './../../components/custom/ProtectedRoute/index';
import Login from '../../components/custom/Admin/login';
import Register from '../../components/custom/Admin/register';

interface indexProps {

}

const Admin: FunctionComponent<indexProps> = () => {
  if (typeof window === 'undefined') return null;

  return (
    <Router basename="/admin">
      <Switch>
        <ProtectedRoute path={['', '/']} exact>
          <AdminIndex />
        </ProtectedRoute>

        <ProtectedRoute path="/article/new">
          <NewArticle />
        </ProtectedRoute>
        <ProtectedRoute path="/article/edit/:id">
          <EditArticle />
        </ProtectedRoute>
        <ProtectedRoute path="/users">
          <AdminUsers />
        </ProtectedRoute>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
      </Switch>
    </Router>
  );
};

export default Admin;
