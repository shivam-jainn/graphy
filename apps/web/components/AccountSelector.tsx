import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { useSession, signOut } from "@/lib/auth/auth-client";
import { FiUser } from "react-icons/fi";

interface AccountSelectorProps {
    isOpen: boolean;
  }
  
 export default function AccountSelector({ isOpen }: AccountSelectorProps) {
    const session = useSession();
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="p-2 bg-muted/50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {session.data && session.data.user.image ? <img src={session.data?.user.image} className='rounded-full' />  : <FiUser className="w-4 h-4" />}
              </div>
              {session.data && isOpen && (
                <div className="flex-1">
                  <div className="text-sm font-medium">{session.data.user.name}</div>
                  <div className="text-xs text-muted-foreground">{session.data.user.email}</div>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
          <DropdownMenuItem>
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-white bg-destructive" onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }