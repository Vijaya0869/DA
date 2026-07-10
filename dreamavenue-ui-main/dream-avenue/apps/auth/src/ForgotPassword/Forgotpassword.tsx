import React, { useEffect } from "react";
import DashboardBg from "@/assets/images/login.jpg";
import { Button, InputField, Logo } from "container/components";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoginLeft from "@/assets/images/loginLeft.png";
import AuthServices from "../Services/authService";
import RightSide from "@/assets/images/Rightside.svg";
import House from "@/assets/images/middle.png";
import toast, { Toaster } from "react-hot-toast";
import { FaWaveSquare } from "react-icons/fa";
import sideContent from "@/assets/images/grp1.png";

const Forgotpassword: React.FC = () => {
  const navigate = useNavigate();

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Handle forgot password logic here
      try {
        console.log("Forgot password submitted for:", values.email);
        const response: any = await AuthServices.resetPassword({
          to: values?.email,
          username: values?.email?.split("@")[0],
          userEmail: values?.email,
        });
        if (response) {
          toast.success("Password reset link has been sent to your email.");
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 via-white to-emerald-100 rounded-lg shadow-lg overflow-hidden">
        <div
          className="card px-10 py-10 w-full flex flex-col items-center justify-center relative overflow-hidden h-full rounded-4xl"
          style={{
            backgroundImage: `url(${LoginLeft})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-4 left-4 mb-6 ">
            <Logo className="h-14" />
          </div>
          <div className="w-full max-w-sm mb-6 text-left">
            <h1 className="text-3xl font-semibold mb-6 mt-14">
              Forgot Password
            </h1>
            <p className=" text-gray-600  mt-1">
              Enter your registered email here
            </p>
          </div>
          <form
            className="w-full max-w-sm space-y-4"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <InputField
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={formik.values.email}
                onChange={(value: any) => formik.setFieldValue("email", value)}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full text-center justify-center py-3"
              disabled={formik.isSubmitting}
            >
              Submit
            </Button>
          </form>
          <div className="mt-6 text-center flex items-center justify-center">
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

export default Forgotpassword;
