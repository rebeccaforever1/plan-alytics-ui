// src/app/dashboard/layout.tsx
"use client"
import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Settings,
  LogOut,
  User,
  Building,
  ChevronsUpDown,
  Bell,
  Search,
  HelpCircle,
  Users,
  Shield,
  CreditCard,
  Database,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  Wallet,
  Activity,
  UserCheck,
  AlertTriangle,
  Calendar,
  Zap,
  Command,
  Download,
  Plus,
  ChevronDown,
  CheckCircle,
  Clock,
  Star,
  Bookmark,
   DollarSign,
   Server
} from 'lucide-react'

// Enhanced navigation with icons and categories
const analyticsItems = [
  { 
    label: 'Subscriptions', 
    href: '/dashboard', 
    icon: Wallet,
    description: 'Subscription management',
    roles: ['Admin', 'User', 'Viewer']
  },
  { 
    label: 'Revenue', 
    href: '/dashboard/revenue', 
    icon: DollarSign,
    description: 'Revenue analytics',
    roles: ['Admin', 'User', 'Viewer']
  },
  { 
    label: 'Retention', 
    href: '/dashboard/retention', 
    icon: UserCheck,
    description: 'Retention intervention',
    roles: ['Admin', 'User', 'Viewer']
  },
  { 
    label: 'CRM', 
    href: '/dashboard/crm', 
    icon: Users,
    description: 'Customer relationship management',
    roles: ['Admin', 'User']
  },
  { 
    label: 'Product Usage', 
    href: '/dashboard/usage', 
    icon: Activity,
    description: 'Product engagement metrics',
    roles: ['Admin', 'User', 'Viewer']
  },
  { 
    label: 'CLV', 
    href: '/dashboard/clv', 
    icon: TrendingUp,
    description: 'Customer lifetime value analysis',
    roles: ['Admin', 'User']
  }
]

const dataAdminItems = [
  { 
    label: 'Alerts', 
    href: '/dashboard/alerts', 
    icon: AlertTriangle,
    description: 'System notifications'
  },
  { 
    label: 'Data Sources', 
    href: '/dashboard/connections', 
    icon: Database,
    description: 'Data connections'
  },
]

// Mock data - replace with actual user/org context
const mockUser = {
  name: 'Rebecca Smith',
  email: 'rebecca@example.com',
  avatar: null,
  role: 'Admin',
  plan: 'Enterprise',
  lastLogin: '2 hours ago'
}

const mockOrganizations = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    plan: 'Enterprise', 
    isActive: true,
    members: 24,
    dataHealth: 'excellent'
  },
  { 
    id: '2', 
    name: 'TechStart Inc', 
    plan: 'Professional', 
    isActive: false,
    members: 8,
    dataHealth: 'good'
  },
  { 
    id: '3', 
    name: 'Global Dynamics', 
    plan: 'Enterprise', 
    isActive: false,
    members: 156,
    dataHealth: 'excellent'
  },
]

const mockNotifications = [
  { 
    id: '1', 
    message: 'Data sync completed for Q4 results', 
    time: '2m ago', 
    unread: true,
    type: 'success',
    action: 'View Report'
  },
  { 
    id: '2', 
    message: 'New CLV model training finished', 
    time: '1h ago', 
    unread: true,
    type: 'info',
    action: 'Review Model'
  },
  { 
    id: '3', 
    message: 'Weekly report ready for review', 
    time: '3h ago', 
    unread: false,
    type: 'info',
    action: 'Download'
  },
  { 
    id: '4', 
    message: 'Data quality alert: Missing customer data', 
    time: '5h ago', 
    unread: true,
    type: 'warning',
    action: 'Fix Issues'
  },
]

