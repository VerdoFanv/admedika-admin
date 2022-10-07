import EiNotification from "@components/ei/EiNotification.component"
import FormInput from "@components/form/FormInput.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import { postData } from '@utils/fetcher'
import Link from "next/link"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const schema = yup.object({
	email: yup.string().email().required(`Email is required`)
})

export default function ForgetPassword() {
	const { state, dispatch } = useContext(DashboardContext)
	const [ isLoading, setIsLoading ] = useState(false)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { handleSubmit, formState: { errors } } = setForm

	async function submitForm(data) {
		setIsLoading(true)
		const body = {
			user_email: data.email,
		}

		try {
			await postData(`/forget-password`, body)
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Please check your email for instructions.`,
				footnote: ``,
				align: `global`
			} })
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
							<h1 className="title">Forgot Password</h1>
						</div>
						<form onSubmit={handleSubmit(submitForm)} className="login-card-form">
							<div className="row">
								<FormInput setForm={setForm} name="email" label="Email address" placeholder="hello@example.com" error={errors.email} styleLarge />
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
