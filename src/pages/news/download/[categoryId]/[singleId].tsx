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
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import FormWysiwygColorPickerOnly from "@components/form/FormWysiwygColorPickerOnly.component"
import FormCheck from "@components/form/FormCheck.component"
import { useRouter } from "next/router"
import useLoading from "@hooks/useLoading.hook"
import AdminMissing from "@components/admin/AdminMissing.component"
import EiPopup from "@components/ei/EiPopup.component"

export default function NewsDownloadSingleNew() {
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
	const { categoryId, singleId } = router.query

	const { data: pageParentData } = useGetData(`/page/${categoryId}`)
	const { data: pageData, isLoading } = useGetData(`/page/${singleId}`)
	const { dispatch } = useContext(DashboardContext)
	const [ deletePopup, setDeletePopup ] = useState(false)
	useLoading(isLoading)

	const setForm = useForm<any>({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${singleId}/update`, {
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
			await deleteData(`/page/${singleId}/delete`)
			setDeletePopup(false)
			dispatch({ type: `show_notification`, payload: {
				type: `info`,
				text: `Page has been deleted!`
			} })
			router.push(breadcrumb[2])
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

	if (!pageData?.data || !pageParentData?.data) return <></>

	return (
		pageData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						legend="news"
						title={pageData?.data?.page_title}
						parent={<><Link href={breadcrumb[1]}>Download Corner</Link> / <Link href={breadcrumb[2]}>{pageParentData?.data?.page_title}</Link></>}
						action={
							<Access
								auth="write:news-download"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Single</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Single</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this single? This action cannot be undone.</p>
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
											<FormFile setForm={setForm} name="page_image" type="image" label="Thumbnail" size="medium" aspectRatio="5/5" footnote="Recommended size 144x144px. Max filesize 2MB. Accepted format: jpg, png." title="Recommended size 144x144px. Max filesize 2MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
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
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormWysiwygColorPickerOnly setForm={setForm} name="pl_content.en" label="Content (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormWysiwygColorPickerOnly setForm={setForm} name="pl_content.id" label="Content (ID)" />
														</div>
													)
												}
											]}
										/>
										<div className="row">
											<FormFile setForm={setForm} name="meta.file.download" type="file" label="File" size="large" aspectRatio="15/4" footnote="Max size 4MB, Accepted format: pdf." acceptedFormat={[ `.pdf` ]} />
										</div>
										<div className="row">
											<FormInput setForm={setForm} name="meta.file.download" label="File URL" disabled/>
										</div>
										<div className="row">
											<FormCheck setForm={setForm} name="page_status" type="checkbox" label="Publish" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</form>
		)
	)
}

NewsDownloadSingleNew.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}