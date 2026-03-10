"use client";
 
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen font-sans text-[#2D3748]">
      <section className="text-center py-50 px-10">
         <h1 className="text-5xl md:text-7xl font-extrabold text-[#2D3748] mb-6 tracking-tight">
            Manage Projects <br />
            <span className="text-[#778873]">Without the Chaos</span>
         </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
        A collaborative internal platform to create projects, assign tasks,
        and track progress using intuitive Kanban boards.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.push("/auth")}
          className="px-8 py-3 bg-[#778873] text-white rounded-lg font-semibold hover:bg-[#A1BC98] transition-all flex items-center gap-2 cursor-pointer"
        >
          Get Started <ArrowRight size={18} />
        </button>
      </div>
    </section>
    </div>
  );
};
 
export default Home;