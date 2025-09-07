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
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { useNavigate } from "react-router-dom";

const getRoleName = (role: UserRole) => {
  const roleMap = {
    admin: "Administrator",
    sales: "Sales Agent",
    technical_manager: "Technical Manager",
    technician: "Technician",
    finance: "Finance Officer"
  };
  
  return roleMap[role] || role;
};

export function UserNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <span className="mt-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">
              {getRoleName(user.role)}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => navigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate("/dashboard/settings")}>
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onSelect={() => {
            logout();
            navigate("/login");
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}