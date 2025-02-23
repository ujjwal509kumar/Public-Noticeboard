'use client';
import { useState, useEffect } from "react";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async (date = "") => {
    let url = "/api/notices";
    if (date) url += `?date=${date}`;
    const res = await fetch(url);
    const data = await res.json();
    setNotices(data.notices);
  };

  const handleFilterChange = (e) => {
    const newDate = e.target.value;
    setFilterDate(newDate);
    fetchNotices(newDate);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Public Notice Board</h1>
      {/* Improved filter section */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="date"
            className="text-lg font-medium text-gray-700 dark:text-gray-300"
          >
            Filter by Date:
          </label>
          <input
            id="date"
            type="date"
            value={filterDate}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>
      </div>
      {/* Notices Grid */}
      <div className="grid gap-6">
        {notices.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No notices found.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {notice.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Uploaded on {new Date(notice.createdAt).toLocaleDateString()} by{" "}
                {notice.admin.name}
              </p>
              <div
                className="mt-4 text-gray-800 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: notice.content }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
