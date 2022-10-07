import { DashboardContext } from "@contexts/DashboardContext.context"
import { ReactElement, useContext } from "react"

interface Props {
	auth: string
	except?: boolean
	yes?: ReactElement
	no?: ReactElement
}

export default function Access({ auth, except, yes, no }: Props) {
	const { state } = useContext(DashboardContext)

	function authCheck(auth: string) {
		if (except) return true

		const [ ability, key ] = auth.split(`:`)

		if (!state?.auth?.roleAbility?.[ability]) return false

		if (state.auth.roleAbility[ability].includes(key)) {
			return true
		}

		return false
	}

	return (
		<>
			{authCheck(auth) ?
				yes
				:
				no
			}
		</>
	)
}