import Dashboard from '@components/dashboard/Dashboard.component'
import { useEffect } from "react"
import { useRouter } from "next/router"

export default function NewsPublication() {
	const router = useRouter()
	useEffect(() => {
		router.push(`/news/post-category`)
	}, [])
	return <></>
}

NewsPublication.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}