import AdminHeader from "@components/admin/AdminHeader.component"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPopup from "@components/ei/EiPopup.component"
import FormFile from "@components/form/FormFile.component"
import FormInput from "@components/form/FormInput.component"
import FormTextarea from "@components/form/FormTextarea.component"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { deleteData, postData } from "@utils/fetcher"
import Link from "next/link"
import { useRouter } from "next/router"
import IconSidebar from "public/assets/icons/icon-sidebar.svg"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import FormRepeater from "@components/form/FormRepeater.component"
import AdminMissing from "@components/admin/AdminMissing.component"

export function getServerSideProps({ query }) {
	return {
		props: {
			subpageId: query.subpageId
		}
	}
}
export default function AboutSubpage({ subpageId }) {
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
	const router = useRouter()
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ deletePopup, setDeletePopup ] = useState(false)
	const [ showSidebar, setShowSidebar ] = useState(false)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${subpageId}`)
	useLoading(pageIsLoading)

	async function handleDeleteSubpage() {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/page/${subpageId}/delete`)
			setDeletePopup(false)
			dispatch({ type: `show_notification`, payload: {
				type: `info`,
				text: `Page has been deleted!`
			} })
			router.push(breadcrumb[0])
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, something went wrong!`,
				footnote: error.message
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
	}

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${subpageId}/update`, {
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
		pageData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						title={`${pageData?.data?.page_title}`}
						parent={<><Link href={breadcrumb[0]}>About Us</Link></>}
						action={
							<Access
								auth="write:about"
								yes={
									<ul className="actions">
										{pageData?.data?.page_type !== `about-milestone` && pageData?.data?.page_type !== `about-awards` && (
											<li className="action">
												<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Subpage</button>
												<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
													<div className="popup-confirm">
														<div className="popup-confirm-head">
															<h4 className="title">Delete Subpage</h4>
														</div>
														<div className="popup-confirm-body">
															<p>Are you sure about deleting this subpage? This action cannot be undone.</p>
														</div>
														<div className="popup-confirm-action">
															<ul className="items">
																<li className="item">
																	<button type="button" onClick={() => setDeletePopup(false)} className="button">Cancel</button>
																	<button type="button" onClick={handleDeleteSubpage} className="button button-alert">Delete</button>
																</li>
															</ul>
														</div>
													</div>
												</EiPopup>
											</li>
										)}
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
										{pageData?.data?.page_type !== `about-awards` && (
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
										)}
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
										<div className="row">
											<FormInput setForm={setForm} name="page_sort_order" label="Page order (#)" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					{pageData?.data?.meta?.repeater?.milestone && (
						<section className="section">
							<div className="admin-section">
								<div className="admin-section-head">
									<h1 className="title">Milestone</h1>
								</div>
								<div className="admin-section-body admin-section-body-gray">
									<div className="form-fieldset">
										<div className="form-fieldset-body">
											<FormRepeater
												setForm={setForm}
												name="meta.repeater.milestone"
												inputNames={[ `title.id`, `title.en`, `desc.id`, `desc.en`, `year` ]}
												inputTypes={[ `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only`, `text` ]}
												inputLabels={[ `Title (ID)`, `Title (EN)`, `Desc (ID)`, `Desc (EN)`, `Year` ]}
												inputShown={2}
												inputWidths={[ `auto` ]}
												sortable
											/>
										</div>
									</div>
								</div>
							</div>
						</section>
					)}
					{pageData?.data?.meta?.repeater?.awards && pageData?.data?.meta?.repeater?.certification && (
						<>
							<section className="section">
								<div className="admin-section">
									<div className="admin-section-head">
										<h1 className="title">Awards</h1>
									</div>
									<div className="admin-section-body admin-section-body-gray">
										<div className="form-fieldset">
											<div className="form-fieldset-body">
												<FormRepeater
													setForm={setForm}
													name="meta.repeater.awards"
													inputNames={[ `image`, `image_alt`, `title.id`, `title.en` ]}
													inputTypes={[ `image`, `text`, `text`, `text` ]}
													inputLabels={[ `Image`, `Image Alt`, `Title (ID)`, `Title (EN)` ]}
													inputShown={2}
													inputWidths={[ `20%`, `auto` ]}
													inputProps={[
														{
															size: `large`,
															aspectRatio: `10/6`,
															title: `Recommended size 240x124px. Max filesize 2MB. Accepted format: jpg, png.`,
															footnote: `Recommended size 240x124px. Max filesize 2MB. Accepted format: jpg, png.`,
															styleNoButton: true,
															styleNoPlaceholder: true
														}
													]}
													sortable
												/>
											</div>
										</div>
									</div>
								</div>
							</section>
							<section className="section">
								<div className="admin-section">
									<div className="admin-section-head">
										<h1 className="title">Certification</h1>
									</div>
									<div className="admin-section-body admin-section-body-gray">
										<div className="form-fieldset">
											<div className="form-fieldset-body">
												<FormRepeater
													setForm={setForm}
													name="meta.repeater.certification"
													inputNames={[ `image`, `image_alt`, `title.id`, `title.en` ]}
													inputTypes={[ `image`, `text`, `text`, `text` ]}
													inputLabels={[ `Image`, `Image Alt`, `Title (ID)`, `Title (EN)` ]}
													inputShown={2}
													inputWidths={[ `20%`, `auto` ]}
													inputProps={[
														{
															size: `large`,
															aspectRatio: `10/6`,
															title: `Recommended size 167x120px. Max filesize 2MB. Accepted format: jpg, png.`,
															footnote: `Recommended size 167x120px. Max filesize 2MB. Accepted format: jpg, png.`,
															styleNoButton: true,
															styleNoPlaceholder: true
														}
													]}
													sortable
												/>
											</div>
										</div>
									</div>
								</div>
							</section>
						</>
					)}
					{/* {pageData?.data?.meta?.text?.vision_title && pageData?.data?.meta?.text?.vision_quotes && pageData?.data?.meta?.text?.vision_content && (
						<section className="section">
							<div className="admin-section">
								<div className="admin-section-head">
									<h1 className="title">Vision & Mission</h1>
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
																<FormInput setForm={setForm} name="meta.text.vision_title.en" label="Title (EN)" />
															</div>
														)
													},
													{
														item: (
															<div className="row">
																<FormInput setForm={setForm} name="meta.text.vision_title.id" label="Title (ID)" />
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
																<FormTextarea setForm={setForm} name="meta.text.vision_quotes.en" label="Quotes (EN)" />
															</div>
														)
													},
													{
														item: (
															<div className="row">
																<FormTextarea setForm={setForm} name="meta.text.vision_quotes.id" label="Quotes (ID)" />
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
																<FormWysiwyg setForm={setForm} name="meta.text.vision_content.en" label="Content (EN)" />
															</div>
														)
													},
													{
														item: (
															<div className="row">
																<FormWysiwyg setForm={setForm} name="meta.text.vision_content.id" label="Content (ID)" />
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
					)}
					{pageData?.data?.meta?.text?.ownership_title && pageData?.data?.meta?.text?.ownership_quotes && pageData?.data?.meta?.text?.ownership_content && (
						<section className="section">
							<div className="admin-section">
								<div className="admin-section-head">
									<h1 className="title">Ownership Structure</h1>
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
																<FormInput setForm={setForm} name="meta.text.ownership_title.en" label="Title (EN)" />
															</div>
														)
													},
													{
														item: (
															<div className="row">
																<FormInput setForm={setForm} name="meta.text.ownership_title.id" label="Title (ID)" />
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
																<FormTextarea setForm={setForm} name="meta.text.ownership_quotes.en" label="Quotes (EN)" />
															</div>
														)
													},
													{
														item: (
															<div className="row">
																<FormTextarea setForm={setForm} name="meta.text.ownership_quotes.id" label="Quotes (ID)" />
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
																<FormWysiwyg setForm={setForm} name="meta.text.ownership_content.en" label="Content (EN)" />
															</div>
														)
													},
													{
														item: (
															<div className="row">
																<FormWysiwyg setForm={setForm} name="meta.text.ownership_content.id" label="Content (ID)" />
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
					)} */}
				</div>

				<AdminPageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
			</form>
		)
	)
}

AboutSubpage.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}