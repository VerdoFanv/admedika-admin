import EiNotification from "@components/ei/EiNotification.component"
import FormInput from "@components/form/FormInput.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import { postData } from '@utils/fetcher'
import { deleteCookieForResetPassword } from '@utils/cookie'
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const schema = yup.object({
	user_password: yup.string().required(`Password is required`).test(`len`, `Password must be at least 6 characters`, val => val.length >= 6),
	user_password_confirmation: yup.string().oneOf([ yup.ref(`user_password`), null ], `Password must match`)
})

export default function ResetPassword() {
	const { state, dispatch } = useContext(DashboardContext)
	const [ isLoading, setIsLoading ] = useState(false)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { handleSubmit, formState: { errors } } = setForm
	const router = useRouter()

	async function submitForm(data) {
		setIsLoading(true)
		const body = {
			...data,
			key: router.query.key,
			token: router.query.token,
			user_email: router.query.email,
		}

		try {
			await postData(`/reset-password`, body)
			deleteCookieForResetPassword(false)
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Success change password`,
				footnote: ``,
				align: `global`
			} })
			router.push(`/`)
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Failed to reset password. Please try again later.`,
				footnote: error,
				align: `global`
			} })
		}

		setIsLoading(false)
	}

	return (
		<div className={`login ${isLoading ? `is-loading` : ``}`}>
			<EiNotification isShown={state.notification.isShown} close={() => dispatch({ type: `close_notification` })} text={state.notification.text} footnote={state.notification.footnote} type={state.notification.type} align={state.notification.align} autoClose={state.notification.autoClose} />
			<div className="login-content">
				<div className="login-content-inner">
					<div className="login-card">
						<div className="login-card-header">
							<h1 className="title">Reset Password</h1>
						</div>
						<form onSubmit={handleSubmit(submitForm)} className="login-card-form">
							<div className="row">
								<FormInput setForm={setForm} name="user_password" type="password" label="New Password" placeholder="••••••••••••••" error={errors.user_password} styleLarge />
							</div>
							<div className="row">
								<FormInput setForm={setForm} name="user_password_confirmation" type="password" label="Repeat New Password" placeholder="••••••••••••••" error={errors.user_password_confirmation} styleLarge />
							</div>

							<div className="row">
								<button type="submit" className="button button-large button-full">Reset Password</button>
							</div>
						</form>
						<div className="login-card-footer">
							<Link href="/"><a className="link">Back to Login</a></Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
