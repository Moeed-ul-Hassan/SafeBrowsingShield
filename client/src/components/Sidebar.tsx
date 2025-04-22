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
           "flex items-center px-4 py-3 rounded-md bg-primary-50 text-primary-700 font-medium" : 
           "flex items-center px-4 py-3 rounded-md text-slate-600 hover:bg-slate-50 font-medium";
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 h-auto md:h-screen flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center text-white">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1 className="ml-3 text-xl font-bold text-slate-800">FocusShield</h1>
        </div>

        <nav>
          <ul>
            <li className="mb-1">
              <Link href="/dashboard">
                <a className={isActive('/dashboard')}>
                  <i className="fas fa-home w-5"></i>
                  <span className="ml-3">Dashboard</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/protection">
                <a className={isActive('/protection')}>
                  <i className="fas fa-shield-alt w-5"></i>
                  <span className="ml-3">Protection Settings</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/accountability">
                <a className={isActive('/accountability')}>
                  <i className="fas fa-user-friends w-5"></i>
                  <span className="ml-3">Accountability</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/statistics">
                <a className={isActive('/statistics')}>
                  <i className="fas fa-chart-line w-5"></i>
                  <span className="ml-3">Statistics</span>
                </a>
              </Link>
            </li>
            <li className="mb-1">
              <Link href="/motivation">
                <a className={isActive('/motivation')}>
                  <i className="fas fa-trophy w-5"></i>
                  <span className="ml-3">Motivation</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-200 p-6">
        <DaysCleanTracker />
      </div>
    </aside>
  );
};

export default Sidebar;
