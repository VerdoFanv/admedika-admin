import AdminHeader from "@components/admin/AdminHeader.component"
import AdminMissing from "@components/admin/AdminMissing.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPopup from "@components/ei/EiPopup.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { deleteData } from "@utils/fetcher"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"

export default function ContactListId() {
	const router = useRouter()
	const { listId } = router.query
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ deletePopup, setDeletePopup ] = useState(false)

	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/service-user-download/${listId}`)
	useLoading(pageIsLoading)

	async function handleDeleteSubpage() {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/service-user-download/${listId}/delete`)
			setDeletePopup(false)
			dispatch({ type: `show_notification`, payload: {
				type: `info`,
				text: `Message has been deleted!`
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

	if (!pageData?.data) return <></>

	return (
		pageData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<div className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						legend="Services"
						title={`${pageData?.data?.sud_name}`}
						parent={<Link href="/services/download">Download List</Link>}
						action={
							<Access
								auth="write:services-download-list"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Record</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Record</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this record? This action cannot be undone.</p>
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
								<h2 className="title">Content</h2>
							</div>
							<div className="admin-section-body admin-section-body-gray">
								<div className="data-fieldset">
									<div className="data-fieldset-body">
										<div className="row">
											<p className="label">name</p>
											<p className="value strong">
												{pageData?.data?.sud_name}
											</p>
										</div>
										<div className="row">
											<p className="label">Email</p>
											<p className="value">{pageData?.data?.sud_email}</p>
										</div>
										<div className="row">
											<p className="label">Company</p>
											<p className="value">{pageData?.data?.sud_company}</p>
										</div>
										<div className="row">
											<p className="label">Service</p>
											<p className="value">{pageData?.data?.sud_service}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		)
	)
}

ContactListId.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}