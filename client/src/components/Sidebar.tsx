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
           "flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary font-medium border-l-4 border-primary shadow-sm" : 
           "flex items-center px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary transition-all duration-200 font-medium";
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 h-auto md:h-screen flex-shrink-0 shadow-sm">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-md">
            <i className="fas fa-shield-alt text-xl"></i>
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold">FocusShield</h1>
            <div className="text-xs text-slate-500">Freedom from addiction</div>
          </div>
        </div>

        <nav className="space-y-2">
          <ul>
            <li>
              <Link href="/dashboard">
                <a className={isActive('/dashboard')}>
                  <i className="fas fa-home w-5"></i>
                  <span className="ml-3">Dashboard</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/protection">
                <a className={isActive('/protection')}>
                  <i className="fas fa-shield-alt w-5"></i>
                  <span className="ml-3">Protection Settings</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/accountability">
                <a className={isActive('/accountability')}>
                  <i className="fas fa-user-friends w-5"></i>
                  <span className="ml-3">Accountability</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/statistics">
                <a className={isActive('/statistics')}>
                  <i className="fas fa-chart-line w-5"></i>
                  <span className="ml-3">Statistics</span>
                </a>
              </Link>
            </li>
            <li>
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

      <div className="border-t border-slate-200 p-6 bg-slate-50/50">
        <DaysCleanTracker />
      </div>
    </aside>
  );
};

export default Sidebar;
