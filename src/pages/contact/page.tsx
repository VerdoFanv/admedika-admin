import AdminHeader from "@components/admin/AdminHeader.component"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import FormFile from "@components/form/FormFile.component"
import FormInput from "@components/form/FormInput.component"
import FormRepeater from "@components/form/FormRepeater.component"
import FormWysiwygColorPickerOnly from "@components/form/FormWysiwygColorPickerOnly.component"
import Access from "@components/util/Access.component"
import TabsNavigation from "@components/util/Tabs.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import IconSidebar from "public/assets/icons/icon-sidebar.svg"
import { useContext, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import * as yup from "yup"

export default function ContactPage() {
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
	const [ showSidebar, setShowSidebar ] = useState(false)
	const [ loading, setLoading ] = useState(true)

	const { data: pageId } = useGetData(`/page/list-page-id`)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${pageId?.data?.page_id[`contact`]}`)
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	useLoading(loading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/page/${pageId?.data?.page_id[`contact`]}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
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
		if (pageIsLoading) {
			setLoading(true)
		} else {
			setLoading(false)
		}
	}, [ pageIsLoading ])

	useEffect(() => {
		if (!pageData) return

		const concatedData = {
			...pageData.data,
			page_status: pageData?.data?.page_status === 1 ? true : false
		}

		reset(concatedData)
	}, [ reset, pageData ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					legend="Contact"
					title="Page"
					action={
						<Access
							auth="write:contact-page"
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
							<h2 className="title">Page Header</h2>
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
														<FormFile setForm={setForm} name="page_image_tablet" type="image" label="Background tablet image" size="large" aspectRatio="11/4" footnote="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="page_image_mobile" type="image" label="Background mobile image" size="large" aspectRatio="9/4" footnote="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
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
														<FormInput setForm={setForm} name="pl_title.en" label="Title (EN)" error={errors.pl_title?.en} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="pl_title.id" label="Title (ID)" error={errors.pl_title?.id} />
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
							<h2 className="title">Head Office</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput setForm={setForm} label="Title" name="meta.text.ho_title" />
									</div>
									<div className="row">
										<FormWysiwygColorPickerOnly setForm={setForm} label="Address" name="meta.text.ho_address" />
									</div>
									<div className="rows">
										<div className="columns">
											<div className="column">
												<FormInput setForm={setForm} label="Phone" name="meta.text.ho_phone" />
											</div>
											<div className="column">
												<FormInput setForm={setForm} label="Fax" name="meta.text.ho_fax" />
											</div>
										</div>
									</div>
									<div className="rows">
										<div className="columns">
											<div className="column">
												<FormInput setForm={setForm} label="Instagram" name="meta.text.ho_instagram" />
											</div>
											<div className="column">
												<FormInput setForm={setForm} label="Twitter" name="meta.text.ho_twitter" />
											</div>
										</div>
									</div>
									<div className="rows">
										<div className="columns">
											<div className="column">
												<FormInput setForm={setForm} label="Facebook" name="meta.text.ho_facebook" />
											</div>
											<div className="column">
												<FormInput setForm={setForm} label="Email" name="meta.text.ho_email" />
											</div>
										</div>
									</div>
									<div className="row">
										<FormInput setForm={setForm} label="Maps Link" name="meta.text.ho_maps_link" />
									</div>
									<div className="row">
										<FormInput setForm={setForm} label="Maps Iframe" name="meta.text.ho_maps_iframe" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Branches</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<FormRepeater
										setForm={setForm}
										name="meta.repeater.branch"
										inputNames={[ `name`, `email`, `phone`, `address`, `maps_link` ]}
										inputTypes={[ `text`, `text`, `text`, `wysiwyg-color-picker-only`, `text` ]}
										inputLabels={[ `Name`, `Email`, `Phone`, `Address`, `Maps Link` ]}
										inputWidths={[ `auto` ]}
										inputShown={2}
										sortable
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>

			<AdminPageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
		</form>
	)
}

ContactPage.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}