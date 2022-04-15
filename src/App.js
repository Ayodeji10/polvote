import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DataContext } from './dataContext';
import Home from './screens/Home';
import Login from './screens/Login';
import Polls from './screens/Polls';
import SinglePoll from './screens/SinglePoll';
import Stories from './screens/Stories';
import SingleStory from './screens/SingleStory';
import Profiles from './screens/Profiles';
import SingleProfile from './screens/SingleProfile';
import CreateAspirant1 from './screens/CreateAspirant1';
import CreateAspirant2 from './screens/CreateAspirant2';
import CreateAspirant3 from './screens/CreateAspirant3';
import PreviewAspirant from './screens/PreviewAspirant';
import EditAspirant1 from './screens/EditAspirant1';
import EditAspirant2 from './screens/EditAspirants2';
import EditAspirant3 from './screens/EditAspirant3';
import Search from './screens/Search';
import UserProfile from './screens/UserProfile';
import Courses from './screens/Courses';
import SingleCourse from './screens/SingleCourse';
import CoursesDashboardUser from './screens/CoursesDashboardUser';
import CourseInProgress from './screens/CourseInProgress';
import './App.css';

function App() {
  // context 
  const [context, setContext] = useState({
    user: {},
    newAspirant: { firstName: "", lastName: "", link: "", profileImg: null, DOB: "", party: "", overview: "", education: "", politics: "", business: "", activism: "", history: [{ pollTitle: "", pollYear: "", position: "", numberOfVotes: "" }], ownership: "Writer", transfer: "No", amount: "", pollid: null },
  })

  // save context to local storage
  useEffect(() => {
    const storedData = localStorage.getItem('bb-context')
    if (storedData) {
      setContext(JSON.parse(storedData))
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('bb-context', JSON.stringify(context))
  })

  return (
    <Router>
      <DataContext.Provider value={{ context, setContext }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login/:Id" element={<Login />} />
          <Route exact path="/polls" element={<Polls />} />
          <Route exact path="/polls/:id" element={<SinglePoll />} />
          <Route exact path="/stories" element={<Stories />} />
          <Route exact path="/stories/:id" element={<SingleStory />} />
          <Route exact path="/profiles" element={<Profiles />} />
          <Route exact path="/profiles/single/:id" element={<SingleProfile />} />
          <Route exact path="/create-aspirant" element={<CreateAspirant1 />} />
          <Route exact path="/create-aspirant/setup-aspirant" element={<CreateAspirant2 />} />
          <Route exact path="/create-aspirant/submit-profile" element={<CreateAspirant3 />} />
          <Route exact path="/create-aspirant/preview" element={<PreviewAspirant />} />
          <Route exact path="/edit-aspirant/:id" element={<EditAspirant1 />} />
          <Route exact path="/edit-aspirant/setup-aspirant/:id" element={<EditAspirant2 />} />
          <Route exact path="/edit-aspirant/submit-profile/:id" element={<EditAspirant3 />} />
          <Route exact path="/search" element={<Search />} />
          <Route exact path="/user-profile" element={<UserProfile />} />
          <Route exact path="/courses" element={<Courses />} />
          <Route exact path="/courses/single" element={<SingleCourse />} />
          <Route exact path="/courses/dashboard" element={<CoursesDashboardUser />} />
          <Route exact path="/courses/dashboard/single" element={<CourseInProgress />} />
        </Routes>
      </DataContext.Provider>
    </Router>
  );
}

export default App;
