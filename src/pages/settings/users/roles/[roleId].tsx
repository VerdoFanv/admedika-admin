import AdminHeader from '@components/admin/AdminHeader.component'
import AdminMissing from '@components/admin/AdminMissing.component'
import Dashboard from '@components/dashboard/Dashboard.component'
import EiPopup from "@components/ei/EiPopup.component"
import FormCheck from "@components/form/FormCheck.component"
import FormInput from '@components/form/FormInput.component'
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { deleteData, postData } from "@utils/fetcher"
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { mutate } from 'swr'
import { useImmerReducer } from "use-immer"
import * as yup from "yup"

function reducer(state, action) {
	switch (action.type) {
		case `set_deletePopup_isShown`:
			state.deletePopup.isShown = action.payload
			return
		default:
			return state
	}
}

const initialState = {
	deletePopup: {
		isShown: false
	}
}

const schema = yup.object({
	role_name: yup.string().required(`Role name is required`)
})

export function getServerSideProps({ query }) {
	return {
		props: {
			roleId: query.roleId
		}
	}
}
export default function SettingRoleEdit({ roleId }) {
	const { state: dashboardState, dispatch: dashboardDispatch } = useContext(DashboardContext)
	const [ state, dispatch ] = useImmerReducer(reducer, initialState)
	const { data: currentUser } = useGetData(`/current-user`)

	const router = useRouter()

	const { data: roleData, isLoading: roleIsLoading } = useGetData(`/role/${roleId}`)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { watch, handleSubmit, setValue, reset, formState: { errors, isDirty } } = setForm
	const watchAuthRead = watch(`role_ability.read`)
	const watchAuthWrite = watch(`role_ability.write`)

	useLoading(roleIsLoading)

	useEffect(() => {
		if (!roleData) return

		reset(roleData.data)
	}, [ roleData, reset ])

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
		console.log(data)

		try {
			await postData(`/role/${roleId}/update`, data)
			await mutate(`${process.env.NEXT_PUBLIC_API_URL}/current-user`)

			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Role has been updated`,
				type: `success`
			} })
		} catch (error) {
			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Sorry, something went wrong`,
				type: `error`,
				footnote: error.message
			} })
		}

		dashboardDispatch({ type: `set_isLoading`, payload: false })
	}

	async function handleDeleteRole() {
		dashboardDispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/role/${roleId}/delete`)
			dispatch({ type: `set_deletePopup_isShown`, payload: false })
			dashboardDispatch({ type: `show_notification`, payload: {
				type: `info`,
				text: `Role has been deleted!`
			} })
			router.push(`/settings/users/roles`)
		} catch (error) {
			dashboardDispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, something went wrong!`,
				footnote: error.message
			} })
		}

		dashboardDispatch({ type: `set_isLoading`, payload: false })
	}

	function toggleAllAuths(ev, auth) {
		if (ev.target.checked) {
			setValue(auth, dashboardState.authValues)
		} else {
			setValue(auth, ``)
		}
	}

	if (!roleData?.data) return <></>

	return (
		roleData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						title="Edit"
						parent={
							<>
								<Link href="/settings/users">Users</Link>
								<span className="sep">/</span>
								<Link href="/settings/users/roles">Roles</Link>
							</>
						}
						legend="Settings"
						action={
							<Access
								auth="write:settings-users"
								yes={
									currentUser?.data?.rolesIds[0] === 1 &&
								<ul className="actions">
									<li className="action">
										<button type="button" onClick={() => dispatch({ type: `set_deletePopup_isShown`, payload: true })} className="button button-small button-alert">Delete</button>
										<EiPopup isShown={state.deletePopup.isShown} styleSmall>
											<div className="popup-confirm">
												<div className="popup-confirm-head">
													<h4>Delete user</h4>
												</div>
												<div className="popup-confirm-body">
													<p>You are about to delete an user. This action cannot be undone. Are you sure?</p>
												</div>
												<div className="popup-confirm-action">
													<button type="button" onClick={() => dispatch({ type: `set_deletePopup_isShown`, payload: false })} className="button button-gray">Cancel</button>
													<button type="button" onClick={handleDeleteRole} className="button button-danger">Delete User</button>
												</div>
											</div>
										</EiPopup>
									</li>
									<li className="action">
										<button type="submit" className="button button-small" disabled={!isDirty}>Save</button>
									</li>
								</ul>
								}
							/>
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
											<tr>
												<th colSpan={4}>Admedika</th>
											</tr>
											{dashboardState.authObjects.page?.map((nav) => !nav.key.includes(`myadmedika`) && !nav.key.includes(`mymerchant`) && !nav.key.includes(`general`) && (
												<tr key={nav.key} className={nav.key}>
													<td>{nav.label}</td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.read" value={nav.key} styleCenter /></td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.write" value={nav.key} styleCenter /></td>
												</tr>
											)
											)}
											<tr>
												<th colSpan={4}>MyAdmedika</th>
											</tr>
											{dashboardState.authObjects.page?.map((nav) => nav.key.includes(`myadmedika`) && (
												<tr key={nav.key} className={nav.key}>
													<td>{nav.label}</td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.read" value={nav.key} styleCenter /></td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.write" value={nav.key} styleCenter /></td>
												</tr>
											))}
											<tr>
												<th colSpan={4}>MyMerchant</th>
											</tr>
											{dashboardState.authObjects.page?.map((nav) => nav.key.includes(`mymerchant`) && (
												<tr key={nav.key} className={nav.key}>
													<td>{nav.label}</td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.read" value={nav.key} styleCenter /></td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.write" value={nav.key} styleCenter /></td>
												</tr>
											))}
											<tr>
												<th colSpan={4}>General</th>
											</tr>
											{dashboardState.authObjects.page?.map((nav) => nav.key.includes(`general`) && (
												<tr key={nav.key} className={nav.key}>
													<td>{nav.label}</td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.read" value={nav.key} styleCenter /></td>
													<td><FormCheck setForm={setForm} type="checkbox" name="role_ability.write" value={nav.key} styleCenter /></td>
												</tr>
											))}
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
		)
	)
}

SettingRoleEdit.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}