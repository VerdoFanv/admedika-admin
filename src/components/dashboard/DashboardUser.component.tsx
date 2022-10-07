import OutsideClick from '@components/util/OutsideClick.component'
import { DashboardContext } from '@contexts/DashboardContext.context'
import { getInitial } from '@utils/string'
import { slideupMotion } from '@variables/motion.variable'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from 'react'
import { deleteData } from '@utils/fetcher'
import { setCookieForLogout } from "@utils/cookie"

export default function DashboardUser() {
	const { state, dispatch } = useContext(DashboardContext)
	const [ isToggled, setIsToggled ] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (localStorage.getItem(`loginTime`) !== null) {
			setInterval(() => {
				const timeNow = new Date()
				const loginTime = new Date(localStorage.getItem(`loginTime`))
				if (loginTime < timeNow) {
					dispatch({ type: `set_isLoading`, payload: true })
					localStorage.clear()
					setCookieForLogout(`isLogin`, false)
					router.reload()
					dispatch({ type: `set_isLoading`, payload: false })
				}

				if (localStorage.getItem(`accessToken`) === null) {
					localStorage.clear()
					setCookieForLogout(`isLogin`, false)
					router.reload()
				}
			}, 3000)
		} else {
			localStorage.clear()
			setCookieForLogout(`isLogin`, false)
			router.reload()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	async function logOut() {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await deleteData(`/logout`)
			setCookieForLogout(`isLogin`, false)
			localStorage.clear()
			dispatch({ type: `set_auth`, payload: {
				uuid: ``,
				name: ``,
				email: ``,
				role: ``,
				roleAbility: {
					read: [],
					write: []
				}
			} })
			router.push(`/`)
		} catch (e) {
			console.log(e)
		}
		dispatch({ type: `set_isLoading`, payload: false })
	}

	return (
		<OutsideClick runFunction={() => setIsToggled(false)}>
			<div className="dashboard-user">
				<div onClick={() => setIsToggled(!isToggled)} className={`dashboard-user-avatar ${isToggled ? `is-toggled` : ``}`}>
					<p className="initial">{getInitial(state.auth.name)}</p>
					<p className="name">{state.auth.name}</p>
				</div>
				<AnimatePresence>
					{isToggled &&
					<motion.div className="dashboard-user-menu" variants={slideupMotion} initial="hidden" animate="visible" exit="hidden">
						<div className="dashboard-user-info">
							<p className="initial">{getInitial(state.auth.name)}</p>
							<div className="account">
								<p className="name">{state.auth.name}</p>
								<p className="email">{state.auth.email}</p>
							</div>
						</div>
						<div className="dashboard-user-nav">
							<ul className="items">
								<li className="item">
									<Link href={`/settings/users/${state.auth.uuid}`}>
										<a className="link">Your Account</a>
									</Link>
								</li>
								<li className="item">
									<button id="btnLogout" onClick={() => logOut()} className="link">Sign out</button>
								</li>
							</ul>
						</div>
					</motion.div>
					}
				</AnimatePresence>
			</div>
		</OutsideClick>
	)
}
