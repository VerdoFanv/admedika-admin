import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormFile from "@components/form/FormFile.component"
import FormInput from "@components/form/FormInput.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import { deleteData, postData } from "@utils/fetcher"
import Link from "next/link"
import { useRouter } from "next/router"
import IconSidebar from "public/assets/icons/icon-sidebar.svg"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import AdminMissing from "@components/admin/AdminMissing.component"
import EiPopup from "@components/ei/EiPopup.component"
import PageSidebar from "./pageSideBar"
import useLoading from "@hooks/useLoading.hook"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
import FormSelect from "@components/form/FormSelect.component"
import { formatDate } from "@utils/date"
import FormDatepicker from "@components/form/FormDatepicker.component"

export default function NewsPostCategoryDetail() {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pl_title: yup.object({
			id: yup.string().required(`Title (ID) is required`)
		}),
		post_category_name: yup.string().required(`Category is required`)
	}) : yup.object({
		pl_title: yup.object({
			en: yup.string().required(`Title (EN) is required`)
		}),
		post_category_name: yup.string().required(`Category is required`)
	})
	const router = useRouter()
	const { postId } = router.query
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ showSidebar, setShowSidebar ] = useState(false)
	const [ deletePopup, setDeletePopup ] = useState(false)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/post/${postId}`)
	const { data: postCategory } = useGetData(`/post-category`)
	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			const postCatId = postCategory.data.find((item) => item.post_cat_name === data.post_category_name)
			delete data.post_category_name
			await postData(`/post/${postId}/update`, {
				...data,
				post_status: data.post_status === true ? 1 : 2,
				post__post_cat_id: postCatId.post_cat_id,
				post_publish_at: formatDate(data.post_publish_at, `YYYY-MM-DD HH:mm`),
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
			await deleteData(`/post/${postId}/delete`)
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
				post_status: pageData?.data?.post_status === 1 ? true : false
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
						legend="news"
						title={`${pageData?.data?.post_title}`}
						parent={<><Link href={breadcrumb[1]}>Posts</Link></>}
						action={
							<Access
								auth="write:news-post-category"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Post</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Post</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this post? This action cannot be undone.</p>
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
							<div className="admin-section-body admin-section-body-gray">
								<div className="form-fieldset">
									<div className="form-fieldset-body">
										<div className="row">
											<FormFile setForm={setForm} name="post_image" type="image" label="Post image" size="large" aspectRatio="7/4" footnote="Recommended size 1729x976px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 1729x976px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
										</div>
										<div className="row">
											<FormFile setForm={setForm} name="post_thumbnail" type="image" label="Thumbnail image" size="medium" aspectRatio="5/4" footnote="Recommended size 1240x930px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 1240x930px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
										</div>
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
										{ /* <TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="pl_excerpt.en" label="Excerpt (EN)" error={errors.pl_excerpt?.en} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="pl_excerpt.id" label="Excerpt (ID)" error={errors.pl_excerpt?.id} />
														</div>
													)
												}
											]}
										/> */ }
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormWysiwyg setForm={setForm} name="pl_content.en" label="Content (EN)" error={errors.pl_content?.en} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormWysiwyg setForm={setForm} name="pl_content.id" label="Content (ID)" error={errors.pl_content?.id} />
														</div>
													)
												}
											]}
										/>
										<div className="row">
											<FormSelect setForm={setForm} name="post_category_name" options={postCategory?.data?.map((item) => ({ value: String(item.post_cat_name), label: item.post_cat_name }))} label="Post category" error={errors?.post_category_name} />
										</div>
										<div className="row">
											<FormDatepicker setForm={setForm} name="post_publish_at" valueType="string" dateFormat="yyyy-MM-dd HH:mm" />
										</div>
										{ /* <div className="row">
											<FormSelect setForm={setForm} name="post_tags" options={[]} label="Tags" isMulti />
										</div> */ }
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>

				<PageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
			</form>
		)
	)
}

NewsPostCategoryDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{ page }
		</Dashboard>
	)
}