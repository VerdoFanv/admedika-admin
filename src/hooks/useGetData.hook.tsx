import { DashboardContext } from "@contexts/DashboardContext.context"
import { fetcherGet } from "@utils/fetcher"
import { useContext, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import { setCookieForLogout } from "@utils/cookie"

export default function useGetData(path: string, refreshInterval?: boolean): {
	data: any,
	isLoading: boolean,
	isError: boolean
} {
	const { dispatch } = useContext(DashboardContext)
	const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}${path}`, fetcherGet, refreshInterval ? { refreshInterval: 1000 } : {})
	const isError = useRef(false)
	const router = useRouter()

	useEffect(() => {
		if (data && data.status === false) {
			if (data.status_code === 401) {
				localStorage.clear()
				setCookieForLogout(`isLogin`, false)
				router.reload()
			}
			isError.current = true
		}
	}, [ dispatch, data ])

	return {
		data: data,
		isLoading: !error && !data,
		isError: isError.current
	}
}