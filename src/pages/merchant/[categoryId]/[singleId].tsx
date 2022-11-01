import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import * as yup from "yup"
import { useContext, useEffect, useState } from "react"
import { deleteData, postData } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import IconSidebar from 'public/assets/icons/icon-sidebar.svg'
import { useForm } from "react-hook-form"
import { DashboardContext } from "@contexts/DashboardContext.context"
import FormInput from "@components/form/FormInput.component"
import TabsNavigation from "@components/util/Tabs.component"
import { useRouter } from "next/router"
import FormFile from "@components/form/FormFile.component"
import FormWysiwyg from "@components/form/FormWysiwyg.component"
import useLoading from "@hooks/useLoading.hook"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import EiPopup from "@components/ei/EiPopup.component"

export function getServerSideProps({ query }) {
	return {
		props: {
			categoryId: query.categoryId,
			singleId: query.singleId
		}
	}
}

export default function MerchantSingleDetail({ categoryId, singleId }) {
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
	const [ showSidebar, setShowSidebar ] = useState(false)
	const [ deletePopup, setDeletePopup ] = useState(false)
	const { data: mainPageData } = useGetData(`/page/${categoryId}`)
	const { data: pageData, isLoading } = useGetData(`/page/${singleId}`)
	useLoading(isLoading)

	const setForm = useForm({
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
				text: `Single has been added!`
			} })
		} catch (err) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, single cannot be added!`
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
				text: `Single has been deleted!`
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
	}, [ pageData ])

	if (!pageData?.data || !mainPageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title={pageData?.data?.page_title}
					legend="merchant"
					parent={<><Link href={breadcrumb[0]}>Category</Link> / <Link href={breadcrumb[1]}>{mainPageData?.data?.page_title}</Link></>}
					action={
						<Access
							auth="write:merchant-mymerchant"
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
						<div className="admin-section-head">
							<h2 className="title">General</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormFile setForm={setForm} name="page_image" type="image" label="Background image" size="large" aspectRatio="15/4" footnote="Recommended size 1920x1080px. Max filesize 3MB. Accepted format: jpg, png." title="Recommended size 1920x1080px. Max filesize 3MB. Accepted format: jpg, png." acceptedFormat={[ `.jpg`, `.png` ]} />
									</div>
									<div className="row">
										<FormFile
											setForm={setForm}
											type="image"
											name="meta.image.merchant_logo"
											size="medium"
											aspectRatio="10/6"
											title="Recommended size 400x180px. Max filesize 3MB. Accepted format: jpg, png."
											footnote="Recommended size 400x180px. Max filesize 3MB. Accepted format: jpg, png."
											acceptedFormat={[ `.jpg`, `.png` ]}
										/>
									</div>
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
														<FormInput setForm={setForm} name="meta.text.content_title.en" label="Content Title (EN)"/>
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormInput setForm={setForm} name="meta.text.content_title.id" label="Content Title (ID)" />
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
														<FormWysiwyg setForm={setForm} name="meta.text.content_desc.en" label="Content Description (EN)" />
													</div>
												)
											},
											{
												item: (
													<div className="row">
														<FormWysiwyg setForm={setForm} name="meta.text.content_desc.id" label="Content Description (ID)" />
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
							<h2 className="title">Contact</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.phone" label="Phone" placeholder="e.g +6221 2854 1515" />
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.email" label="Email" placeholder="e.g email@gmail.com" />
									</div>
									<div className="row">
										<TabsNavigation
											listLabel={[ `EN`, `ID` ]}
											content={[
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="meta.text.address_title.en" label="Address Title (EN)" />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="meta.text.address_title.id" label="Address Title (ID)" />
														</div>
													)
												}
											]}
										/>
									</div>
									<div className="row">
										<FormInput setForm={setForm} name="meta.text.map" label="Map URL" />
									</div>
									<div className="row">
										<FormWysiwyg setForm={setForm} name="meta.text.address_detail" label="Detail Address" />
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

MerchantSingleDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}