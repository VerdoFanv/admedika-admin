import AdminHeader from '@components/admin/AdminHeader.component'
import Dashboard from '@components/dashboard/Dashboard.component'
import Access from "@components/util/Access.component"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import Link from 'next/link'

export default function SettingRoles() {
	const { data: rolesData, isLoading } = useGetData(`/role`)
	const { data: currentUser } = useGetData(`/current-user`)

	useLoading(isLoading)

	if (!rolesData?.data) return <></>

	return (
		<div className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Roles"
					parent={<Link href="/settings/users">Users</Link>}
					legend="Settings"
					action={
						<Access
							auth="write:settings-users"
							yes={
								<ul className="actions">
									{currentUser?.data?.rolesIds[0] === 1 &&
									<li className="action">
										<Link href="/settings/users/roles/new">
											<a className="button button-small">New Role</a>
										</Link>
									</li>
									}
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
										<th>{rolesData.data.length} Roles</th>
										<th>Users</th>
									</tr>
								</thead>
								<tbody>
									{rolesData.data.map((role) =>
										<Link key={role.role_id} href={`/settings/users/roles/${role.role_id}`} passHref>
											<tr className="linkable">
												<td>
													<p className="strong">{role.role_name}</p>
												</td>
												<td>{role.users}</td>
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

SettingRoles.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}