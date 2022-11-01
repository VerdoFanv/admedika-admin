import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import * as yup from "yup"
import { useContext, useEffect } from "react"
import { postData } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { DashboardContext } from "@contexts/DashboardContext.context"
import FormInput from "@components/form/FormInput.component"
import TabsNavigation from "@components/util/Tabs.component"
import FormRepeater from "@components/form/FormRepeater.component"
import useLoading from "@hooks/useLoading.hook"

export function getServerSideProps({ query }) {
	return {
		props: {
			categoryId: query.categoryId
		}
	}
}

export default function ProviderClientsSingleNew({ categoryId }) {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pl_title: yup.object({
			id: yup.string().required(`Title (ID) is required`)
		})
	}) : yup.object({
		pl_title: yup.object({
			en: yup.string().required(`Title (EN) is required`)
		})
	})
	const { breadcrumb } = useCurrentPath()
	const { dispatch } = useContext(DashboardContext)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${categoryId}`)
	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${categoryId}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
			})
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Page has been updated!`
			} })
		} catch (err) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, page cannot be updated!`
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	useEffect(() => {
		if (pageData?.data) {
			reset({
				...pageData.data,
				page_status: pageData.data.page_status === 1 ? true : false,
			})
		}
	}, [ pageData, reset ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title={pageData?.data?.page_title}
					parent={<Link href={breadcrumb[0]}>FAQ</Link>}
					action={
						<Access
							auth="write:faq-myadmedika"
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
														<FormInput setForm={setForm} name="pl_title.en" label="Title (EN)" error={errors?.pl_title?.en} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.id" label="Title (ID)" error={errors?.pl_title?.id} />
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
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h1 className="title">Question & Answer</h1>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormRepeater
											setForm={setForm}
											name="meta.repeater.qna"
											inputNames={[ `question.id`, `question.en`, `answer.id`, `answer.en` ]}
											inputLabels={[ `Question (ID)`, `Question (EN)`, `Answer (ID)`, `Answer (EN)` ]}
											inputShown={1}
											inputTypes={[ `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only` ]}
											inputWidths={[ `100%` ]}
											sortable
										/>
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

ProviderClientsSingleNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}