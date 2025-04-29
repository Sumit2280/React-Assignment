import React from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { NavigateFunction } from "react-router";
import { User } from "../types/User";

type UserListComponentProps = {
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  deleteMultipleUsers: UseMutateFunction<void, Error, string[], unknown>;
  deleteArray: string[];
  navigate: NavigateFunction;
  requestSort: (key: keyof User) => void;
  sortConfig: {
    key: string;
    direction: string;
  };
  filteredAndSortedData: User[];
  handleDeleteArray: (flag: boolean, id: string | undefined) => void;
  handleEdit: (id: string | undefined) => void;
};

type ColumnConfig = {
  label: string;
  key: keyof User;
  sortable?: boolean;
};

const tableColumns: ColumnConfig[] = [
  { label: "First Name", key: "firstName", sortable: true },
  { label: "Last Name", key: "lastName", sortable: true },
  { label: "Email", key: "email", sortable: true },
  { label: "Mobile No.", key: "mobile", sortable: true },
];

const UserListComponent = ({
  searchKey,
  setSearchKey,
  deleteMultipleUsers,
  deleteArray,
  navigate,
  requestSort,
  sortConfig,
  handleDeleteArray,
  handleEdit,
  filteredAndSortedData,
}: UserListComponentProps) => {
  return (
    <div className="container justify-center mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="search" className="mr-2 text-black">
            Search
          </label>
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <button
          onClick={() => deleteMultipleUsers(deleteArray)}
          className="bg-red-500 text-black rounded px-4 py-2"
        >
          Delete Selected
        </button>
        <button
          className="bg-red-500 text-black rounded px-4 py-2"
          onClick={() => navigate("/create")}
        >
          Create User
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4"></th>
            {tableColumns.map((col) => (
              <th key={col.key} className="p-4">
                {col.sortable ? (
                  <button
                    onClick={() => requestSort(col.key)}
                    className="flex items-center"
                  >
                    {col.label}{" "}
                    {sortConfig.key === col.key
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : null}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="p-4">
                <input
                  type="checkbox"
                  onChange={(e) => handleDeleteArray(e.target.checked, user.id)}
                />
              </td>
              {tableColumns.map((col) => (
                <td key={col.key} className="p-4">
                  {user[col.key]}
                </td>
              ))}
              <td className="p-4">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="bg-green-500 text-black px-4 py-2 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListComponent;
