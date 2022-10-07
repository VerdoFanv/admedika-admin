import AdminHeader from '@components/admin/AdminHeader.component'
import AdminMissing from '@components/admin/AdminMissing.component'
import Dashboard from '@components/dashboard/Dashboard.component'
import EiExpandable from "@components/ei/EiExpandable.component"
import EiPopup from '@components/ei/EiPopup.component'
import FormInput from '@components/form/FormInput.component'
import FormSelect from "@components/form/FormSelect.component"
import InputCheckbox from "@components/input/inputCheckbox.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from '@contexts/DashboardContext.context'
import { yupResolver } from '@hookform/resolvers/yup'
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { deleteData, postOptimisticData } from "@utils/fetcher"
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSWRConfig } from "swr"
import { useImmerReducer } from 'use-immer'
import * as yup from "yup"

function reducer(state, action) {
	switch (action.type) {
		case `set_user_data`:
			state.user.data = action.payload
			return
		case `set_authPopup_isShown`:
			state.authPopup.isShown = action.payload
			return
		case `set_authPopup_data`:
			state.authPopup.data = action.payload
			return
		case `set_deletePopup_isShown`:
			state.deletePopup.isShown = action.payload
			return
		case `set_user_roles`:
			state.user.roles = action.payload
			return
		default:
			return state
	}
}

const initialState = {
	user: {
		data: {},
		roles: []
	},
	authPopup: {
		isShown: false,
		data: {}
	},
	deletePopup: {
		isShown: false
	}
}

const schema = yup.object({
	user_fullname: yup.string().required(`Full name is required`),
	user_email: yup.string().email().required(`Email is required`),
	user_role: yup.string().required(`Role must be assigned`),
	user_password: yup.string().test(`len`, `Password must be at least 6 characters`, password => !password || password.length >= 6),
	user_password_confirmation: yup.string().oneOf([ yup.ref(`user_password`), null ], `Password must match`)
})

export default function SettingUserEdit() {
	const { state: dashboardState, dispatch: dashboardDispatch } = useContext(DashboardContext)
	const [ state, dispatch ] = useImmerReducer(reducer, initialState)

	const router = useRouter()
	const { userId } = router.query

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, watch, handleSubmit, formState: { isDirty, errors } } = setForm
	const watchRole = watch(`user_role`)

	const { data: userData, isLoading: userIsLoading } = useGetData(`/user/${userId}`)
	const { data: rolesData } = useGetData(`/role`)
	const { data: currentUser } = useGetData(`/current-user`)
	const { mutate } = useSWRConfig()

	useLoading(userIsLoading)

	useEffect(() => {
		if (userData?.data) {
			const resetData = {
				...userData.data,
				user_role: userData.data.rolesIds[0]
			}

			reset(resetData)
		}
	}, [ userData, reset ])

	useEffect(() => {
		if (!rolesData?.data) return

		const currentRole = rolesData.data.find(arr => arr.role_id === watchRole)

		dispatch({ type: `set_authPopup_data`, payload: currentRole })
	}, [ dispatch, rolesData, watchRole ])

	async function handleDeleteUser() {
		dashboardDispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/user/${userId}/delete`)
			dispatch({ type: `set_deletePopup_isShown`, payload: false })
			dashboardDispatch({ type: `show_notification`, payload: {
				type: `info`,
				text: `User has been deleted!`
			} })
			router.push(`/settings/users`)
		} catch (error) {
			dashboardDispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, something went wrong!`,
				footnote: error.message
			} })
		}

		dashboardDispatch({ type: `set_isLoading`, payload: false })
	}

	async function onSubmit(data) {
		const payload = {
			...data,
			"role_ids[]": data.user_role
		}

		dashboardDispatch({ type: `set_isLoading`, payload: true })

		try {
			await postOptimisticData(`/user/${data.user_id}/update`, payload, mutate, `/user/${userId}`, data)
			await mutate(`${process.env.NEXT_PUBLIC_API_URL}/current-user`)

			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Success update user`,
				type: `success`
			} })
		} catch (error) {
			dashboardDispatch({ type: `show_notification`, payload: {
				text: `Failed to update user`,
				type: `error`,
				footnote: error.message
			} })
		}

		dashboardDispatch({ type: `set_isLoading`, payload: false })
	}

	if (!rolesData?.data) return <></>

	return (
		userData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						title="Edit User"
						parent={<Link href="/settings/users">Users</Link>}
						legend="Settings"
						action={
							<Access
								auth="write:settings-users"
								except={userId === String(dashboardState.auth.uuid)}
								yes={
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
														<button type="button" onClick={handleDeleteUser} className="button button-danger">Delete User</button>
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
									<FormInput setForm={setForm} name="user_fullname" label="Full Name" error={errors.user_fullname} />
								</div>
								<div className="row">
									<FormInput setForm={setForm} name="user_email" label="Email" error={errors.user_email} />
								</div>
								{currentUser?.data?.rolesIds[0] === 1 &&
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
								}
							</div>
						</div>
					</section>
					<section className="section">
						<div className="admin-section">
							<div className="admin-section-body">
								<EiExpandable title="Change Password" desc="Set new password for this user">
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<div className="row">
												<FormInput setForm={setForm} name="user_password" type="password" label="New Password" error={errors.user_password} />
											</div>
											<div className="row">
												<FormInput setForm={setForm} name="user_password_confirmation" type="password" label="Repeat New Password" error={errors.user_password_confirmation} />
											</div>
										</div>
									</div>
								</EiExpandable>
							</div>
						</div>
					</section>
				</div>
			</form>
		)
	)
}

SettingUserEdit.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}