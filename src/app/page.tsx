
import TimerContainer from '@/components/timers/TimerContainer';
import SessionLog from '@/components/sessions/SessionLog';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full space-y-8">
      <TimerContainer />
      <div className="w-full max-w-2xl mx-auto lg:hidden"> {/* Show on small screens, hide on large (lg and up) where sidebar is visible */}
         <h2 className="text-xl font-semibold mb-3 text-center">Session Log</h2>
         <SessionLog />
      </div>
    </div>
  );
}
