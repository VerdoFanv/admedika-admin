import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import IconSidebar from "public/assets/icons/icon-sidebar.svg"
import * as yup from "yup"
import { useContext, useEffect, useState } from "react"
import { deleteData, postData } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { DashboardContext } from "@contexts/DashboardContext.context"
import FormInput from "@components/form/FormInput.component"
import TabsNavigation from "@components/util/Tabs.component"
import FormFile from "@components/form/FormFile.component"
import FormRepeater from "@components/form/FormRepeater.component"
import { useRouter } from "next/router"
import AdminMissing from "@components/admin/AdminMissing.component"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import EiPopup from "@components/ei/EiPopup.component"

export function getServerSideProps({ query }) {
	return {
		props: {
			categoryId: query.categoryId
		}
	}
}

export default function NewsFaqCategoryDetail({ categoryId }) {
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
	const router = useRouter()
	const { dispatch } = useContext(DashboardContext)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const [ showSidebar, setShowSidebar ] = useState(false)
	const [ deletePopup, setDeletePopup ] = useState(false)
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading } = useGetData(`/page/${categoryId}`)
	useLoading(isLoading)

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

	async function handleDeleteSubpage() {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/page/${categoryId}/delete`)
			setDeletePopup(false)
			dispatch({ type: `show_notification`, payload: {
				type: `info`,
				text: `Page has been deleted!`
			} })
			router.push(breadcrumb[1])
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, something went wrong!`,
				footnote: error.message
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
						title={pageData?.data?.page_title}
						legend="news"
						parent={<><Link href={breadcrumb[1]}>FAQ</Link></>}
						action={
							<Access
								auth="write:news-faq"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Category</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Category</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this category? This action cannot be undone.</p>
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
										<li className="action">
											<button type="submit" className="button button-small">Save</button>
										</li>
										<li className="action">
											<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
										</li>
									</ul>
								}
								no={
									<li className="action">
										<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
									</li>
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
							<div className="admin-section-body admin-section-body-gray">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormRepeater
												setForm={setForm}
												name="meta.repeater.qna"
												inputNames={[ `question.id`, `question.en`, `answer.id`, `answer.en` ]}
												inputTypes={[ `text`, `text`, `textarea`, `textarea` ]}
												inputLabels={[ `Question (ID)`, `Question (EN)`, `Answer (ID)`, `Answer (EN)` ]}
												inputWidths={[ `100%` ]}
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

				<AdminPageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
			</form>
		)
	)
}

NewsFaqCategoryDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}