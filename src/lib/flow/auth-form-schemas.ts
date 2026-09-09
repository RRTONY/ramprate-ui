import * as Yup from "yup";

export const signInSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string().required("Password is required."),
});

export const signUpSchema = Yup.object({
  name: Yup.string().trim().required("Name is required."),
  email: Yup.string()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Use at least 8 characters.")
    .required("Password is required."),
});
