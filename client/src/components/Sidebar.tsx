import { FC } from 'react';
import { Link } from 'wouter';
import DaysCleanTracker from './DaysCleanTracker';

interface SidebarProps {
  activePath: string;
}

const Sidebar: FC<SidebarProps> = ({ activePath }) => {
  const isActive = (path: string) => {
    return activePath === path || 
           (path === '/dashboard' && activePath === '/') ? 
           "flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/10 text-primary font-medium border-l-4 border-primary shadow-sm" : 
           "flex items-center px-4 py-3 rounded-lg text-foreground hover:bg-accent/5 hover:text-primary transition-all duration-200 font-medium";
  };

  return (
    <aside className="w-full md:w-64 bg-background border-r border-border h-auto md:h-screen flex-shrink-0 shadow-sm">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">FocusShield</h1>
            <div className="text-xs text-muted-foreground">Islamic guidance for purity</div>
          </div>
        </div>

        <nav className="space-y-2">
          <ul>
            <li className="mb-1">
              <Link href="/dashboard">
                <a className={isActive('/dashboard')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="ml-3">Dashboard</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/protection">
                <a className={isActive('/protection')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="ml-3">Protection Settings</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/accountability">
                <a className={isActive('/accountability')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="ml-3">Accountability</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/statistics">
                <a className={isActive('/statistics')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="ml-3">Statistics</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/motivation">
                <a className={isActive('/motivation')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="ml-3">Islamic Guidance</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border p-6 bg-background/40">
        <DaysCleanTracker />
      </div>
    </aside>
  );
};

export default Sidebar;
