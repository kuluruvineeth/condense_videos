import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-6 lg:left-8 right-6 lg:right-8 py-6 lg:pt-8 pb-0 z-30">
      <div className="w-full border border-gray-200 p-3 lg:p-4 max-w-5xl bg-gray-50/90 backdrop-blur-lg sm:grid flex justify-between sm:grid-cols-3 items-center mx-auto rounded-2xl">
        <Link href={"/"} className="flex items-center gap-2">
          <p className="font-semibold sm:text-xl">Condense</p>
        </Link>
        <div className="sm:flex gap-4 items-center"></div>

        <div className="flex justify-end items-center">
          <Link
            href={"/video"}
            className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-950 to-zinc-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-zinc-950 flex-shrink-0"
          >
            Condense Now
          </Link>
        </div>
      </div>
    </nav>
  );
};
