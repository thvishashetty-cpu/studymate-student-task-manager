"use client";

import { useEffect, useState } from "react";

export default function StudyPlanner() {
  const [goal, setGoal] = useState(5);
  const [studied, setStudied] = useState(0);
  const [hours, setHours] = useState("");

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("studyPlannerData");

    if (saved) {
      try {
        const data = JSON.parse(saved);

        if (data.date === today) {
          setGoal(data.goal);
          setStudied(data.studied);
        }
      } catch {
        localStorage.removeItem("studyPlannerData");
      }
    }
  }, []);

  const addStudyTime = () => {
    const value = Number(hours);

    if (!hours || value <= 0 || value > 24) {
      alert("Enter valid study hours (maximum 24).");
      return;
    }

    const newStudied = studied + value;

    setStudied(newStudied);

    localStorage.setItem(
      "studyPlannerData",
      JSON.stringify({
        date: new Date().toDateString(),
        goal,
        studied: newStudied,
      })
    );

    setHours("");
  };

  const saveGoal = () => {
    localStorage.setItem(
      "studyPlannerData",
      JSON.stringify({
        date: new Date().toDateString(),
        goal,
        studied,
      })
    );

    alert("Daily goal saved!");
  };

  const progress = goal > 0
  ? Math.min(Math.round((studied / goal) * 100), 100)
  : 0;

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Daily Study Planner
      </h2>

      <div className="mb-6">
        <label className="mb-2 block font-medium">
          Daily Study Goal (hours)
        </label>

        <input
          type="number"
          min="1"
          max="24"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="w-full rounded-lg border p-3"
        />

        <button
          onClick={saveGoal}
          className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Save Goal
        </button>
      </div>

      <div className="mb-6">
        <p className="mb-2 font-medium">
          Add Studied Hours
        </p>

        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            min="0.1"
            max="24"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Enter hours"
            className="min-w-0 flex-1 rounded-lg border p-3"
          />

          <button
            onClick={addStudyTime}
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Add Hours
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-5">
        <h3 className="mb-3 text-lg font-semibold">
          Today's Progress
        </h3>

        <p className="mb-2 text-gray-600">
          Studied: {studied} / {goal} hours
        </p>

        <div className="h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 font-bold text-blue-600">
          {progress}% Completed
        </p>

        {studied >= goal && (
          <p className="mt-2 font-medium text-green-600">
            Daily study goal achieved!
          </p>
        )}
      </div>
    </div>
  );
}
