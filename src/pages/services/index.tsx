import Dashboard from "@components/dashboard/Dashboard.component"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Services() {
	const router = useRouter()
	useEffect(() => {
		router.push(`/services/page`)
	}, [])
	return <></>
}

Services.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}