import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { logout, getUserData } from "../../lib/auth"

export function Header() {
  const navigate = useNavigate();
  
  // Obter dados do usuário de forma segura
  let userData = null;
  try {
    userData = getUserData();
  } catch (error) {
    console.error('Erro ao obter dados do usuário no Header:', error);
    userData = null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:bg-gray-700">
                Aulas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[200px] p-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/aulas/listar"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        "text-white hover:bg-gray-700"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">Listar Aulas</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Visualize todas as aulas disponíveis
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/aulas/criar"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        "text-white hover:bg-gray-700"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">Criar Aula</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Crie uma nova aula
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white hover:bg-gray-700">
                Turmas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[200px] p-2">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/turma/listar"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        "text-white hover:bg-gray-700"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">Listar Turmas</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Visualize todas as turmas
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/turma/criar"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        "text-white hover:bg-gray-700"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">Criar Turma</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Crie uma nova turma
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/duvidas"
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white disabled:pointer-events-none disabled:opacity-50"
                  )}
                >
                  Dúvidas
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-4">
          {userData && userData.name && (
            <div className="text-white text-sm">
              <span className="text-gray-300">Olá, </span>
              <span className="font-medium">{userData.name}</span>
              {userData.role && <span className="text-gray-400 ml-1">({userData.role})</span>}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-white border-white hover:bg-white hover:text-gray-800"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
} 