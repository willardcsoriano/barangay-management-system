// C:\Users\Willard\barangay-management-system\middleware.ts

import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (your universal login pages)
     * - superadmin-login (your new super admin login portal)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|auth|superadmin|superadmin-login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};