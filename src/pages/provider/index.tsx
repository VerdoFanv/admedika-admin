import Dashboard from '@components/dashboard/Dashboard.component'
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Provider() {
	const router = useRouter()
	useEffect(() => {
		router.push(`/provider/industry`)
	}, [])
	return <></>
}

Provider.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}