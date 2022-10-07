import useGetData from '@hooks/useGetData.hook'
import DashboardUser from '@components/dashboard/DashboardUser.component'
import EiNotification from "@components/ei/EiNotification.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from '@contexts/DashboardContext.context'
import {
	dashboardPagesNavForAdmedika,
	dashboardPagesNavForMyAdmedika,
	dashboardPagesNavForMyMerchant,
	dashboardPagesNavGeneral,
	dashboardSettingsNav,
	PagesNav
} from '@variables/dashboardNav.variable'
import { ReactElement, useContext, useEffect } from 'react'
import DashboardNavItem from './DashboardNavItem.component'

interface Props {
	children: ReactElement
	isLoading?: boolean
}

export default function Dashboard({ children, isLoading }: Props) {
	const { state, dispatch } = useContext(DashboardContext)
	const { data: settingData } = useGetData(`/setting-general`)
	const { data: userData } = useGetData(`/current-user`)

	useEffect(() => {
		const getCurrentUser = async () => {
			const userAuth = {
				uuid: userData?.data?.user_id,
				name: userData?.data?.user_fullname,
				email: userData?.data?.user_email,
				role: userData?.data?.roleNames,
				roleAbility: userData?.data?.roleAbilities[0].role_ability
			}
			dispatch({ type: `set_auth`, payload: userAuth })
		}

		getCurrentUser()
	}, [ dispatch, userData ])

	return (
		<div className="dashboard">
			<EiNotification isShown={state.notification.isShown} close={() => dispatch({ type: `close_notification` })} text={state.notification.text} footnote={state.notification.footnote} type={state.notification.type} align={state.notification.align} autoClose={state.notification.autoClose} />
			<header className="dashboard-header">
				<div className="dashboard-header-inner">
					<section className="section section-brand">
						<div className="dashboard-brand">
							<div className="dashboard-brand-logo">
								<div className="logo">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									{!state.isLoading && (
										<img src={settingData?.data?.image?.header_logo_white} alt="Brand Logo" width="267" height="76" />
									)}
								</div>
							</div>
						</div>
					</section>
					{state.auth?.roleAbility?.read?.filter((role) => !role.includes(`myadmedika`) && !role.includes(`mymerchant`) && !role.includes(`general`)).length > 0 && (
						<section className="section section-primary">
							<div className="dashboard-nav">
								{!state.isLoading && (
									<p className="dashboard-nav-label">admedika</p>
								)}
								<ul className="dashboard-nav-items">
									{(dashboardPagesNavForAdmedika as PagesNav[]).map(nav =>
										<Access
											key={nav.key}
											auth={`read:${nav.key}`}
											yes={
												<DashboardNavItem href={nav.href} redirectHref={nav.redirectHref} label={nav.label} icon={nav.icon} subnav={nav.subnav} hasNew={nav.hasNew} />
											}
										/>
									)}
								</ul>
							</div>
						</section>
					)}
					{state.auth?.roleAbility?.read?.filter((role) => role.includes(`myadmedika`)).length > 0 && (
						<section className="section section-primary">
							<div className="dashboard-nav">
								{!state.isLoading && (
									<p className="dashboard-nav-label">myadmedika</p>
								)}
								<ul className="dashboard-nav-items">
									{(dashboardPagesNavForMyAdmedika as PagesNav[]).map(nav =>
										<Access
											key={nav.key}
											auth={`read:${nav.key}`}
											yes={
												<DashboardNavItem href={nav.href} redirectHref={nav.redirectHref} label={nav.label} icon={nav.icon} subnav={nav.subnav} hasNew={nav.hasNew} />
											}
										/>
									)}
								</ul>
							</div>
						</section>
					)}
					{state.auth?.roleAbility?.read?.filter((role) => role.includes(`mymerchant`)).length > 0 && (
						<section className="section section-primary">
							<div className="dashboard-nav">
								{!state.isLoading && (
									<p className="dashboard-nav-label">mymerchant</p>
								)}
								<ul className="dashboard-nav-items">
									{(dashboardPagesNavForMyMerchant as PagesNav[]).map(nav =>
										<Access
											key={nav.key}
											auth={`read:${nav.key}`}
											yes={
												<DashboardNavItem href={nav.href} redirectHref={nav.redirectHref} label={nav.label} icon={nav.icon} subnav={nav.subnav} hasNew={nav.hasNew} />
											}
										/>
									)}
								</ul>
							</div>
						</section>
					)}
					<section className="section section-primary">
						<div className="dashboard-nav">
							<ul className="dashboard-nav-items">
								{(dashboardPagesNavGeneral as PagesNav[]).map(nav =>
									<Access
										key={nav.key}
										auth={`read:${nav.key}`}
										yes={
											<DashboardNavItem href={nav.href} redirectHref={nav.redirectHref} label={nav.label} icon={nav.icon} subnav={nav.subnav} hasNew={nav.hasNew} />
										}
									/>
								)}
							</ul>
						</div>
					</section>
					<section className="section section-primary">
						<div className="dashboard-nav dashboard-nav-settings">
							{!state.isLoading && (
								<p className="dashboard-nav-label">Settings</p>
							)}
							<ul className="dashboard-nav-items">
								{(dashboardSettingsNav as PagesNav[]).map(nav =>
									<Access
										key={nav.key}
										auth={`read:${nav.key}`}
										yes={
											<DashboardNavItem href={nav.href} label={nav.label} hasNew={nav.hasNew} />
										}
									/>
								)}
							</ul>
						</div>
					</section>
					<section className="section section-end">
						<DashboardUser />
					</section>
				</div>
			</header>
			<main className={`dashboard-main ${state.isLoading ? `is-loading` : ``}`}>
				<div className={`dashboard-main-inner ${isLoading ? `is-loading` : ``}`}>
					{children}
				</div>
			</main>
		</div>
	)
}