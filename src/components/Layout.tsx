import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, LogOut, Tag, Upload, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center transition-smooth group-hover:scale-105">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PhotoVault
              </span>
            </Link>

            {user && (
              <nav className="flex items-center gap-2">
                <Button
                  variant={isActive('/') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Gallery
                  </Link>
                </Button>
                <Button
                  variant={isActive('/upload') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Link>
                </Button>
                <Button
                  variant={isActive('/hashtags') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/hashtags">
                    <Tag className="h-4 w-4 mr-2" />
                    Hashtags
                  </Link>
                </Button>
                <div className="ml-4 flex items-center gap-3 pl-4 border-l">
                  <span className="text-sm text-muted-foreground">
                    {user.username}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
