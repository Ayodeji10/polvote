import ScrollToTop from "./components/scrollToTop";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DataContext } from "./dataContext";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Verify from "./screens/Verify";
import Polls from "./screens/Polls";
import SinglePoll from "./screens/SinglePoll";
import Stories from "./screens/Stories";
import SingleStory from "./screens/SingleStory";
import SinglePollReferal from "./screens/SinglePollReferal";
import Profiles from "./screens/Profiles";
import SingleProfile from "./screens/SingleProfile";
import CreateAspirant1 from "./screens/CreateAspirant1";
import CreateAspirant2 from "./screens/CreateAspirant2";
import CreateAspirant3 from "./screens/CreateAspirant3";
import PreviewAspirant from "./screens/PreviewAspirant";
import EditAspirant1 from "./screens/EditAspirant1";
import EditAspirant2 from "./screens/EditAspirants2";
import EditAspirant3 from "./screens/EditAspirant3";
import Search from "./screens/Search";
import UserProfile from "./screens/UserProfile";
import User from "./screens/User";
import Notifications from "./screens/Notifications";
import Withdrawal from "./screens/Withdrawal";
import TermsAndConditions from "./screens/TermsAndConditions";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import Groups from "./screens/Group";
import GroupList from "./screens/GroupList";
import SingleGroup from "./screens/SingleGroup";
import GroupRequests from "./screens/GroupRequests";
import GroupMembers from "./screens/GroupMembers";
import Courses from "./screens/Courses";
import CoursesDashboardUser from "./screens/CoursesDashboard";
import CourseDashboardInstructor from "./screens/CourseDashboardInstructor";
import CreateCourse1 from "./screens/CreateCourse1";
import CreateCourse2 from "./screens/CreateCourse2";
import CreateCourse3 from "./screens/CreateCourse3";
import CreateCourse4 from "./screens/CreateCourse4";
import SingleCourse from "./screens/SingleCourse";
import CourseInProgress from "./screens/CourseInProgress";
import CourseQuiz from "./screens/CourseQuiz";
import QuizReview from "./screens/QuizReview";
import CourseCertificates from "./screens/CourseCertificates";
import "./App.css";

function App() {
  // context
  const [context, setContext] = useState({
    user: {},
    newAspirant: {
      firstName: "",
      lastName: "",
      link: "",
      DOB: "",
      party: "",
      overview: "",
      education: "",
      politics: "",
      business: "",
      activism: "",
      history: [
        { pollTitle: "", pollYear: "", position: "", numberOfVotes: "" },
      ],
      ownership: "Writer",
      transfer: "No",
      amount: "",
      pollid: null,
    },
    homeSearchKey: "",
    profileView: "articles",
    articleView: "stories",
    darkMode: false,
  });

  // save context to local storage
  useEffect(() => {
    const storedData = localStorage.getItem("bb-context");
    if (storedData) {
      setContext(JSON.parse(storedData));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("bb-context", JSON.stringify(context));
  });

  return (
    <Router>
      <DataContext.Provider value={{ context, setContext }}>
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/verify/:Id" element={<Verify />} />
          <Route exact path="/polls" element={<Polls />} />
          <Route exact path="/polls/:id" element={<SinglePoll />} />
          <Route
            exact
            path="/polls/:id/:referalId"
            element={<SinglePollReferal />}
          />
          <Route exact path="/stories" element={<Stories />} />
          <Route exact path="/stories/:any/:id" element={<SingleStory />} />
          <Route exact path="/profiles" element={<Profiles />} />
          <Route exact path="/profiles/:any/:id" element={<SingleProfile />} />
          <Route exact path="/create-aspirant" element={<CreateAspirant1 />} />
          <Route
            exact
            path="/create-aspirant/setup-aspirant"
            element={<CreateAspirant2 />}
          />
          <Route
            exact
            path="/create-aspirant/submit-profile"
            element={<CreateAspirant3 />}
          />
          <Route
            exact
            path="/create-aspirant/preview"
            element={<PreviewAspirant />}
          />
          <Route exact path="/edit-aspirant/:id" element={<EditAspirant1 />} />
          <Route
            exact
            path="/edit-aspirant/setup-aspirant/:id"
            element={<EditAspirant2 />}
          />
          <Route
            exact
            path="/edit-aspirant/submit-profile/:id"
            element={<EditAspirant3 />}
          />
          <Route exact path="/search=:param" element={<Search />} />
          <Route exact path="/user-profile" element={<UserProfile />} />
          <Route exact path="/withdrawal/:id" element={<Withdrawal />} />
          <Route exact path="/user/:id" element={<User />} />
          <Route exact path="/notifications" element={<Notifications />} />
          <Route
            exact
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route exact path="/groups" element={<Groups />} />
          <Route exact path="/groups-list" element={<GroupList />} />
          <Route exact path="/groups/:id" element={<SingleGroup />} />
          <Route
            exact
            path="/groups/:id/requests"
            element={<GroupRequests />}
          />
          <Route exact path="/groups/:id/members" element={<GroupMembers />} />
          <Route exact path="/courses" element={<Courses />} />
          <Route
            exact
            path="/courses/dashboard"
            element={<CoursesDashboardUser />}
          />
          <Route
            exact
            path="/courses/dashboard/instructor"
            element={<CourseDashboardInstructor />}
          />
          <Route exact path="/create-course/info" element={<CreateCourse1 />} />
          <Route
            exact
            path="/create-course/modules"
            element={<CreateCourse2 />}
          />
          <Route
            exact
            path="/create-course/profiles"
            element={<CreateCourse3 />}
          />
          <Route
            exact
            path="/create-course/pricing"
            element={<CreateCourse4 />}
          />
          <Route exact path="/courses/single" element={<SingleCourse />} />
          <Route
            exact
            path="/courses/dashboard/single"
            element={<CourseInProgress />}
          />
          <Route
            exact
            path="/courses/dashboard/single/quiz"
            element={<CourseQuiz />}
          />
          <Route
            exact
            path="/courses/dashboard/single/quiz/review"
            element={<QuizReview />}
          />
          <Route
            exact
            path="/courses/certificates"
            element={<CourseCertificates />}
          />
        </Routes>
      </DataContext.Provider>
    </Router>
  );
}

export default App;
