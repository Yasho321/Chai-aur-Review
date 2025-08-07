import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}