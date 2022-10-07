import EiNotification from "@components/ei/EiNotification.component"
import FormInput from "@components/form/FormInput.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import { postData } from '@utils/fetcher'
import { setCookieForLogin } from "@utils/cookie"
import Link from "next/link"
import { useRouter } from "next/router"
import IconArrowRight from 'public/assets/icons/icon-arrow-right.svg'
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const schema = yup.object({
	email: yup.string().email().required(`Email is required`),
	password: yup.string().required(`Password is required`).test(`len`, `Password must be at least 6 characters`, val => val.length >= 6),
})

export default function Auth() {
	const { state, dispatch } = useContext(DashboardContext)
	const [ isLoading, setIsLoading ] = useState(false)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { handleSubmit, formState: { errors } } = setForm
	const router = useRouter()

	async function submitForm(data: any) {
		setIsLoading(true)
		const body = {
			user_email: data.email,
			user_password: data.password
		}

		try {
			const response = await postData(`/login`, body)
			const loginTime = new Date()
			loginTime.setMinutes(loginTime.getMinutes() + (response.expires_in / 60))

			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Login success`,
				align: ``
			} })
			setCookieForLogin(`isLogin`, true, response.expires_in)

			localStorage.clear()
			localStorage.setItem(`loginTime`, String(loginTime))
			localStorage.setItem(`accessToken`, response.access_token)
			localStorage.setItem(`refreshToken`, response.refresh_token)
			router.push(`/home-admedika`)
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Failed login - ${error}`,
				align: ``
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
							<h1 className="title">Login</h1>
						</div>
						<form onSubmit={handleSubmit(submitForm)} className="login-card-form">
							<div className="row">
								<FormInput setForm={setForm} name="email" label="Email address" placeholder="hello@example.com" error={errors.email} styleLarge />
							</div>
							<div className="row">
								<FormInput setForm={setForm} name="password" type="password" label="Password" placeholder="••••••••••••••" error={errors.password} styleLarge />
							</div>
							<div className="row">
								<button type="submit" className="button button-large button-full">Sign in <i className="icon" role="img"><IconArrowRight className="svg" /></i></button>
							</div>
						</form>
						<div className="login-card-footer">
							<Link href="/forgot-password"><a className="link">Forgot Password?</a></Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
