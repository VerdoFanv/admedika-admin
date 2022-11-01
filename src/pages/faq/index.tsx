import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import IconSidebar from "public/assets/icons/icon-sidebar.svg"
import IconPlus from "public/assets/icons/icon-plus.svg"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import * as yup from "yup"
import { useContext, useEffect, useState } from "react"
import { postData } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { DashboardContext } from "@contexts/DashboardContext.context"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import FormInput from "@components/form/FormInput.component"
import TabsNavigation from "@components/util/Tabs.component"
import Subpage from "./SubPage.component"
import FormWysiwygColorPickerOnly from "@components/form/FormWysiwygColorPickerOnly.component"
import { pageId } from "@variables/pageId.variable"

export default function ProviderClients() {
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
	const [ showSidebar, setShowSidebar ] = useState(false)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading } = useGetData(`/page/${pageId[`myadmedika-faq`]}`)
	useLoading(isLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${pageId[`myadmedika-faq`]}/update`, {
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
		if (pageData) {
			reset({
				...pageData.data,
				page_status: pageData?.data?.page_status === 1 ? true : false
			})
		}
	}, [ pageData, reset ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="FAQ"
					// legend="faq"
					action={
						<Access
							auth="write:faq-myadmedika"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Save</button>
									</li>
									<li className="action">
										<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
									</li>
								</ul>
							}
							no={
								<ul className="actions">
									<li className="action">
										<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
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
							<h1 className="title">General</h1>
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
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.header_title.en" label="Header Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.header_title.id" label="Header Title (ID)" />
													</div>
												)
											}
										]}
									/>
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.header_subtitle.en" label="Header Subtitle (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.header_subtitle.id" label="Header Subtitle (ID)" />
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
							<h2 className="title">Category</h2>
							<Access
								auth="write:faq-myadmedika"
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

			<AdminPageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
		</form>
	)
}

ProviderClients.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}