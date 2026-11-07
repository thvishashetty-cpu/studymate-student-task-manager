"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type Task = {
  id: number;
  title: string;
  subject: string;
  priority: string;
  dueDate: string;
  done: boolean;
};

type TaskContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete Java Assignment",
      subject: "Java",
      priority: "High",
      dueDate: "2026-11-05",
      done: false,
    },
    {
      id: 2,
      title: "Study Operating Systems",
      subject: "OS",
      priority: "Medium",
      dueDate: "2026-11-06",
      done: false,
    },
    {
      id: 3,
      title: "Complete DSA Notes",
      subject: "DSA",
      priority: "Low",
      dueDate: "2026-11-07",
      done: true,
    },
    {
      id: 4,
      title: "Prepare Maths Problems",
      subject: "Maths",
      priority: "High",
      dueDate: "2026-11-08",
      done: false,
    },
  ]);

  const [loaded, setLoaded] = useState(false);

  // Load saved tasks when the website opens
  useEffect(() => {
    const savedTasks = localStorage.getItem("studyMateTasks");

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch {
        console.log("Unable to load saved tasks.");
      }
    }

    setLoaded(true);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "studyMateTasks",
        JSON.stringify(tasks)
      );
    }
  }, [tasks, loaded]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error("useTasks must be used inside TaskProvider");
  }

  return context;
}