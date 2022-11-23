import AdminHeader from "@components/admin/AdminHeader.component"
import AdminMissing from "@components/admin/AdminMissing.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormInput from "@components/form/FormInput.component"
import Access from "@components/util/Access.component"
import TabsNavigation from "@components/util/Tabs.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import Link from "next/link"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"

export function getServerSideProps({ query }) {
	return {
		props: {
			textId: query.textId
		}
	}
}

export default function TextHardcodeId({ textId }) {
	const { breadcrumb } = useCurrentPath()
	const { dispatch } = useContext(DashboardContext)
	const setForm = useForm()
	const { reset, handleSubmit } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/text-hardcode/${textId}`)
	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/text-hardcode/${textId}/update`, {
				text: {
					en: data.text.en,
					id: data.text.id
				}
			})
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Page has been updated!`
			} })
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, page cannot be updated!`,
				footnote: error.message
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	useEffect(() => {
		if (!pageData?.data) return
		reset(pageData.data)
	}, [ reset, pageData ])

	if (!pageData) return <></>

	return (
		pageData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						title={`${pageData?.data?.key}`}
						parent={<><Link href={breadcrumb[0]}>Text Hardcode</Link></>}
						action={
							<Access
								auth="write:translation-general"
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
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="text.en" label="Text (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="text.id" label="Text (ID)" />
														</div>
													)
												}
											]}
										/>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</form>
		)
	)
}

TextHardcodeId.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}