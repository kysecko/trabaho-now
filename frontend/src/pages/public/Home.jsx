import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <section className="relative w-full h-[85vh] min-h-140 md:h-[80vh] lg:h-screen overflow-hidden">
      {/* Background Image - better responsive cropping */}
      <img
        src="/public-images/home-hero.png"
        alt="TrabahoNow freelance marketplace hero"
        className="absolute inset-0 h-full w-full object-cover object-center sm:object-center md:object-[center_30%]"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-6 text-center text-white">
          
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Find work for today. Or hire for today.
            <br />
            <span className="text-primary">Trabaho na!</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-navy-text sm:mt-6 sm:text-lg md:text-xl max-w-2xl mx-auto">
            Need a worker today? See who&apos;s free near you. Want work? Post
            your job offered. Everything is shown clearly: the rate, the
            availability, and past reviews. You decide before anyone commits —
            no guessing, no word-of-mouth required.
          </p>

          <div className="mt-8 sm:mt-10">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-hover sm:px-8 sm:text-base"
            >
              Create an account now
              <ChevronRightIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}