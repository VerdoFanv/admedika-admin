import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import IconPlus from "public/assets/icons/icon-plus.svg"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import Subpage from "./SubPage.component"
import TabsNavigation from "@components/util/Tabs.component"
import FormInput from "@components/form/FormInput.component"
import { useForm } from "react-hook-form"
import FormCheck from "@components/form/FormCheck.component"
import { useContext, useEffect } from "react"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { postData } from "@utils/fetcher"
import { DashboardContext } from "@contexts/DashboardContext.context"

export default function Download() {
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
	const { currentPath } = useCurrentPath()
	const { dispatch } = useContext(DashboardContext)
	const { data: newsData } = useGetData(`/page/7`)
	const pageId = newsData?.data?.page_sub.find((page) => page.page_type === `download-corner`).page_id
	const { data: pageData, isLoading } = useGetData(`/page/${pageId}`)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { handleSubmit, reset } = setForm
	useLoading(isLoading)

	const submit = async (data) => {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${pageId}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
				page_parent_id: pageData.data.page_parent_id,
				page_type: pageData.data.page_type
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
		reset({
			pl_title: {
				en: pageData?.data.pl_title?.en,
				id: pageData?.data.pl_title?.id,
			},
			page_status: pageData?.data.page_status === 1 ? true : false
		})
	}, [ pageData ])

	return (
		<form onSubmit={handleSubmit(submit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Download Corner"
					legend="news"
					action={
						<Access
							auth="write:news-download"
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
						<div className="admin-section-head">
							<h2 className="title">General</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.id" label="Title (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormCheck setForm={setForm} name="page_status" type="checkbox" label="Status" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Category</h2>
							<Access
								auth="write:news-download"
								yes={
									<ul className="actions">
										<li className="action">
											<Link href={`${currentPath}/new`} passHref><a className="button button-small button-primary"><i className="icon icon-inline" role="img"><IconPlus className="svg" /></i> Add</a></Link>
										</li>
									</ul>
								}
							/>
						</div>
						<div className="admin-section-body">
							{pageData?.data?.page_sub &&
							<Subpage subpages={pageData.data.page_sub} currentPath={currentPath} />
							}
						</div>
					</div>
				</section>
			</div>
		</form>
	)
}

Download.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}