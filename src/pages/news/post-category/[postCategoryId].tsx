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
import FormSelect from "@components/form/FormSelect.component"
import useLoading from "@hooks/useLoading.hook"

export function getServerSideProps({ query }) {
	return {
		props: {
			postCategoryId: query.postCategoryId
		}
	}
}

export default function NewsPostCategoryDetail({ postCategoryId }) {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pcl_name: yup.object({
			id: yup.string().required(`Name (ID) is required`)
		})
	}) : yup.object({
		pcl_name: yup.object({
			en: yup.string().required(`Name (EN) is required`)
		})
	})
	const router = useRouter()
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ showSidebar, setShowSidebar ] = useState(false)
	const [ deletePopup, setDeletePopup ] = useState(false)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/post-category/${postCategoryId}`)
	const { data: postCategory } = useGetData(`/list/post-by-category/${postCategoryId}`)
	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/post-category/${postCategoryId}/update`, {
				...data,
				post_cat_status: data.post_cat_status === true ? 1 : 2,
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
			await deleteData(`/post-category/${postCategoryId}/delete`)
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
				post_cat_status: pageData?.data?.post_cat_status === 1 ? true : false
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
						title={`${pageData?.data?.post_cat_name}`}
						parent={<><Link href={breadcrumb[1]}>Post Category</Link></>}
						action={
							<Access
								auth="write:news-post-category"
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
										<TabsNavigation
											listLabel={[ `Desktop`, `Tablet`, `Mobile` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormFile setForm={setForm} name="post_cat_image" type="image" label="Background desktop image" size="large" aspectRatio="15/4" footnote="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 3840x1012px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormFile setForm={setForm} name="post_cat_image_tablet" type="image" label="Background tablet image" size="large" aspectRatio="11/4" footnote="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 2048x764px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormFile setForm={setForm} name="post_cat_image_mobile" type="image" label="Background mobile image" size="large" aspectRatio="9/4" footnote="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 828x376px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
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
															<FormInput setForm={setForm} name="pcl_name.en" label="Name (EN)" error={errors.pcl_name?.en} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="pcl_name.id" label="Name (ID)" error={errors.pcl_name?.id} />
														</div>
													)
												}
											]}
										/>
										<div className="row">
											<FormSelect setForm={setForm} options={postCategory?.data?.map((item) => ({ value: String(item.id), label: item.title }))} name="meta.text.featured_post_id" label="Featured Post" />
										</div>
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
			{page}
		</Dashboard>
	)
}