
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

export function UserNav({ role = "user" }: { role?: "user" | "recruiter" | "admin" }) {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(
    role === "user" ? "User Name" : role === "recruiter" ? "Company Name" : "Admin User"
  );
  const [displayEmail, setDisplayEmail] = useState(
    role === "user" ? "user@example.com" : role === "recruiter" ? "company@example.com" : "admin@example.com"
  );

  useEffect(() => {
    // Get stored user information from localStorage
    const storedEmail = localStorage.getItem("userEmail");
    
    if (role === "user") {
      const storedName = localStorage.getItem("userName");
      if (storedName) setDisplayName(storedName);
    } else if (role === "recruiter") {
      const storedName = localStorage.getItem("companyName");
      if (storedName) setDisplayName(storedName);
    } else if (role === "admin") {
      const storedName = localStorage.getItem("adminName");
      if (storedName) setDisplayName(storedName);
    }
    
    if (storedEmail) {
      setDisplayEmail(storedEmail);
    }
  }, [role]);

  // Generate initials from name
  const getInitials = () => {
    if (displayName && displayName !== "User Name" && displayName !== "Company Name" && displayName !== "Admin User") {
      const parts = displayName.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    }
    return role === "user" ? "JS" : role === "recruiter" ? "RC" : "AD";
  };

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem("userName");
    localStorage.removeItem("companyName");
    localStorage.removeItem("adminName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const goToProfile = () => {
    navigate(`/${role}-dashboard/profile`);
  };

  const goToSettings = () => {
    navigate(`/${role}-dashboard/settings`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-purple-100 p-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white shadow-md border border-purple-100" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {displayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={goToProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={goToSettings} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
