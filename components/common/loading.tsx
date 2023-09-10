import { CircularProgress } from '@/lib/mui';

function MuiLoading({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center z-10 bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
      <CircularProgress variant="plain" />
    </div>
  );
}

export default MuiLoading;
