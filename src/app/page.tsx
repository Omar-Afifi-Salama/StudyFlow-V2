
import TimerContainer from '@/components/timers/TimerContainer';
import SessionLog from '@/components/sessions/SessionLog';
import SleepCountdownSidebar from '@/components/layout/SleepCountdownSidebar';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full space-y-8">
      <TimerContainer />

      <div className="w-full max-w-lg mx-auto">
        <SleepCountdownSidebar />
      </div>

      <div className="w-full max-w-2xl mx-auto">
         <h2 className="text-xl font-semibold mb-3 text-center">Session Log</h2>
         <SessionLog />
      </div>
    </div>
  );
}
