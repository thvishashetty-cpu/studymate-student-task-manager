import type { Metadata } from "next";
import { TaskProvider } from "./context/TaskContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyMate - Student Task Manager",
  description: "Manage student tasks and deadlines easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}