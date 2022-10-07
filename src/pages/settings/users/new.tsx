import AdminHeader from '@components/admin/AdminHeader.component'
import AdminMissing from "@components/admin/AdminMissing.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import EiPopup from "@components/ei/EiPopup.component"
import FormInput from '@components/form/FormInput.component'
import FormSelect from '@components/form/FormSelect.component'
import InputCheckbox from "@components/input/inputCheckbox.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from '@contexts/DashboardContext.context'
import { yupResolver } from "@hookform/resolvers/yup"
import useGetData from "@hooks/useGetData.hook"
import { postData } from '@utils/fetcher'
import Link from 'next/link'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useImmerReducer } from "use-immer"
import * as yup from "yup"

function reducer(state, action) {
	switch (action.type) {
		case `set_authPopup_isShown`:
			state.authPopup.isShown = action.payload
			return
		case `set_authPopup_data`:
			state.authPopup.data = action.payload
			return
		default:
			return state
	}
}

const initialState = {
	authPopup: {
		isShown: false,
		data: {}
	}
}

const schema = yup.object({
	user_fullname: yup.string().required(`Full name is required`),
	user_email: yup.string().email().required(`Email is required`),
	user_role: yup.string().required(`Role must be assigned`),
	user_password: yup.string().required(`Password is required`).test(`len`, `Password must be at least 6 characters`, val => val.length >= 6),
	user_password_confirmation: yup.string().oneOf([ yup.ref(`user_password`), null ], `Password must match`)
})

export default function SettingUserNew() {
	const { state: dashboardState, dispatch: dashboardDispatch } = useContext(DashboardContext)
	const [ state, dispatch ] = useImmerReducer(reducer, initialState)

	const setForm = useForm({
		resolver: yupResolver(schema),
	})
	const { reset, watch, handleSubmit, formState: { isDirty, errors } } = setForm
	const watchRole = watch(`user_role`)

	const { data: rolesData } = useGetData(`/role`)

	useEffect(() => {
		if (!rolesData?.data) return

		const currentRole = rolesData.data.find(arr => arr.role_id === watchRole)

		dispatch({ type: `set_authPopup_data`, payload: currentRole })
	}, [ dispatch, rolesData, watchRole ])

	async function onSubmit(data) {
		dashboardDispatch({ type: `set_isLoading`, payload: true })

		const body = {
			...data,
			user_is_verified: `1`,
			user_status: `2`,
			"role_ids[]": data.user_role
		}

		try {
			await postData(`/user/create`, body)
			reset()
			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Success adding new user`,
				type: `success`
			} })
		} catch (error) {
			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Failed to add new user`,
				type: `error`,
				footnote: error.message
			} })
		}

		dashboardDispatch({ type: `set_isLoading`, payload: false })
	}

	return (
		<Access
			auth="write:settings-users"
			yes={
				<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
					<header className="admin-page-header">
						<AdminHeader
							title="New User"
							parent={<Link href="/settings/users">Users</Link>}
							legend="Settings"
							action={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small" disabled={!isDirty}>Add User</button>
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
										<FormInput setForm={setForm} name="user_fullname" label="Full Name" error={errors.user_fullname} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="user_email" label="Email" error={errors.user_email} />
									</div>
									<div className="row">
										<FormSelect
											setForm={setForm}
											name="user_role"
											label="Role"
											footnote={<button type="button" onClick={() => dispatch({ type: `set_authPopup_isShown`, payload: true })} className="link">View role permission</button>}
											error={errors.user_role}
											options={
												rolesData?.data?.map((role) => (
													{ value: role.role_id, label: role.role_name }
												))
											}
										/>
										<EiPopup isShown={state.authPopup.isShown} close={() => dispatch({ type: `set_authPopup_isShown`, payload: false })} closeOutside closeIcon>
											<div className="form-auth">
												<table className="form-auth-table">
													<thead>
														<tr>
															<th>Auth Access</th>
															<th>
																<p className="legend">Read</p>
															</th>
															<th>
																<p className="legend">Write</p>
															</th>
														</tr>
													</thead>
													<tbody>
														{dashboardState.authObjects.page?.map((nav) =>
															<tr key={nav.key}>
																<td>{nav.label}</td>
																<td><InputCheckbox name={`${nav.key}-read`} type="checkbox" checked={state.authPopup.data?.role_ability?.read?.includes(nav.key)} readOnly styleReadOnly styleCenter /></td>
																<td><InputCheckbox name={`${nav.key}-write`} type="checkbox" checked={state.authPopup.data?.role_ability?.write?.includes(nav.key)} readOnly styleReadOnly styleCenter /></td>
															</tr>
														)}
														<tr>
															<th colSpan={4}>Settings</th>
														</tr>
														{dashboardState.authObjects.settings?.map((nav) =>
															<tr key={nav.key}>
																<td>{nav.label}</td>
																<td><InputCheckbox name={`${nav.key}-read`} type="checkbox" checked={state.authPopup.data?.role_ability?.read?.includes(nav.key)} readOnly styleReadOnly styleCenter /></td>
																<td><InputCheckbox name={`${nav.key}-write`} type="checkbox" checked={state.authPopup.data?.role_ability?.write?.includes(nav.key)} readOnly styleReadOnly styleCenter /></td>
															</tr>
														)}
													</tbody>
												</table>
											</div>
										</EiPopup>
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="user_password" type="password" label="Password" error={errors.user_password} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="user_password_confirmation" type="password" label="Repeat Password" error={errors.user_password_confirmation} />
									</div>
								</div>
							</div>
						</section>
					</div>
				</form>
			}
			no= {
				<AdminMissing />
			}
		/>
	)
}

SettingUserNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}