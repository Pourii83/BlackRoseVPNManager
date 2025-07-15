import Cookies from 'js-cookie'

// نام cookie برای توکن
const TOKEN_COOKIE_NAME = 'auth_token'

// تنظیمات امنیتی cookie
const COOKIE_OPTIONS = {
  expires: 7, // 7 روز
  secure: true, // فقط HTTPS
  sameSite: 'strict' as const, // محافظت در برابر CSRF
  path: '/'
}

/**
 * ذخیره توکن در cookie
 */
export const setAuthToken = (token: string): void => {
  Cookies.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS)
}

/**
 * دریافت توکن از cookie
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_COOKIE_NAME)
}

/**
 * حذف توکن از cookie
 */
export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' })
}

/**
 * بررسی وجود توکن
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

/**
 * خروج کاربر
 */
export const logout = (): void => {
  removeAuthToken()
  window.location.href = '/login'
} 