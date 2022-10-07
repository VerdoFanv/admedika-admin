import { useRouter } from "next/router"
import { useEffect } from "react"
import Dashboard from "@components/dashboard/Dashboard.component"

export default function Career() {
	const router = useRouter()

	useEffect(() => {
		router.push(`/career/page`)
	}, [])
	return <></>
}

Career.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}