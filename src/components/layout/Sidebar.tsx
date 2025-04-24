
import { Link, useLocation } from "react-router-dom";
import { 
  FileText,
  BarChart3, 
  Users, 
  PenTool, 
  Settings,
  Megaphone,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: BarChart3, text: "Dashboard", path: "/" },
    { icon: Users, text: "Bot Management", path: "/bots" },
    { icon: Megaphone, text: "Campaigns", path: "/campaigns" },
    { icon: FileText, text: "Prompt Management", path: "/prompts", isNew: true },
    { icon: Bell, text: "Notifications", path: "/notifications" },
    { icon: Settings, text: "Settings", path: "/settings" }
  ];

  return (
    <div className="hidden md:flex flex-col bg-background border-r w-64 h-screen px-4 py-6">
      <div className="flex items-center mb-8 pl-2">
        <PenTool size={28} className="text-purple-600 mr-2" />
        <h1 className="text-xl font-bold">Narrative AI</h1>
      </div>
      
      <div className="space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-purple-100 text-purple-700 font-medium" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon size={18} />
              <span>{item.text}</span>
              {item.isNew && (
                <Badge className="ml-auto text-xs px-1.5 py-0.5 bg-green-500 text-white">
                  New
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
