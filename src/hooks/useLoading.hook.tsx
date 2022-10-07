import { DashboardContext } from "@contexts/DashboardContext.context"
import { useContext, useEffect } from "react"

export default function useLoading(isLoading: boolean) {
	const { dispatch } = useContext(DashboardContext)

	useEffect(() => {
		if (isLoading) {
			dispatch({ type: `set_isLoading`, payload: true })
		} else {
			dispatch({ type: `set_isLoading`, payload: false })
		}
	}, [ dispatch, isLoading ])

	return isLoading
}