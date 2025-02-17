import { ReactNode, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoonIcon, SunIcon, HomeIcon, PlusCircleIcon, MenuIcon, UserIcon } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"
import { API_URL, VERSION_CODE, APP_VERSION } from '@/config'

interface LayoutProps {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    const { theme, setTheme } = useTheme()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsLoggedIn(!!token)
        if (token) {
            fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUsername(data.username)
                    localStorage.setItem('userId', data.id)
                })

                .catch(error => console.error('Error fetching user info:', error))
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        setUsername('')
        navigate('/')
    }

    const NavItems = () => (
        <>
            <Link to="/">
                <Button variant="ghost" className="w-full justify-start">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                </Button>
            </Link>
            {isLoggedIn && (
                <Link to="/create">
                    <Button variant="ghost" className="w-full justify-start">
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Create
                    </Button>
                </Link>
            )}
        </>
    )

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <MenuIcon className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[200px] sm:w-[240px]">
                                <nav className="flex flex-col space-y-4">
                                    <NavItems />
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Link to="/" className="text-2xl font-bold text-primary ml-2">Tressa</Link>
                    </div>
                    <nav className="hidden md:flex items-center space-x-4">
                        <NavItems />
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        >
                            {theme === "light" ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Avatar>
                                        <AvatarFallback>{username ? username[0].toUpperCase() : <UserIcon className="h-5 w-5" />}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {isLoggedIn ? (
                                    <>
                                        <DropdownMenuItem onSelect={() => navigate('/profile')}>Profile</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onSelect={() => navigate('/login')}>Login</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => navigate('/register')}>Register</DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="border-t">
                <div className="container mx-auto px-4 py-4 text-center text-muted-foreground">
                    Version {APP_VERSION}({VERSION_CODE}) - Tressa is now in very early stages of development.
                </div>
            </footer>
        </div>
    )
}
