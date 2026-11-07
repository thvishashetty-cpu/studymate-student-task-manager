"use client";

import { useState, useEffect } from "react";
import Timetable from "./components/timetable";
import StudyPlanner from "./components/studyplanner";
import { useTasks, type Task } from "./context/TaskContext";

export default function Home() {
  const { tasks, setTasks } = useTasks();

  const [activePage, setActivePage] = useState("Dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [filter, setFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("studyMateTheme");
    setDarkMode(savedTheme === "dark");
  }, []);

  function toggleTheme() {
    const newTheme = !darkMode;
    setDarkMode(newTheme);

    localStorage.setItem(
      "studyMateTheme",
      newTheme ? "dark" : "light"
    );
  }

  // Task Statistics
  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;

  const progress =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0;

  // Search and Filters
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === "All" ||
      (filter === "Pending" && !task.done) ||
      (filter === "Completed" && task.done);

    const subjectMatch =
      subjectFilter === "All" || task.subject === subjectFilter;

    const searchMatch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && subjectMatch && searchMatch;
  });

  function toggleTask(id: number) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function resetForm() {
    setTitle("");
    setSubject("");
    setPriority("Medium");
    setDueDate("");
    setEditingTaskId(null);
    setShowForm(false);
  }

  function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingTaskId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: title.trim(),
                subject: subject.trim(),
                priority,
                dueDate,
              }
            : task
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: title.trim(),
        subject: subject.trim(),
        priority,
        dueDate,
        done: false,
      };

      setTasks((previous) => [...previous, newTask]);
    }

    resetForm();
  }

  function editTask(task: Task) {
    setTitle(task.title);
    setSubject(task.subject);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditingTaskId(task.id);
    setShowForm(true);
  }

  function deleteTask(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );
    }
  }

  function openAddTask() {
    resetForm();
    setShowForm(true);
    setActivePage("Dashboard");
  }

  return (
    <div className={darkMode ? "dashboard dark-mode" : "dashboard"}>
      <aside className="sidebar">
        <h2>StudyMate.</h2>
        <p className="menu-label">MENU</p>

        <a
          className={activePage === "Dashboard" ? "active" : ""}
          onClick={() => {
            setActivePage("Dashboard");
            resetForm();
          }}
        >
          ▦ Dashboard
        </a>

        <a
          className={activePage === "My Tasks" ? "active" : ""}
          onClick={() => {
            setActivePage("My Tasks");
            resetForm();
          }}
        >
          ☷ My Tasks
        </a>

        <a onClick={openAddTask}>＋ Add Task</a>

        <a
          className={activePage === "Timetable" ? "active" : ""}
          onClick={() => {
            setActivePage("Timetable");
            resetForm();
          }}
        >
          ▦ Timetable
        </a>

        <a
          className={activePage === "Study Planner" ? "active" : ""}
          onClick={() => {
            setActivePage("Study Planner");
            resetForm();
          }}
        >
          📖 Study Planner
        </a>

        <div className="sidebar-bottom">
          Your academic companion ✨
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span>Student Workspace</span>

          <div className="topbar-actions">
            <button
              className="theme-button"
              onClick={toggleTheme}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <span>👩‍🎓 My Profile</span>
          </div>
        </header>

        {activePage === "Timetable" ? (
          <Timetable />
        ) : activePage === "Study Planner" ? (
          <StudyPlanner />
        ) : (
          <>
            {activePage === "Dashboard" && (
              <>
                <section className="welcome">
                  <div>
                    <p className="date">YOUR PERSONAL STUDY SPACE</p>
                    <h1>Welcome back! 👋</h1>
                    <p>
                      Stay organized and make every study day count.
                    </p>
                  </div>

                  <div className="welcome-icon">📚</div>
                </section>

                <section className="stats">
                  <div className="stat-card">
                    <span>Total Tasks</span>
                    <h2>{tasks.length}</h2>
                    <small>All academic activities</small>
                  </div>

                  <div className="stat-card">
                    <span>Pending Tasks</span>
                    <h2>{pending}</h2>
                    <small>Tasks to complete</small>
                  </div>

                  <div className="stat-card">
                    <span>Completed</span>
                    <h2>{completed}</h2>
                    <small>Successfully finished</small>
                  </div>

                  <div className="stat-card">
                    <span>Progress</span>
                    <h2>{progress}%</h2>
                    <small>Overall completion</small>
                  </div>
                </section>
              </>
            )}

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>My Tasks</h2>
                    <p>Keep track of your academic work.</p>
                  </div>

                  <button
                    className="add-button"
                    onClick={openAddTask}
                  >
                    + Add Task
                  </button>
                </div>

                {showForm && (
                  <form className="task-form" onSubmit={saveTask}>
                    <h3>
                      {editingTaskId !== null
                        ? "Edit Task"
                        : "Add a New Task"}
                    </h3>

                    <label>Task Name</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter task name"
                      required
                    />

                    <label>Subject</label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject"
                      required
                    />

                    <label>Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />

                    <label>Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>

                    <button type="submit" className="add-button">
                      {editingTaskId !== null
                        ? "Update Task"
                        : "Save Task"}
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  </form>
                )}

                {/* Search and Filters */}
                <div className="filters">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />

                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option>All</option>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>

                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  >
                    <option>All</option>
                    {[...new Set(tasks.map((task) => task.subject))].map(
                      (item) => (
                        <option key={item}>{item}</option>
                      )
                    )}
                  </select>
                </div>

                {filteredTasks.length === 0 ? (
                  <p>No tasks found.</p>
                ) : (
                  filteredTasks.map((task) => (
                    <div className="task-card" key={task.id}>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                      />

                      <div className="task-info">
                        <h3 className={task.done ? "completed" : ""}>
                          {task.title}
                        </h3>

                        <p>
                          {task.subject} • Due: {task.dueDate}
                        </p>
                      </div>

                      <span
                        className={`priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                      <button
                        type="button"
                        onClick={() => editTask(task)}
                        className="task-action edit-action"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="task-action delete-action"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>

              {activePage === "Dashboard" && (
                <div className="panel progress-panel">
                  <h2>Study Progress</h2>
                  <p>Your task completion overview.</p>

                  <div
                    className="progress-circle"
                    style={{
                      background: `conic-gradient(#7059d9 ${progress}%, #eeeaff ${progress}% 100%)`,
                    }}
                  >
                    <span>{progress}%</span>
                  </div>

                  <h3>
                    {completed} of {tasks.length} tasks completed
                  </h3>

                  <p>Keep going! Every completed task counts.</p>
                </div>
              )}
            </section>

            {activePage === "Dashboard" && (
              <footer>
                StudyMate © 2026 | Plan better. Study smarter.
              </footer>
            )}
          </>
        )}
      </main>
    </div>
  );
}