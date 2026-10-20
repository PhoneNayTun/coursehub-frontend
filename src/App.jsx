import { useCallback, useContext, useEffect, useState } from "react";
import { HashRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { UserContext } from "./context/UserContextValue";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --- Navigation Bar ---
function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-wide text-indigo-400 hover:text-indigo-300 transition-colors">
            🎓 CourseHub
          </Link>
          {user && (
            <Link to="/courses" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Courses
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <span className="text-slate-200 font-medium">{user.username}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  user.role === "Teacher" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium bg-red-600/80 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// --- Login Page ---
function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/courses");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. teacher1@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-indigo-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          Demo: teacher1@test.com / student1@test.com (password: password123)
        </div>
      </div>
    </div>
  );
}

// --- Courses Page ---
function Courses() {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [topics, setTopics] = useState("");

  const fetchCourses = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/course?search=${encodeURIComponent(search)}`, {
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch courses");
      }
      return Array.isArray(data) ? data : [];
  }, [search, user?.token]);

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => {
        console.error("Failed to fetch courses", error);
        setMessage({ text: error.message || "Failed to fetch courses", type: "error" });
      });
  }, [fetchCourses]);

  const refreshCourses = async () => {
    try {
      setCourses(await fetchCourses());
    } catch (error) {
      console.error("Failed to refresh courses", error);
      setMessage({ text: error.message || "Failed to fetch courses", type: "error" });
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          duration: Number(duration),
          price: Number(price),
          maxStudents: Number(maxStudents),
          topics: topics ? topics.split(",").map((t) => t.trim()) : [],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Course created successfully!", type: "success" });
        setName(""); setDuration(""); setPrice(""); setMaxStudents(""); setTopics("");
        setShowCreateModal(false);
        await refreshCourses();
      } else {
        setMessage({ text: data.error || "Failed to create course", type: "error" });
      }
    } catch (error) {
      console.error("Failed to create course", error);
      setMessage({ text: "Error creating course", type: "error" });
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/api/course/${courseId}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: "Enrolled in course successfully!", type: "success" });
        await refreshCourses();
      } else {
        setMessage({ text: data.error || "Enrollment failed", type: "error" });
      }
    } catch (error) {
      console.error("Failed to enroll in course", error);
      setMessage({ text: "Error enrolling in course", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Explore Courses</h1>
            <p className="text-slate-500 mt-1">Discover, join, or manage online learning programs</p>
          </div>

          {user?.role === "Teacher" && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              ➕ Create Course
            </button>
          )}
        </div>

        {/* Banner Alert Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex justify-between items-center ${
            message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: "", type: "" })} className="text-sm font-semibold hover:opacity-75 cursor-pointer">✕</button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8 max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by course name or teacher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isEnrolled = course.enrolledStudents?.some(
              (s) => s.id === user?.id || s === user?.id
            );
            const isFull = (course.enrolledStudents?.length || 0) >= course.maxStudents;

            return (
              <div key={course._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      ⏱ {course.duration} hrs
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      course.status === "Open" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {course.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Instructor: <span className="font-medium text-slate-700">{course.teacher?.username || "Unknown"}</span>
                  </p>

                  {/* Topic Badges */}
                  {course.topics && course.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.topics.map((topic, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium">
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Price</p>
                    <p className="text-lg font-bold text-slate-900">${course.price}</p>
                  </div>

                  {user?.role === "Student" && (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      disabled={course.status !== "Open" || isFull || isEnrolled}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isEnrolled
                          ? "bg-emerald-100 text-emerald-700 cursor-default"
                          : isFull || course.status !== "Open"
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      }`}
                    >
                      {isEnrolled ? "✓ Enrolled" : isFull ? "Full" : "Enroll Now"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Form for Teachers */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Create New Course</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 text-xl cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                  <input placeholder="e.g. Web Development Bootcamp" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Hours)</label>
                    <input type="number" placeholder="40" value={duration} onChange={(e) => setDuration(e.target.value)} required className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                    <input type="number" placeholder="199" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Students</label>
                  <input type="number" placeholder="30" value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} required className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Topics (comma separated)</label>
                  <input placeholder="React, Node.js, MongoDB" value={topics} onChange={(e) => setTopics(e.target.value)} className="w-full px-3.5 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-medium cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl cursor-pointer">Create Course</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="*" element={<div className="p-8 text-center text-slate-500">404 Page Not Found</div>} />
      </Routes>
    </HashRouter>
  );
}