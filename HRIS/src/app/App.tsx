import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Employees } from "./components/Employees";
import { DocumentManagement } from "./components/DocumentManagement";
import { Rewards } from "./components/Rewards";
import { Marketplace } from "./components/Marketplace";
import { Projects } from "./components/Projects";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Trophy, 
  ShoppingBag,
  FolderKanban
} from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type View = "dashboard" | "employees" | "documents" | "rewards" | "marketplace" | "projects";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [userPoints, setUserPoints] = useState(450);

  const navigation = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "employees" as View, label: "Employees", icon: Users },
    { id: "projects" as View, label: "Projects", icon: FolderKanban },
    { id: "documents" as View, label: "Documents", icon: FileText },
    { id: "rewards" as View, label: "Rewards", icon: Trophy },
    { id: "marketplace" as View, label: "Marketplace", icon: ShoppingBag },
  ];

  const handlePointsUpdate = (points: number) => {
    setUserPoints(prev => prev + points);
  };

  const handlePurchase = (cost: number) => {
    if (userPoints >= cost) {
      setUserPoints(prev => prev - cost);
      return true;
    }
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">HRIS Portal</h1>
          <p className="text-sm text-gray-500 mt-1">HR Management System</p>
        </div>

        {/* Points Display */}
        <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 m-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Points</p>
              <p className="text-3xl font-bold">{userPoints}</p>
            </div>
            <Trophy className="w-8 h-8 opacity-80" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
              JD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentView === "dashboard" && (
          <Dashboard userPoints={userPoints} />
        )}
        {currentView === "employees" && <Employees />}
        {currentView === "projects" && <Projects />}
        {currentView === "documents" && (
          <DocumentManagement onPointsEarned={handlePointsUpdate} />
        )}
        {currentView === "rewards" && <Rewards userPoints={userPoints} />}
        {currentView === "marketplace" && (
          <Marketplace 
            userPoints={userPoints} 
            onPurchase={handlePurchase}
          />
        )}
      </main>

      <Toaster />
    </div>
  );
}