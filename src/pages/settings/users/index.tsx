import AdminHeader from '@components/admin/AdminHeader.component'
import Dashboard from '@components/dashboard/Dashboard.component'
import Access from "@components/util/Access.component"
import OutsideClick from '@components/util/OutsideClick.component'
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { slidedownMotion } from '@variables/motion.variable'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import IconSettings from 'public/assets/icons/icon-setting.svg'
import { useState } from 'react'

export default function SettingUsers() {
	const [ isToggled, setIsToggled ] = useState(false)
	const { data: user, isLoading } = useGetData(`/user?page=1`)

	useLoading(isLoading)

	if (!user?.data) return <></>

	return (
		<div className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Users"
					legend="Settings"
					action={
						<Access
							auth="write:settings-users"
							yes={
								<ul className="actions">
									<li className="action">
										<OutsideClick runFunction={() => setIsToggled(false)}>
											<button type="button" onClick={() => setIsToggled(!isToggled)} className="button button-small button-gray button-icon">
												<i className="icon" role="img"><IconSettings className="svg" /></i>
											</button>
											<AnimatePresence>
												{isToggled &&
											<motion.div className="admin-header-submenu" variants={slidedownMotion} initial="hidden" animate="visible" exit="hidden">
												<ul className="items">
													<li className="item">
														<Link href="/settings/users/roles">
															<a className="link">Manage user roles</a>
														</Link>
													</li>
												</ul>
											</motion.div>
												}
											</AnimatePresence>
										</OutsideClick>
									</li>
									<li className="action">
										<Link href="/settings/users/new" passHref>
											<a className="button button-small">New User</a>
										</Link>
									</li>
								</ul>
							}
						/>
					}
				/>
			</header>
			<div className="admin-page-content">
				<section className="section">
					<div className="admin-data">
						<div className="admin-data-table">
							<table className="table table-vcenter">
								<thead>
									<tr>
										<th>{user?.data.length} Users</th>
										<th>Role</th>
									</tr>
								</thead>
								<tbody>
									{user?.data.map((user) =>
										<Link key={user.user_id} href={`/settings/users/${user.user_id}`} passHref>
											<tr className="linkable">
												<td>
													<p className="strong">{user.user_fullname}</p>
													<p className="small">{user.user_email}</p>
												</td>
												<td>{user.roleNames}</td>
											</tr>
										</Link>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

SettingUsers.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}