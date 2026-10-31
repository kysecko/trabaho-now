import { ArrowLeftIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container";

export default function Download() {
  return (
    <Container>
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <DevicePhoneMobileIcon className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-navy">Install TrabahoNow</h1>
        <p className="mt-4 text-gray-600">
          Get the full app experience by installing TrabahoNow on your home screen.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
          <h2 className="font-bold text-navy">For iPhone (Safari)</h2>
          <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
            <li>Tap the <strong>Share</strong> icon at the bottom of your screen.</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
            <li>Tap <strong>Add</strong> in the top right corner.</li>
          </ol>

          <h2 className="mt-6 font-bold text-navy">For Android (Chrome)</h2>
          <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
            <li>Tap the <strong>three dots</strong> in the top right corner.</li>
            <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
            <li>Follow the prompts on your screen.</li>
          </ol>
        </div>

        <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeftIcon className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </Container>
  );
}