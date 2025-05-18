import AppRoutes from "./routes";
import { useEffect } from 'react';
import { playClickSound } from './utils/sound';

function App() {
  useEffect(() => {
    const handleClick = () => {
      playClickSound();
    };

    // Add click event listener to the whole document
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <AppRoutes />
    </div>
  );
}

export default App;
