"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, KeyRound, BarChart3, Settings, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  submenu?: { title: string; href: string }[]
}

export function DashboardSidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  // Mock user role - in a real app, this would come from authentication
  const userRole = "admin"

  // Define navigation items with role-based access
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Visitor Management",
      href: "/dashboard/visitor-management",
      icon: Users,
      submenu: [
        { title: "Users", href: "/dashboard/visitor-management/users" },
        { title: "Visitors", href: "/dashboard/visitor-management/visitors" },
        { title: "Appointments", href: "/dashboard/visitor-management/appointments" },
        { title: "Visitor Logs", href: "/dashboard/visitor-management/logs" },
      ],
    },
    {
      title: "Access Control",
      href: "/dashboard/access-control",
      icon: KeyRound,
      submenu: [
        { title: "User Management", href: "/dashboard/access-control/users" },
        { title: "Access Logs", href: "/dashboard/access-control/logs" },
        { title: "Facial Recognition", href: "/dashboard/access-control/facial-recognition" },
      ],
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  // Filter items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (userRole === "admin") return true
    // Add logic for other roles
    return true
  })

  // Toggle submenu expansion
  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Check if a nav item or its children are active
  const isActive = (item: NavItem) => {
    if (pathname === item.href) return true
    if (item.submenu) {
      return item.submenu.some((subItem) => pathname === subItem.href)
    }
    return false
  }

  // Expand items that contain the current path - ONLY on initial render or path change
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {}
    filteredNavItems.forEach((item) => {
      if (item.submenu && item.submenu.some((subItem) => pathname === subItem.href)) {
        newExpandedItems[item.title] = true
      }
    })

    // Only update if there are items to expand
    if (Object.keys(newExpandedItems).length > 0) {
      setExpandedItems((prev) => {
        // Check if we actually need to update
        let needsUpdate = false
        for (const key in newExpandedItems) {
          if (prev[key] !== newExpandedItems[key]) {
            needsUpdate = true
            break
          }
        }

        if (!needsUpdate) return prev
        return { ...prev, ...newExpandedItems }
      })
    }
  }, [pathname, filteredNavItems])

  const sidebarContent = (
    <>
      <div className="flex h-12 items-center border-b px-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-base text-primary"
          onClick={() => isMobile && onOpenChange(false)}
        >
          <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            N
          </span>
          <span>Nexora</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="ml-auto h-7 w-7">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="space-y-0.5">
          {filteredNavItems.map((item) => (
            <div key={item.title} className="space-y-0.5">
              {item.submenu ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-8 text-xs px-2 rounded-md",
                      isActive(item) && "bg-accent font-medium text-accent-foreground",
                    )}
                    onClick={() => toggleExpand(item.title)}
                  >
                    <item.icon className="mr-2 h-3.5 w-3.5" />
                    <span>{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "ml-auto h-3.5 w-3.5 transition-transform",
                        expandedItems[item.title] ? "rotate-180" : "",
                      )}
                    />
                  </Button>
                  {expandedItems[item.title] && (
                    <div className="ml-4 space-y-0.5 pt-0.5">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant="ghost"
                          asChild
                          className={cn(
                            "w-full justify-start h-7 text-xs px-2 rounded-md",
                            pathname === subItem.href && "bg-accent font-medium text-accent-foreground",
                          )}
                        >
                          <Link href={subItem.href} onClick={() => isMobile && onOpenChange(false)}>
                            {subItem.title}
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start h-8 text-xs px-2 rounded-md",
                    pathname === item.href && "bg-accent font-medium text-accent-foreground",
                  )}
                >
                  <Link href={item.href} onClick={() => isMobile && onOpenChange(false)}>
                    <item.icon className="mr-2 h-3.5 w-3.5" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary text-xs">
            <span className="font-medium">JD</span>
          </div>
          <div>
            <p className="text-xs font-medium">John Doe</p>
            <p className="text-[10px] text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </>
  )

  // Use Sheet for mobile and div for desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-[240px] sm:max-w-[260px] border-r">
          <div className="flex h-full flex-col">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return <div className="flex h-full flex-col w-full">{sidebarContent}</div>
}

