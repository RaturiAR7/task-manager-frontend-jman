export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-black/20 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center space-y-2">
        <p className="text-sm text-white/30">
          &copy; {new Date().getFullYear()} TaskManager. All rights reserved.
        </p>
        <div className="flex space-x-4 text-xs text-white/20">
          <a href="#" className="hover:text-white/50 transition-colors duration-200">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-white/50 transition-colors duration-200">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
