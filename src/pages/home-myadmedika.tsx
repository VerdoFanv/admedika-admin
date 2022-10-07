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
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import IconSidebar from 'public/assets/icons/icon-sidebar.svg'
import { useContext, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'

export default function Home() {
	const { dispatch } = useContext(DashboardContext)
	const [ showSidebar, setShowSidebar ] = useState(false)
	const setForm = useForm()
	const { reset, handleSubmit } = setForm
	const { data: pageId } = useGetData(`/page/list-page-id`)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${pageId?.data?.page_id[`myadmedika-home`]}`)

	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/page/${pageId?.data?.page_id[`myadmedika-home`]}/update`, {
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
					title="Home"
					action={
						<Access
							auth="write:home-myadmedika"
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
							<h2 className="title">Hero Banner</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormRepeater
											setForm={setForm}
											name="meta.repeater.banner"
											inputNames={[ `image`, `image_tablet`, `image_mobile`, `image_alt`, `text.id`, `text.en` ]}
											inputTypes={[ `image`, `image`, `image`, `text`, `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only` ]}
											inputLabels={[ `Image Desktop`, `Image Tablet`, `Image Mobile`, `Image Alt`, `Text (ID)`, `Text (EN)` ]}
											inputWidths={[ `auto`, `auto`, `auto` ]}
											inputShown={3}
											inputProps={[
												{
													size: `medium`,
													aspectRatio: `10/6`,
													title: `Recommended size 1920x1080px. Max filesize 6MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 1920x1080px. Max filesize 6MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												},
												{
													size: `medium`,
													aspectRatio: `8/6`,
													title: `Recommended size 1024x760px. Max filesize 3MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 1024x760px. Max filesize 3MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												},
												{
													size: `medium`,
													aspectRatio: `14/13`,
													title: `Recommended size 414x381px. Max filesize 2MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 414x381px. Max filesize 2MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												}
											]}
											max={100}
											sortable
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Feature</h2>
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.feature_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.feature_title.id" label="Title (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormRepeater
											setForm={setForm}
											inputHeading="Slider"
											name="meta.repeater.feature_slider"
											inputNames={[ `title.id`, `title.en`, `desc.id`, `desc.en` ]}
											inputTypes={[ `text`, `text`, `textarea`, `textarea` ]}
											inputLabels={[ `Title (ID)`, `Title (EN)`, `Description (ID)`, `Description (EN)` ]}
											inputShown={2}
											inputWidths={[ `50%`, `50%` ]}
											max={100}
											sortable
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Benefit</h2>
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.benefit_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.benefit_title.id" label="Title (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.benefit_video" label="Video" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">FAQ</h2>
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.faq_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.faq_title.id" label="Title (ID)" />
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
							<h2 className="title">Apps</h2>
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.apps_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.apps_title.id" label="Title (ID)" />
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.apps_desc.en" label="Description (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.apps_desc.id" label="Description (ID)" />
													</div>
												)
											}
										]}
									/>
									<TabsNavigation
										listLabel={[ `Desktop`, `IOS`, `Android` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.apps_download_link_desktop" label="Desktop Link" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.apps_download_link_iphone" label="IOS Link" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.apps_download_link_android" label="Android Link" />
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
							<h2 className="title">Apps Banner</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormFile
											type="image"
											setForm={setForm}
											name="meta.image.apps_banner_image"
											label="Image"
											size="large"
											aspectRatio="9/2"
											title="Recommended size 1926x422px. Max filesize 6MB. Accepted format: jpg, png."
											footnote="Recommended size 1926x422px. Max filesize 6MB. Accepted format: jpg, png."
											acceptedFormat={[ `.jpg`, `.png` ]}
										/>
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.apps_banner_image_alt" label="Image Alt" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Feature Slider</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormFile
											type="image"
											setForm={setForm}
											name="meta.image.feature_slider_image"
											label="Image"
											size="medium"
											aspectRatio="10/10"
											title="Recommended size 1141x1080px. Max filesize 3MB. Accepted format: jpg, png."
											footnote="Recommended size 1141x1080px. Max filesize 3MB. Accepted format: jpg, png."
											acceptedFormat={[ `.jpg`, `.png` ]}
										/>
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.feature_slider_image_alt" label="Image Alt" />
									</div>
									<FormFile
										type="image"
										setForm={setForm}
										name="meta.image.feature_slider_image_background"
										label="Background Image"
										size="large"
										aspectRatio="10/6"
										title="Recommended size 1920x1080px. Max filesize 3MB. Accepted format: jpg, png."
										footnote="Recommended size 1920x1080px. Max filesize 3MB. Accepted format: jpg, png."
										acceptedFormat={[ `.jpg`, `.png` ]}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>

			<AdminPageSidebar setForm={setForm} isShown={showSidebar} close={() => setShowSidebar(false)} />
		</form>
	)
}

Home.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}