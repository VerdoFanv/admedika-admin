import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import { useContext, useEffect } from "react"
import { useForm } from 'react-hook-form'
import FormRepeater from "@components/form/FormRepeater.component"

export default function ContactDepartmentList() {
	const { dispatch } = useContext(DashboardContext)
	const setForm = useForm()
	const { reset, handleSubmit } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/option/contact-us-department`)
	useLoading(pageIsLoading)

	const onSubmit = async (data: any) => {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/option/contact-us-department`, data)
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
		if (pageData) {
			reset(pageData.data)
		}
	}, [ reset, pageData ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					legend="contact"
					title="Department List"
					action={
						<Access
							auth="write:contact-department-list"
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
									<FormRepeater
										setForm={setForm}
										name="option"
										inputNames={[ `dept_name` ]}
										inputTypes={[ `text` ]}
										inputLabels={[ `Name` ]}
										inputWidths={[ `100%` ]}
										sortable
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</form>
	)
}

ContactDepartmentList.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}