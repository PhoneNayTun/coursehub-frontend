# CourseHub - Full-Stack MERN / Next.js Course Management Application

CourseHub is a full-stack web application designed for course management. It features role-based authentication (Teacher and Student), JWT session management, course CRUD operations, and MongoDB integration.

---

## 🔗 Project Links

* **Backend GitHub Repository:** [https://github.com/PhoneNayTun/coursehub-backend](https://github.com/PhoneNayTun/coursehub-backend)
* **Frontend GitHub Repository:** [https://github.com/PhoneNayTun/coursehub-frontend](https://github.com/PhoneNayTun/coursehub-frontend)
* **Backend Deployed API URL:** `https://your-backend-app.onrender.com` *(Replace with your live URL)*
* **Frontend Deployed Web URL:** `https://your-frontend-app.vercel.app` *(Replace with your live URL)*
* **Screen Recording Demonstration:** `https://loom.com/share/your-video-id` *(Replace with your demo video link)*

---

## 🔑 Test User Credentials

Use these pre-configured user accounts to test role-based access control and application features:

| Role | Email Address | Password | Permissions / Capabilities |
| :--- | :--- | :--- | :--- |
| **Teacher** | `teacher1@test.com` | `password123` | Full access: Create, edit, and delete courses. |
| **Student** | `student1@test.com` | `password123` | Read-only access: View available courses and enroll. |

---

## ⚙️ Environment Variables

### Backend Configuration (`next-backend/.env.local`)
```env
MONGODB_URI=mongodb+srv://appuser:phone_db_user@cluster0.srh8bq7.mongodb.net/online_course_db?retryWrites=true&w=majority
NEXTAUTH_SECRET=a8f9d0c2e4b6a8d0c2e4b6a8d0c2e4b6
NEXTAUTH_URL=http://localhost:3000
