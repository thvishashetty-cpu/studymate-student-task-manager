"use client";

import { useEffect, useState } from "react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type TimetableRow = {
  id: number;
  time: string;
  subjects: string[];
};

const initialData: TimetableRow[] = [
  {
    id: 1,
    time: "9:00 - 10:00",
    subjects: ["DSA", "Java", "DAA", "OS", "Maths", "DSA"],
  },
  {
    id: 2,
    time: "10:00 - 11:00",
    subjects: ["Maths", "OS", "Java", "DSA", "DAA", "Java"],
  },
  {
    id: 3,
    time: "11:15 - 12:15",
    subjects: ["Java", "DAA", "OS", "Maths", "DSA", "OS"],
  },
  {
    id: 4,
    time: "1:00 - 2:00",
    subjects: ["OS", "DSA", "Maths", "Java", "OS", "DAA"],
  },
  {
    id: 5,
    time: "2:00 - 3:00",
    subjects: ["DAA", "Maths", "DSA", "DAA", "Java", "Maths"],
  },
];

export default function Timetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [timetable, setTimetable] = useState<TimetableRow[]>(initialData);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const dayIndex = days.indexOf(selectedDay);

  useEffect(() => {
    const storedData = localStorage.getItem("studyMateTimetable");

    if (storedData) {
      try {
        setTimetable(JSON.parse(storedData));
      } catch {
        setTimetable(initialData);
      }
    }
  }, []);

  const updateSubject = (id: number, value: string) => {
    setTimetable((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              subjects: item.subjects.map((subject, index) =>
                index === dayIndex ? value : subject
              ),
            }
          : item
      )
    );
    setSaved(false);
  };

  const updateTime = (id: number, value: string) => {
    setTimetable((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, time: value } : item
      )
    );
    setSaved(false);
  };

  const addPeriod = () => {
    setTimetable((previous) => [
      ...previous,
      {
        id: Date.now(),
        time: "3:00 - 4:00",
        subjects: ["", "", "", "", "", ""],
      },
    ]);
    setSaved(false);
  };

  const deletePeriod = (id: number) => {
    setTimetable((previous) =>
      previous.filter((item) => item.id !== id)
    );
    setSaved(false);
  };

  const saveTimetable = () => {
    localStorage.setItem(
      "studyMateTimetable",
      JSON.stringify(timetable)
    );
    setSaved(true);
    setEditMode(false);
  };

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">
          Weekly Timetable
        </h2>

        <button
          onClick={() => {
            setEditMode(!editMode);
            setSaved(false);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          {editMode ? "Cancel Editing" : "Edit Timetable"}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`rounded-lg px-4 py-2 ${
              selectedDay === day
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {timetable.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
          >
            {editMode ? (
              <input
                value={item.time}
                onChange={(e) =>
                  updateTime(item.id, e.target.value)
                }
                className="w-36 rounded border p-2"
                placeholder="Class timing"
              />
            ) : (
              <span className="font-medium text-gray-500">
                {item.time}
              </span>
            )}

            {editMode ? (
              <input
                value={item.subjects[dayIndex]}
                onChange={(e) =>
                  updateSubject(item.id, e.target.value)
                }
                className="w-36 rounded border p-2"
                placeholder="Subject"
              />
            ) : (
              <span className="font-semibold text-gray-800">
                {item.subjects[dayIndex] || "Free Period"}
              </span>
            )}

            {editMode && (
              <button
                onClick={() => deletePeriod(item.id)}
                className="rounded-lg bg-red-100 px-3 py-2 text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {editMode && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={addPeriod}
            className="rounded-lg bg-gray-100 px-4 py-2 text-gray-800"
          >
            + Add Period
          </button>

          <button
            onClick={saveTimetable}
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Save Timetable
          </button>
        </div>
      )}

      {saved && (
        <p className="mt-4 font-medium text-green-600">
          Timetable saved successfully!
        </p>
      )}
    </div>
  );
}