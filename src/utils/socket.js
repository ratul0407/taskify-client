import { io } from "socket.io-client";
import Swal from "sweetalert2";

export const socket = io(import.meta.env.VITE_API_URL);

//handle task delete
export const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit("task-delete", { id });
    }
  });
};
