import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Logo } from "container/components";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-gray-700">
        {/* Logo and description */}
        <div className="flex flex-col space-y-4">
          <Logo className="h-14 rounded-none" />
          <p className="text-gray-500 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
          </p>
        </div>

        {/* About Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">ABOUT</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600">Company</a></li>
            <li><a href="#" className="hover:text-indigo-600">How it works</a></li>
            <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
            <li><a href="#" className="hover:text-indigo-600">Investors</a></li>
          </ul>
        </div>

        {/* Services Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">SERVICES</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600">Invest</a></li>
            <li><a href="#" className="hover:text-indigo-600">Analyse</a></li>
            <li><a href="#" className="hover:text-indigo-600">Marketing</a></li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">RESOURCES</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600">Terms of Services</a></li>
            <li><a href="#" className="hover:text-indigo-600">FAQ</a></li>
            <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-indigo-600">Help Centre</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 border-t pt-6 flex  justify-between items-center text-gray-500 text-sm">
        <p>© Dream Avenue 2024. All rights reserved</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-900" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-900" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-900" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-900" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
