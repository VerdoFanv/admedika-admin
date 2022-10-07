import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormInput from "@components/form/FormInput.component"
import FormSelect from "@components/form/FormSelect.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

const schema = yup.object({
	setting_mail_driver: yup.string().required(`Driver is required`),
	setting_mail_host: yup.string().required(`Host is required`),
	setting_mail_port: yup.string().required(`Port is required`),
	setting_mail_from_address: yup.string().required(`From address is required`),
	setting_mail_from_name: yup.string().required(`From name is required`),
	setting_mail_encryption: yup.string().required(`Encryption is required`),
	setting_mail_username: yup.string().required(`Username is required`),
	setting_mail_password: yup.string().required(`Password is required`)
})

export default function SettingsMail() {
	const { dispatch } = useContext(DashboardContext)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/setting-mail`)
	const [ optionsData, setOptionsData ] = useState({
		driver: [],
		encryption: []
	})
	useLoading(pageIsLoading)

	const onSubmit = async (data: any) => {
		delete data.driver_list
		delete data.encryption_list

		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/setting-mail/update`, data)
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Page has been updated!`
			} })
		} catch {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, page cannot be updated!`
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	useEffect(() => {
		if (pageData?.data?.driver_list && pageData?.data?.encryption_list) {
			setOptionsData({
				...optionsData,
				driver: Object.values(pageData?.data?.driver_list).map((driver) => ({ value: driver as string, label: driver as string })),
				encryption: Object.values(pageData?.data?.encryption_list).map((encryption) => ({ value: encryption as string, label: encryption as string }))
			})
		}
	}, [ reset, pageData ])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					legend="settings"
					title="Mail"
					action={
						<Access
							auth="write:settings-mail"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Save</button>
									</li>
								</ul>
							}
						/>
					}
				/>
			</header>
			<div className="admin-page-content">
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormSelect
											setForm={setForm}
											options={optionsData.driver}
											name="setting_mail_driver"
											label="Driver"
											error={errors?.setting_mail_driver}
										/>
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="setting_mail_host" label="Host" error={errors?.setting_mail_host} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="setting_mail_port" label="Port" error={errors?.setting_mail_port} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="setting_mail_from_address" label="From address" error={errors?.setting_mail_from_address} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="setting_mail_from_name" label="From name" error={errors?.setting_mail_from_name} />
									</div>
									<div className="row">
										<FormSelect
											setForm={setForm}
											options={optionsData?.encryption}
											name="setting_mail_encryption"
											label="Encryption"
											error={errors?.setting_mail_encryption}
										/>
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="setting_mail_username" label="Username" error={errors?.setting_mail_username} />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="setting_mail_password" label="Password" error={errors?.setting_mail_password} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</form>
	)
}

SettingsMail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}