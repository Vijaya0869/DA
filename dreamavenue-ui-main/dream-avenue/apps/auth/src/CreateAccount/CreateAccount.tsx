import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Google from "@/assets/images/google.png";
import Facebook from "@/assets/images/facebook.png";
import DashboardBg from "@/assets/images/Rightside.svg";
import { Button, InputField, Logo } from "container/components";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoginLeft from "@/assets/images/loginLeft.png";
import AuthServices from "../Services/authService";
import RightSide from "@/assets/images/Rightside.svg";
import House from "@/assets/images/middle.png";
import sideContent from "@/assets/images/grp1.png";
import { FaWaveSquare } from "react-icons/fa";
const passwordRules =
  "Password must be 8-20 characters long, include at least one uppercase letter, one number, and one special character.";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "First name can only contain letters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "Last name can only contain letters")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters")
    .required("Email is required"),
  password: Yup.string()
    .min(8)
    .max(20)
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/, passwordRules)
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setGeneralError(null);

      try {
        const response = await AuthServices.register({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        });

        toast.success("Account created successfully!");
        const response1 = await AuthServices.sendEmailConfirmation({
          to: values.email,
          username: `${values.firstName} ${values.lastName}`,
          userEmail: values.email,
        });

        if (response) {
          const { accessToken, user } = response;
          // Assuming the API returns success message and token
          if (accessToken) localStorage.setItem("authToken", accessToken);

          // Store user info if needed
          if (user) localStorage.setItem("user", JSON.stringify(user));

          navigate("/property");
        }
      } catch (error: any) {
        console.log("error", error);
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
        setGeneralError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle Google sign up
  const handleGoogleSignUp = async () => {
    try {
      const response = await AuthServices.googleLogin();
      if (response?.data?.redirectUrl) {
        window.location.href = response?.data?.redirectUrl;
      }
    } catch (error) {
      setGeneralError("Google sign up failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 bg-gradient-to-br  from-blue-100 via-white to-emerald-100 rounded-lg  overflow-hidden">
        <div
          className="card px-10 py-10 w-full flex flex-col items-center justify-center relative overflow-hidden h-full rounded-4xl"
          style={{
            backgroundImage: `url(${LoginLeft})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-4 left-4 mb-4 ">
            <Logo className="h-14" />
          </div>
          <div className="bg-white/50 p-4 w-full flex flex-col items-center justify-center max-w-sm h-[95vh] overflow-auto py-8">
            <div className="w-full mb-8 text-left max-w-sm">
              <h1 className="text-3xl font-bold text-black">
                Get Started with<hr></hr> Dream Avenue
              </h1>
              <p className="text-gray-500 mt-1 text-base">
                Please create your account first
              </p>
            </div>

            {/* <div className="text-center text-gray-500 mb-6">Or continue with</div> */}
            {generalError && (
              <div className="text-red-500 text-center mb-4">
                {generalError}
              </div>
            )}

            <form className="space-y-4 w-full" onSubmit={formik.handleSubmit}>
              <div>
                <InputField
                  placeholder="First Name"
                  onChange={(value: string) =>
                    formik.setFieldValue("firstName", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  name="firstName"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  placeholder="Last Name"
                  onChange={(value: string) =>
                    formik.setFieldValue("lastName", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  name="lastName"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.lastName}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  placeholder="Email"
                  onChange={(value: string) =>
                    formik.setFieldValue("email", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  name="email"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  type="password"
                  placeholder="Password"
                  onChange={(value: string) =>
                    formik.setFieldValue("password", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  name="password"
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(value: string) =>
                    formik.setFieldValue("confirmPassword", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  name="confirmPassword"
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <Button
                type="submit"
                className="w-full text-center justify-center py-3"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <div className="w-full max-w-sm mb-6 space-y-4 my-4">
              <Button
                variant="outline"
                onClick={handleGoogleSignUp}
                className="w-full py-3 px-4 flex items-center justify-center text-gray-800 border border-[#E8E6F9]"
              >
                <img src={Google} alt="" className="h-6" />{" "}
                <span>Sign up with Google</span>
              </Button>
              <Button
                variant="outline"
                className="w-full py-3 px-4 flex items-center justify-center text-gray-800 border border-[#E8E6F9]"
              >
                <img src={Facebook} alt="" className="h-6" />{" "}
                <span>Sign up with Facebook</span>
              </Button>
            </div>

            <div className="mt-3 text-center flex items-center justify-center">
              <p className="text-gray-600">Already have an account?</p>
              <button
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
                className="text-indigo-900 hover:underline ml-1"
              >
                Login
              </button>
            </div>
            {/* <div className="text-center text-gray-500 mt-8">
            © Dream Avenue 2024
          </div> */}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative hidden md:flex items-center justify-center">
        {/* Background image */}
        <img
          src={RightSide}
          alt="dashboardbg"
          className="absolute inset-0 w-full h-full object-cover scale-[1.05] z-0"
        />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col items-center text-white px-6">
          <img src={sideContent} alt="Overlay Content" className="" />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default CreateAccount;
