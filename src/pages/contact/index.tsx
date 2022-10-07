import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Dashboard from "@components/dashboard/Dashboard.component"

export default function Contact() {
	const router = useRouter()

	useEffect(() => {
		router.push(`/contact/page`)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <></>
}

Contact.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}