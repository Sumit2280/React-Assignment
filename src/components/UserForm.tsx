import { useFormik } from "formik";
import * as Yup from "yup";
import { getUsersById, postUser, updateUser } from "../api/api";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types/User";

type FormField = {
  label: string;
  name: keyof User;
  type: string;
};

const formFields: FormField[] = [
  { label: "First Name", name: "firstName", type: "text" },
  { label: "Last Name", name: "lastName", type: "text" },
  { label: "Email", name: "email", type: "email" },
  { label: "Mobile No.", name: "mobile", type: "text" },
  { label: "Address", name: "address", type: "text" },
];

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUsersById(id),
    enabled: !!id,
  });

  const initialValues: User = {
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    mobile: userData?.mobile || "",
    address: userData?.address || "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Please enter first name")
      .min(3, "Can't be less than 3 characters")
      .max(10, "Can't be more than 10 characters"),
    lastName: Yup.string()
      .required("Please enter last name")
      .min(3, "Can't be less than 3 characters")
      .max(10, "Can't be more than 10 characters"),
    email: Yup.string()
      .required("Please enter email")
      .email("Please enter a valid email"),
    mobile: Yup.string()
      .required("Please enter mobile number")
      .length(10, "Must be 10 digits")
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
    address: Yup.string().max(50, "Must be less than 50 characters"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (id) {
          await updateUser(id, values);
        } else {
          await postUser(values);
        }
        navigate("/");
      } catch (err) {
        console.error("Submit failed:", err);
      }
    },
  });

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Error loading user: {(error as Error).message}
      </p>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {id ? "Edit User" : "Create User"}
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {formFields.map(({ label, name, type }) => (
          <div key={name}>
            <label htmlFor={name} className="block font-medium text-gray-700">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched[name] && formik.errors[name] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[name]}
              </div>
            )}
          </div>
        ))}

        <div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {id ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
