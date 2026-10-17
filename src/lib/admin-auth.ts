import { cookies } from 'next/headers'

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  const adminId = cookieStore.get('admin_id')
  return !!(token && adminId)
}

export async function getAdminId(): Promise<string | null> {
  const cookieStore = await cookies()
  const adminId = cookieStore.get('admin_id')
  return adminId?.value || null
}
