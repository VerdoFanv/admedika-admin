import AdminHeader from "@components/admin/AdminHeader.component"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import AdminSubpage from "@components/admin/AdminSubpage.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import Link from "next/link"
import IconPlus from "public/assets/icons/icon-plus.svg"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import { useContext, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import useCurrentPath from "@hooks/useCurrentPath.hook"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import FormTextarea from "@components/form/FormTextarea.component"
import TabsNavigation from "@components/util/Tabs.component"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
import FormInput from "@components/form/FormInput.component"
import FormFile from "@components/form/FormFile.component"
import IconSidebar from "public/assets/icons/icon-sidebar.svg"
import { pageId } from "@variables/pageId.variable"

export default function CareerPage() {
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
	const { dispatch } = useContext(DashboardContext)
	const { currentPath } = useCurrentPath()
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit } = setForm
	const [ showSidebar, setShowSidebar ] = useState(false)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${pageId[`career`]}`)
	useLoading(pageIsLoading)

	const onSubmit = async (data: any) => {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/page/${pageId[`career`]}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
				page_type: pageData.data.page_type,
			})
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
			reset({
				...pageData.data,
				page_status: pageData?.data?.page_status === 1 ? true : false
			})
		}
	}, [ reset, pageData ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					legend="career"
					title="Page"
					action={
						<Access
							auth="write:career-page"
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
										listLabel={[ `Desktop`, `Tablet`, `Mobile` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image" type="image" label="Background desktop image" size="large" aspectRatio="15/4" footnote="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image_tablet" type="image" label="Background tablet image" size="large" aspectRatio="11/4" footnote="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image_mobile" type="image" label="Background mobile image" size="large" aspectRatio="9/4" footnote="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
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
									<TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="pl_content.en" label="Content (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="pl_content.id" label="Content (ID)" />
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
														<FormTextarea setForm={setForm} name="meta.text.quotes.en" label="Quotes (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormTextarea setForm={setForm} name="meta.text.quotes.id" label="Quotes (ID)" />
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
							<h2 className="title">Subpages</h2>
							<Access
								auth="write:career"
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
							<AdminSubpage subpages={pageData.data[`page_sub`]} currentPath={currentPath} />
							}
						</div>
					</div>
				</section>
			</div>

			<AdminPageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
		</form>
	)
}

CareerPage.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}