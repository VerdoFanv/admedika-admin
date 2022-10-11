import AdminHeader from "@components/admin/AdminHeader.component"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import FormFile from "@components/form/FormFile.component"
import FormInput from "@components/form/FormInput.component"
import FormRepeater from "@components/form/FormRepeater.component"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
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
	const setForm = useForm<any>()
	const { reset, handleSubmit } = setForm
	const { data: pageId } = useGetData(`/page/list-page-id`)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${pageId?.data?.page_id[`home`]}`)
	const { data: pageServiceData } = useGetData(`/page/${pageId?.data?.page_id[`service`]}`)
	const { data: postList } = useGetData(`/list/post`)

	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		const healthArticleSelected = []
		data.health_article.forEach((item) => healthArticleSelected.push(item.id))

		try {
			await postData(`/page/${pageId?.data?.page_id[`home`]}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
				page_type: pageData.data.page_type,
				health_article_post_id: healthArticleSelected
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
				health_article: pageData?.data?.health_article?.map((item) => ({ id: item }))
			})
		}
	}, [ pageData, reset ])

	if (!pageData?.data || !pageServiceData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Home"
					action={
						<Access
							auth="write:home"
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
											inputNames={[ `image`, `image_tablet`, `image_mobile`, `image_alt`, `text.id`, `text.en`, `link.id`, `link.en` ]}
											inputTypes={[ `image`, `image`, `image`, `text`, `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only`, `text`, `text` ]}
											inputLabels={[ `Image Desktop`, `Image Tablet`, `Image Mobile`, `Image Alt`, `Text (ID)`, `Text (EN)`, `Link (ID)`, `Link (EN)` ]}
											inputWidths={[ `auto`, `auto`, `auto` ]}
											inputShown={3}
											inputProps={[
												{
													size: `medium`,
													aspectRatio: `10/6`,
													title: `Recommended size 3840x2222px. Max filesize 6MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 3840x2222px. Max filesize 6MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												},
												{
													size: `medium`,
													aspectRatio: `8/6`,
													title: `Recommended size 2048x1518px. Max filesize 3MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 2048x1518px. Max filesize 3MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												},
												{
													size: `medium`,
													aspectRatio: `14/13`,
													title: `Recommended size 828x762px. Max filesize 2MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 828x762px. Max filesize 2MB. Accepted format: jpg, png.`,
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
							<h2 className="title">About Banner</h2>
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.about_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.about_title.id" label="Title (ID)" />
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
														<FormWysiwyg setForm={setForm} name="meta.text.about_subtitle.en" label="Subtitle (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="meta.text.about_subtitle.id" label="Subtitle (ID)" />
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
														<FormInput setForm={setForm} name="meta.text.about_link.en" label="Link (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.about_link.id" label="Link (ID)" />
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
									<TabsNavigation
										listLabel={[ `Desktop`, `Tablet`, `Mobile` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="meta.image.banner_apps_image" type="image" size="large" aspectRatio="15/4" footnote="Recommended size 3440x914px. Max filesize 2MB. Accepted format: jpg, png." title="Recommended size 3440x914px. Max filesize 2MB. Accepted format: jpg, png." label="Image desktop" acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="meta.image.banner_apps_image_tablet" type="image" size="large" aspectRatio="10/4" footnote="Recommended size 1728x684px. Max filesize 2MB. Accepted format: jpg, png." title="Recommended size 1728x684px. Max filesize 2MB. Accepted format: jpg, png." label="Image tablet" acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormFile setForm={setForm} name="meta.image.banner_apps_image_mobile" type="image" size="large" aspectRatio="8/4" footnote="Recommended size 732x374px. Max filesize 2MB. Accepted format: jpg, png." title="Recommended size 732x374px. Max filesize 2MB. Accepted format: jpg, png." label="Image mobile" acceptedFormat={[ `.jpg`, `.png` ]} />
													</div>
												)
											}
										]}
									/>
									{/* <TabsNavigation
										listLabel={[ `EN`, `ID` ]}
										content={[
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly watch={watch(`meta.text.banner_apps_title.en`)} setValue={setValue} getValues={getValues} name="meta.text.banner_apps_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly watch={watch(`meta.text.banner_apps_title.id`)} setValue={setValue} getValues={getValues} name="meta.text.banner_apps_title.id" label="Title (ID)" />
													</div>
												)
											}
										]}
									/> */}
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.banner_apps_link" label="Link" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Our Services Info</h2>
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.service_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.service_title.id" label="Title (ID)" />
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.service_subtitle.en" label="Subtitle (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.service_subtitle.id" label="Subtitle (ID)" />
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
							<h2 className="title">Our Services Banner</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormRepeater
											setForm={setForm}
											name="meta.repeater.service"
											inputNames={[ `image`, `image_layer`, `service_id`, `image_alt`, `title.id`, `title.en`, `desc.id`, `desc.en` ]}
											inputTypes={[ `image`, `image`, `select`, `text`, `text`, `text`, `textarea`, `textarea` ]}
											inputLabels={[ `Image`, `Image Layer`, `Service`, `Image Alt`, `Text (ID)`, `Text (EN)`, `Content (ID)`, `Content (EN)` ]}
											inputWidths={[ `10%`, `10%`, `auto` ]}
											inputShown={3}
											inputProps={[
												{
													size: `medium`,
													aspectRatio: `14/18`,
													title: `Recommended size 814x1086px. Max filesize 2MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 814x1086px. Max filesize 2MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true
												},
												{
													size: `medium`,
													aspectRatio: `14/18`,
													title: `Recommended size 814x1086px. Max filesize 2MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 814x1086px. Max filesize 2MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true
												},
												{
													options: (
														pageServiceData?.data?.page_sub?.map((service) => (
															{ value: String(service.page_id), label: service.page_title }
														))
													),
													placeholder: `Service Category`
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
							<h2 className="title">Latest News</h2>
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
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.latest_news_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwygColorPickerOnly setForm={setForm} name="meta.text.latest_news_title.id" label="Title (ID)" />
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
							<h2 className="title">Health Article Post</h2>
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
														<FormInput setForm={setForm} name="meta.text.health_article_title.en" label="Title (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.health_article_title.id" label="Title (ID)" />
													</div>
												)
											}
										]}
									/>
									<div className="row">
										<FormRepeater
											setForm={setForm}
											name="health_article"
											inputNames={[ `id` ]}
											inputTypes={[ `select` ]}
											inputLabels={[ `Post` ]}
											inputWidths={[ `100%` ]}
											inputProps={[
												{
													options: postList?.data?.map((item) => ({ value: Number(item.id), label: item.title })),
													placeholder: `Post Article`
												}
											]}
											max={100}
											inputShown={1}
											sortable
										/>
									</div>
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