const recentItems = [
  { name: 'Q4 Revenue Analysis', type: 'report', href: '/dashboard/revenue' },
  { name: 'CLV Forecast Model', type: 'model', href: '/dashboard/clv' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [selectedOrg, setSelectedOrg] = useState(mockOrganizations[0])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notifications] = useState(mockNotifications)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const unreadCount = notifications.filter(n => n.unread).length

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleOrgChange = (orgId: string) => {
    const org = mockOrganizations.find(o => o.id === orgId)
    if (org) {
      setSelectedOrg(org)
      console.log('Switching to organization:', org.name)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Clock className="h-4 w-4 text-blue-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const SidebarContent = () => (
    <>
      {/* Logo - Always visible */}
      <div className="flex items-center justify-center mb-6 px-2">
        <Image
          src="/sticksy_logo.png"
          alt="Sticksy"
          width={225}
          height={60}
          className={cn(
            "h-auto object-contain transition-all duration-200",
            sidebarCollapsed ? "w-10 max-w-[40px]" : "w-full max-w-[200px]"
          )}
          priority
        />
      </div>

      {!sidebarCollapsed && (
        <>
          {/* Organization Selector */}
          <div className="mb-6">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              Organization
            </label>
            <Select value={selectedOrg.id} onValueChange={handleOrgChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    selectedOrg.dataHealth === 'excellent' ? 'bg-green-500' :
                    selectedOrg.dataHealth === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                  )} />
                  <Building className="h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium truncate">{selectedOrg.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedOrg.plan} • {selectedOrg.members} members
                    </div>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent>
                {mockOrganizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        org.dataHealth === 'excellent' ? 'bg-green-500' :
                        org.dataHealth === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                      )} />
                      <Building className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{org.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {org.plan} • {org.members} members
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Favorites/Bookmarks */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Favorites
              </span>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {recentItems.slice(0, 3).map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
                >
                  <Bookmark className="h-3 w-3" />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mb-6 flex-1">
        <div className="flex items-center justify-between mb-2">
          {!sidebarCollapsed && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Analytics
            </span>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 lg:flex hidden"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    sidebarCollapsed ? "rotate-90" : "rotate-0"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Analytics Items - Dropdown when collapsed */}
        {sidebarCollapsed ? (
          // Collapsed: Show dropdown menu
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-center h-10 mb-2"
              >
                <BarChart3 className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Analytics Pages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {analyticsItems.map((item) => {
                const isActive = item.href === '/dashboard' 
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(item.href + '/')
                const Icon = item.icon
                
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 py-2",
                        isActive && "bg-accent"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Expanded: Show full navigation
          <>
            {analyticsItems.map((item) => {
              const isActive = item.href === '/dashboard' 
                ? pathname === '/dashboard'
                : pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              
              return (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'text-sm rounded-lg px-3 py-2.5 transition-all duration-200 flex items-center group relative',
                          'hover:scale-[1.02] active:scale-[0.98]',
                          isActive
                            ? 'bg-primary/10 text-primary font-medium shadow-sm border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                        )}
                      </Link>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </>
        )}

        {/* Data Admin Section */}
        {!sidebarCollapsed && (
          <div className="mt-4 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Data Admin
            </span>
          </div>
        )}
        
        {dataAdminItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          
          return (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-sm rounded-lg px-3 py-2.5 transition-all duration-200 flex items-center group relative',
                      'hover:scale-[1.02] active:scale-[0.98]',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium shadow-sm border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      sidebarCollapsed ? "mr-0" : "mr-3"
                    )} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full" />
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </nav>

      {!sidebarCollapsed && (
        <>
          {/* Quick Actions */}
          <div className="mb-6">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Quick Actions
            </div>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start group">
                <Database className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
                Sync Data
                <Zap className="h-3 w-3 ml-auto opacity-50" />
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start group">
                <Users className="h-4 w-4 mr-2 group-hover:text-green-500 transition-colors" />
                Invite Team
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start group">
                <Download className="h-4 w-4 mr-2 group-hover:text-purple-500 transition-colors" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Plan Information */}
          <div className="mt-auto">
            <div className="p-3 bg-muted/50 rounded-lg mb-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{selectedOrg.plan} Plan</span>
                <Badge variant="secondary" className="text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                  Active
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-3 space-y-1">
                <div>Data retention: 24 months</div>
                <div>Usage: 2.3TB / 5TB</div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: '46%' }} />
              </div>
              <Button variant="outline" size="sm" className="w-full group">
                <CreditCard className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
                Manage Plan
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <div className="text-xs text-muted-foreground">
                v2.1.0
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-background">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-r transition-all duration-300 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-sm",
          "px-4 py-6 space-y-6 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-16" : "w-64"
        )}>
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden absolute top-4 right-4 z-10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <SidebarContent />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <header className="sticky top-0 z-30 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                {/* Enhanced Search */}
                <div className="relative">
                  <div className="hidden md:flex items-center gap-2 bg-muted/50 hover:bg-muted/80 transition-colors rounded-lg px-3 py-2 min-w-[320px] border">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search dashboards, metrics, or data..."
                      className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchOpen(true)}
                    />
                    <div className="flex items-center gap-1">
                      <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                        <Command className="h-3 w-3" />
                      </kbd>
                      <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">K</kbd>
                    </div>
                  </div>
                  
                  {/* Mobile Search Button */}
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Help */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Help & Documentation
                  </TooltipContent>
                </Tooltip>

                {/* Enhanced Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-96">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      Notifications
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        Mark all read
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="p-4 cursor-pointer">
                          <div className="flex items-start gap-3 w-full">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 space-y-1">
                              <p className={cn(
                                "text-sm leading-tight",
                                notification.unread ? "font-medium" : "text-muted-foreground"
                              )}>
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">{notification.time}</p>
                                {notification.action && (
                                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                                    {notification.action}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Enhanced User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted/50">
                      <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarImage src={mockUser.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {mockUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium">{mockUser.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {mockUser.role}
                        </div>
                      </div>
                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                          <span>{mockUser.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {mockUser.role}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground font-normal">
                          {mockUser.email}
                        </span>
                        <span className="text-xs text-muted-foreground font-normal">
                          Last login: {mockUser.lastLogin}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Preferences
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Security & Privacy
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Favorites
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Building className="mr-2 h-4 w-4" />
                        Organization Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        Team Management
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing & Usage
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-background to-muted/20">
            <div className="max-w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
