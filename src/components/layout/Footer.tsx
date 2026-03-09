export default function Footer() {
  return (
    <footer className="bg-[#778873] text-[#F1F3E0] py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-2">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Project Management Tool. All rights reserved.
        </p>
        <div className="flex space-x-4 text-sm text-[#D2DCB6]">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-white transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
