import React from "react";
import DashboardBg from "@/assets/images/login.jpg";
import { Button, InputField, Logo } from "container/components";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoginLeft from "@/assets/images/loginLeft.png";
import RightSide from "@/assets/images/Rightside.svg";
import House from "@/assets/images/middle.png";
import { FaWaveSquare } from "react-icons/fa";
import sideContent from "@/assets/images/grp1.png";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle password reset logic here
      console.log("Password reset submitted:", values);

      // Navigate to login after successful reset
      navigate("/login");
    },
  });

  return (
    <section className="min-h-screen bg-gray-100 flex md:flex-row overflow-hidden">
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
              Reset Password
            </h1>
            <p className=" text-gray-600 mt-1">
              Please enter and confirm your new password
            </p>
          </div>

          <form
            className="w-full max-w-sm space-y-4"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <InputField
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="New Password"
                value={formik.values.newPassword}
                onChange={(value: any) =>
                  formik.setFieldValue("newPassword", value)
                }
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.newPassword}
                </div>
              ) : null}
            </div>

            <div>
              <InputField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={(value: any) =>
                  formik.setFieldValue("confirmPassword", value)
                }
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>

            <Button
              type="submit"
              className="w-full text-center justify-center py-3"
              disabled={formik.isSubmitting}
            >
              Reset Password
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
    </section>
  );
};

export default ResetPassword;
