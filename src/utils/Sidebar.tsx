// "use client"
// import {
//   Home,
//   User2,
//   ChevronUp,
//   UserPlus,
//   ContactRound,
//   Users2,
// } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import Image from "next/image"
// import Link from "next/link"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { usePathname, useRouter } from "next/navigation"
// import Logo from "@/components/common/Logo"

// export function AppSidebar() {
//   const pathname = usePathname()
//   const resource = pathname.split("/")[1]

//   const isActive = (url: string) => {
//     return pathname === url || pathname.startsWith(url + "/")
//   }

//   // Menu items
//   const items = [
//     { title: "Dashboard", url: "/", icon: Home },
//     { title: "Guide Requests", url: "/guide-requests", icon: UserPlus },
//     { title: "Guides", url: "/guides", icon: ContactRound },
//     { title: "Users", url: "/users", icon: Users2 },
//   ]

//   return (
//     <>
//       <Sidebar>
//         <SidebarHeader className="mt-6 mb-6">
//           {/* <Image src="/going.png" alt="Logo" width={140} height={140} /> */}
//           <Logo />
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarGroup>
//             <SidebarGroupLabel className="text-2xl mt-4 text-primary font-semibold">
//               Application
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {items.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenuButton asChild>
//                       <Link
//                         className={`mt-2 mb-2 hover:bg-secondary ${
//                           isActive(item.url) ? "bg-primary text-white " : ""
//                         }`}
//                         href={item.url}
//                       >
//                         <item.icon className="w-6 h-6" />
//                         <span className="text-2xl ml-2">{item.title}</span>
//                       </Link>
//                     </SidebarMenuButton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//         <SidebarFooter>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <SidebarMenuButton className="text-2xl font-semibold h-16 mb-10">
//                     <User2 /> Admin
//                     <ChevronUp className="ml-auto" />
//                   </SidebarMenuButton>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent
//                   side="top"
//                   className="w-[--radix-popper-anchor-width]"
//                 >
//                   <Link href="/my-account">
//                     <DropdownMenuItem className="text-xl">
//                       My Account
//                     </DropdownMenuItem>
//                   </Link>
//                   <DropdownMenuItem>
//                     <span className="text-xl text-red-800">Sign out</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarFooter>
//       </Sidebar>
//     </>
//   )
// }

"use client"
import {
  Home,
  User2,
  ChevronUp,
  UserPlus,
  ContactRound,
  Users2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import Logo from "@/components/common/Logo"
import { signOut, useSession } from "next-auth/react"

export function AppSidebar() {
  const pathname = usePathname()
  const resource = pathname.split("/")[1]

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/")
  }

  const { data: session } = useSession()

  // Menu items
  const items = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Guide Requests", url: "/guide-requests", icon: UserPlus },
    { title: "Guides", url: "/guides", icon: ContactRound },
    { title: "Users", url: "/users", icon: Users2 },
  ]

  const handleLogout = () => {
    const alertUser = confirm("Are you sure you want to sign out?")
    if (!alertUser) return
    signOut()
  }

  return (
    <>
      <Sidebar className="bg-white shadow-md">
        <SidebarHeader className="mt-6 mb-6">
          {/* <Image src="/going.png" alt="Logo" width={140} height={140} /> */}
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-base mt-4 text-gray-800 font-semibold">
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        className={`mt-2 mb-2 hover:bg-gray-100 transition-colors ${
                          isActive(item.url)
                            ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                            : "text-gray-600"
                        }`}
                        href={item.url}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-lg ml-2">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="text-lg text-gray-600 font-semibold h-16  hover:bg-gray-100">
                    <User2 className="w-5 h-5" />{" "}
                    {session?.user?.name || "Admin"}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <Link href="/my-account">
                    <DropdownMenuItem className="text-lg">
                      My Account
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleLogout}>
                    <span className="text-lg text-red-600">Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
