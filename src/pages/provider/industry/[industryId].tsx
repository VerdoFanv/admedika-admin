import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import FormInput from "@components/form/FormInput.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import { yupResolver } from "@hookform/resolvers/yup"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import { deleteData, postData } from "@utils/fetcher"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import TabsNavigation from "@components/util/Tabs.component"
import * as yup from "yup"
import AdminMissing from "@components/admin/AdminMissing.component"
import EiPopup from "@components/ei/EiPopup.component"
import useLoading from "@hooks/useLoading.hook"
import FormCheck from "@components/form/FormCheck.component"

export function getServerSideProps({ query }) {
	return {
		props: {
			industryId: query.industryId
		}
	}
}

export default function NewsPostCategoryDetail({ industryId }) {
	const { data: settingGeneralData } = useGetData(`/setting-general`)
	const schema = settingGeneralData?.data?.text?.language === `id` ? yup.object({
		pcil_name: yup.object({
			id: yup.string().required(`Name (ID) is required`)
		})
	}) : yup.object({
		pcil_name: yup.object({
			en: yup.string().required(`Name (EN) is required`)
		})
	})
	const router = useRouter()
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ deletePopup, setDeletePopup ] = useState(false)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/provider-client-industry/${industryId}`)
	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/provider-client-industry/${industryId}/update`, {
				...data,
				pci_status: data.pci_status === true ? 1 : 2,
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
			await deleteData(`/provider-client-industry/${industryId}/delete`)
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
				pci_status: pageData?.data?.pci_status === 1 ? true : false
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
						legend="provider"
						title={pageData?.data?.pci_name}
						parent={<><Link href={breadcrumb[1]}>Clients Industry</Link></>}
						action={
							<Access
								auth="write:news-post-category"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Industry</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Industry</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this industry? This action cannot be undone.</p>
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
															<FormInput setForm={setForm} name="pcil_name.en" label="Name (EN)" error={errors.pcil_name?.en} />
														</div>
													)
												},
												{
													item: (
														<div className="row">
															<FormInput setForm={setForm} name="pcil_name.id" label="Name (ID)" error={errors.pcil_name?.id} />
														</div>
													)
												}
											]}
										/>
										<div className="row">
											<FormCheck setForm={setForm} name="pci_status" type="checkbox" label="Active" />
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

NewsPostCategoryDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}