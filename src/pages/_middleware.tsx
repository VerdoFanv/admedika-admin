import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()
	const isLogin = JSON.parse(req.cookies[`isLogin`] ?? `false`)

	if (url.pathname === `/` && isLogin) {
		return NextResponse.redirect(`${url.origin}/home-admedika`)
	}

	if (url.pathname !== `/` && !isLogin) {
		if (url.pathname === `/forgot-password`) return
		if (url.pathname === `/reset-password`) {
			const email = url.searchParams.get(`email`)
			const key = url.searchParams.get(`key`)
			const token = url.searchParams.get(`token`)
			if (email && key && token) return
		}

		return NextResponse.redirect(url.origin)
	}
}
