import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

import Index from "views/Index.js";
import Landing from "views/examples/Landing.js";
import Login from "views/examples/Login.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import ModifyCandidature from "views/ModifyCandidature.js";
import CreateCandidature from "views/CreateCandidature.js";
import GetCandidature from "views/GetCandidature.js";
import CreateEntretien from "views/CreateEntretien";
import ModifyEnretien from "views/ModifyEnretien";
import GetEntretien from "views/GetEntretien";
import GetListEntretien from "views/GetListEntretien";
import Formuser from "Formuser";
import ConsultTask from "views/ConsultTask";
import EditUser from "views/EditUser";
import UserProfile from "UserProfile";
import Offres from "views/examples/Offres.js";
import AddTaskForm from './views/AddTaskForm';
import ModifyTaskForm from './views/ModifyTaskForm';
import TodoList from './views/TodoList';
import PrivateRoute from './views/PrivateRoute'; // Import the PrivateRoute component
import PublicRoute from './views/PublicRoute'; // Import the PublicRoute component
import ChatPage from './views/ChatPage'; 
import GetListCandidature from './views/GetListCandidature'; 
import MyTasks from './views/MyTasks'; 


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Index />} />
      <Route path="/landing-page" exact element={<Landing />} />

      {/* Public Routes */}
      <Route path="/login-page" element={<PublicRoute element={<Login />} />} />
      <Route path="/register-page" element={<PublicRoute element={<Register />} />} />

      {/* Private Routes */}
      <Route path="/profile-page" element={<PrivateRoute element={<Profile />} />} />
      <Route path="/Offres-page" element={<Offres />}  />
      <Route path="/list-candidat/:id" element={<PrivateRoute element={<GetCandidature />} />} />
      <Route path="/list-candida" element={<PrivateRoute element={<GetListCandidature />} />} />

      <Route path="/create-candidature/:id" element={<PrivateRoute element={<CreateCandidature />} />} />
      <Route path="/create-candidature" element={<PrivateRoute element={<CreateCandidature />} />} />

      <Route path="/modify-candidature/:id" element={<PrivateRoute element={<ModifyCandidature />} />} />
      <Route path="/create-entretien" element={<PrivateRoute element={<CreateEntretien />} />} />
      <Route path="/modify-enretien/:id" element={<PrivateRoute element={<ModifyEnretien />} />} />
      <Route path="/entretien" element={<PrivateRoute element={<GetEntretien />} />} />
      <Route path="/List-Entretien" element={<PrivateRoute element={<GetListEntretien />} />} />

      <Route path="/Formuser-page" element={<PublicRoute element={<Formuser />} />} />
      <Route path="/edituser/:userId" element={<PrivateRoute element={<EditUser />} />} />
      <Route path="/UserProfile-page" element={<PrivateRoute element={<UserProfile />} />} />
      <Route path="/add-task" element={<PrivateRoute element={<AddTaskForm />} />} />
      <Route path="/modify-task/:id" element={<PrivateRoute element={<ModifyTaskForm />} />} />
      <Route path="/list-task" element={<PrivateRoute element={<TodoList />} />} />
      <Route path="/mytask" element={<PrivateRoute element={<MyTasks />} />} />

      <Route path="/chat"  element={<PrivateRoute element={<ChatPage />} />} />
    <Route path="/chat/:firstID/:secondId" element={<PrivateRoute element={<ChatPage />} />} />
    <Route path="/consult-task/:id" element={<PrivateRoute element={<ConsultTask />}/>} /> {/* New route */}
    

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
