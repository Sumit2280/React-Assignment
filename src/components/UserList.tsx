import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUsers, getUsers } from "../api/api";
import { User } from "../types/User";
import { useNavigate } from "react-router-dom";
import UserListComponent from "./UserListComponent";

const UserList = () => {
  const queryClient = useQueryClient();
  const [searchKey, setSearchKey] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const navigate = useNavigate();
  let deleteArray: string[] = [];

  const handleDeleteArray = (flag: boolean, id: string | undefined) => {
    if (id) {
      if (flag) {
        if (!deleteArray.includes(id)) {
          deleteArray.push(id);
        }
      } else {
        deleteArray = deleteArray.filter((item) => item !== id);
      }
    }
  };

  const { data, isLoading, error } = useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
  });

  const { mutate: deleteMultipleUsers } = useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleEdit = (id: string | undefined) => {
    navigate(`/edit/${id}`);
  };

  const requestSort = (key: keyof User) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData: User[] = useMemo(() => {
    if (!data) return [];

    let filtered = data;
    if (searchKey.trim()) {
      const lowerSearch = searchKey.toLowerCase();
      filtered = data.filter((user: User) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    return filtered.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      }
    );
  }, [data, searchKey, sortConfig]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <UserListComponent
      searchKey={searchKey}
      setSearchKey={setSearchKey}
      deleteArray={deleteArray}
      deleteMultipleUsers={deleteMultipleUsers}
      handleDeleteArray={handleDeleteArray}
      handleEdit={handleEdit}
      navigate={navigate}
      requestSort={requestSort}
      sortConfig={sortConfig}
      filteredAndSortedData={filteredAndSortedData}
    />
  );
};

export default UserList;
