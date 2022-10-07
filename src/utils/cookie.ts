export const setCookieForLogin = (key: string, value: any, expiredTime: number) => {
	const now = new Date()
	const expiresIn = now.setSeconds(now.getSeconds() + (expiredTime))
	const expires = new Date(expiresIn).toUTCString()
	document.cookie = `${key}=${value}; expires=${expires};`
}

export const setCookieForLogout = (key: string, value: any) => {
	const expires = new Date(0).toUTCString()
	document.cookie = `${key}=${value}; expires=${expires};`
}

export const setCookieForResetPassword = (value: any) => {
	const now = new Date()
	const expiresIn = now.setSeconds(now.getSeconds() + 60 * 60 * 1)
	const expires = new Date(expiresIn).toUTCString()
	document.cookie = `isAllowedToResetPassword=${value}; expires=${expires};`
}

export const deleteCookieForResetPassword = (value: any) => {
	const expires = new Date(0).toUTCString()
	document.cookie = `isAllowedToResetPassword=${value}; expires=${expires};`
}

export const findCookieName = (name: string) => {
	const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
	if (match) {
		return match[2]
	}
}