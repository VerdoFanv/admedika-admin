import { useRouter } from "next/router"

export default function useCurrentPath() {
	const { asPath } = useRouter()

	const asPathWithoutQuery = asPath.split(`?`)[0]
	const asPathNestedRoutes = asPathWithoutQuery.split(`/`).filter(v => v.length > 0)

	const breadcrumb = asPathNestedRoutes.map((_path, i) => {
		let crumb = ``
		for (let j = 0; j <= i; j++) {
			crumb = crumb + `/` + asPathNestedRoutes[j]
		}

		return crumb
	})

	return { currentPath: asPath, breadcrumb }
}