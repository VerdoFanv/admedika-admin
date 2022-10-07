import AdminHeader from '@components/admin/AdminHeader.component'
import AdminMissing from "@components/admin/AdminMissing.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import FormCheck from '@components/form/FormCheck.component'
import FormInput from '@components/form/FormInput.component'
import Access from "@components/util/Access.component"
import { DashboardContext } from '@contexts/DashboardContext.context'
import { yupResolver } from "@hookform/resolvers/yup"
import { postData } from "@utils/fetcher"
import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from "yup"

const schema = yup.object({
	role_name: yup.string().required(`Role name is required`)
})
export default function SettingRoleNew() {
	const { state: dashboardState, dispatch: dashboardDispatch } = useContext(DashboardContext)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { watch, handleSubmit, setValue, reset, formState: { errors, isDirty } } = setForm

	const watchAuthRead = watch(`auth.read`)
	const watchAuthWrite = watch(`auth.write`)

	useEffect(() => {
		if (dashboardState.authValues.length && watchAuthRead?.length === dashboardState.authValues.length) {
			setValue(`auth-read-all`, true)
		} else {
			setValue(`auth-read-all`, false)
		}
	}, [ watchAuthRead, dashboardState.authValues, setValue ])

	useEffect(() => {
		if (dashboardState.authValues.length && watchAuthWrite?.length === dashboardState.authValues.length) {
			setValue(`auth-write-all`, true)
		} else {
			setValue(`auth-write-all`, false)
		}
	}, [ watchAuthWrite, dashboardState.authValues, setValue ])

	async function onSubmit(data) {
		dashboardDispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/role/create`, data)
			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Success adding new role`,
				type: `success`
			} })
		} catch (error) {
			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Failed to add new role`,
				type: `error`,
				footnote: error.message
			} })
		}

		reset()
		dashboardDispatch({ type: `set_isLoading`, payload: false })
	}

	function toggleAllAuths(ev, auth) {
		if (ev.target.checked) {
			setValue(auth, dashboardState.authValues)
		} else {
			setValue(auth, ``)
		}
	}

	return (
		<Access
			auth="write:settings-users"
			yes={
				<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
					<header className="admin-page-header">
						<AdminHeader
							title="New"
							parent={
								<>
									<Link href="/settings/users">Users</Link>
									<span className="sep">/</span>
									<Link href="/settings/users/roles">Roles</Link>
								</>
							}
							legend="Settings"
							action={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small" disabled={!isDirty}>Save</button>
									</li>
								</ul>
							}
						/>
					</header>
					<div className="admin-page-content">
						<section className="section">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput setForm={setForm} name="role_name" label="Role name" error={errors.role_name} />
									</div>
								</div>
							</div>
						</section>
						<section className="section">
							<div className="admin-section">
								<div className="admin-section-head">
									<h2 className="title">Role Permission</h2>
								</div>
								<div className="admin-section-body admin-section-body-gray">
									<div className="form-auth">
										<table className="form-auth-table">
											<thead>
												<tr>
													<th>Auth Access</th>
													<th>
														<label htmlFor="auth-read-all" className="label">Read</label>
														<FormCheck onChange={(ev) => toggleAllAuths(ev, `role_ability.read`)} setForm={setForm} name="auth-read-all" type="checkbox" styleCenter />
													</th>
													<th>
														<label htmlFor="auth-write-all" className="label">Write</label>
														<FormCheck onChange={(ev) => toggleAllAuths(ev, `role_ability.write`)} setForm={setForm} name="auth-write-all" type="checkbox" styleCenter />
													</th>
												</tr>
											</thead>
											<tbody>
												{dashboardState.authObjects.page?.map((nav) =>
													<tr key={nav.key}>
														<td>{nav.label}</td>
														<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.read" value={nav.key} styleCenter /></td>
														<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.write" value={nav.key} styleCenter /></td>
													</tr>
												)}
												<tr>
													<th colSpan={4}>Settings</th>
												</tr>
												{dashboardState.authObjects.settings?.map((nav) =>
													<tr key={nav.key}>
														<td>{nav.label}</td>
														<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.read" value={nav.key} styleCenter /></td>
														<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.write" value={nav.key} styleCenter /></td>
													</tr>
												)}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</section>
					</div>
				</form>
			}
			no={
				<AdminMissing />
			}
		/>
	)
}

SettingRoleNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}