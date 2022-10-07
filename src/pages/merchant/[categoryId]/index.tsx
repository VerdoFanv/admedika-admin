import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import * as yup from "yup"
import IconPlus from "public/assets/icons/icon-plus.svg"
import { useContext, useEffect, useState } from "react"
import { postData, deleteData } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { DashboardContext } from "@contexts/DashboardContext.context"
import FormInput from "@components/form/FormInput.component"
import TabsNavigation from "@components/util/Tabs.component"
import { useRouter } from "next/router"
import useLoading from "@hooks/useLoading.hook"
import Subpage from "../SubPage.component"
import FormCheck from "@components/form/FormCheck.component"
import EiPopup from "@components/ei/EiPopup.component"

export default function MerchantCategoryDetail() {
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
	const [ deletePopup, setDeletePopup ] = useState(false)
	const { breadcrumb, currentPath } = useCurrentPath()
	const { dispatch } = useContext(DashboardContext)
	const { categoryId } = router.query

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${categoryId}`)
	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${categoryId}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
			})
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Category has been updated!`
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
					legend="merchant"
					title={pageData?.data?.page_title}
					parent={<Link href={breadcrumb[0]}>Category</Link>}
					action={
						<Access
							auth="write:merchant-mymerchant"
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
									<div className="row">
										<FormCheck setForm={setForm} name="page_status" label="Active" type="checkbox"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Single</h2>
							<Access
								auth="write:merchant-mymerchant"
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
							<Subpage subpages={pageData.data.page_sub} currentPath={currentPath} />
							}
						</div>
					</div>
				</section>
			</div>
		</form>
	)
}

MerchantCategoryDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}