import React from "react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { Monitor, Server, Activity, LayoutDashboard, Settings, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link to={createPageUrl("MonitoringDashboard")} className="flex items-center gap-2">
            <Monitor className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">MonitorHub</h1>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            to={createPageUrl("MonitoringDashboard")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
              currentPageName === "MonitoringDashboard" 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <div className="text-xs font-medium text-gray-500 uppercase px-4 pt-4 pb-2">
            Monitor Types
          </div>
          <Link 
            to={createPageUrl("MonitoringDashboard")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Server className="w-5 h-5" />
            Services
          </Link>
          <Link 
            to={createPageUrl("MonitoringDashboard")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Activity className="w-5 h-5" />
            APIs
          </Link>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("MonitoringDashboard")} className="md:hidden flex items-center gap-2">
              <Monitor className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold">MonitorHub</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
