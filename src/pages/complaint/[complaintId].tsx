import AdminHeader from "@components/admin/AdminHeader.component"
import AdminMissing from "@components/admin/AdminMissing.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPopup from "@components/ei/EiPopup.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { formatDate } from "@utils/date"
import { deleteData } from "@utils/fetcher"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"

export function getServerSideProps({ query }) {
	return {
		props: {
			complaintId: query.complaintId
		}
	}
}

export default function ComplaintDetail({ complaintId }) {
	const router = useRouter()
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ deletePopup, setDeletePopup ] = useState(false)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/complaint/${complaintId}`)
	useLoading(pageIsLoading)

	async function handleDeleteSubpage() {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/complaint/${complaintId}/delete`)
			setDeletePopup(false)
			dispatch({ type: `show_notification`, payload: {
				type: `info`,
				text: `Message has been deleted!`
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

	if (!pageData?.data) return <></>

	return (
		pageData?.status_code === 404 ? (
			<AdminMissing />
		) : (
			<div className="admin-page">
				<header className="admin-page-header">
					<AdminHeader
						title={`${pageData?.data?.complaint_name}`}
						parent={<Link href={breadcrumb[0]}>Complaint</Link>}
						action={
							<Access
								auth="write:complaint-mymerchant"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Complaint</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Complaint</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this complaint? This action cannot be undone.</p>
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
								<h2 className="title">Message</h2>
							</div>
							<div className="admin-section-body admin-section-body-gray">
								<div className="data-fieldset">
									<div className="data-fieldset-body">
										<div className="row">
											<p className="label">Name</p>
											<p className="value">{pageData?.data?.complaint_name}</p>
										</div>
										<div className="row">
											<p className="label">Mobile Phone</p>
											<p className="value">{pageData?.data?.complaint_email}</p>
										</div>
										<div className="row">
											<p className="label">Email</p>
											<p className="value">{pageData?.data?.complaint_merchant_name}</p>
										</div>
										<div className="row">
											<p className="label">Message</p>
											<p className="value value-area">{pageData?.data?.complaint_message}</p>
										</div>
										<div className="row">
											<p className="label">Submit At</p>
											<p className="value">{formatDate(pageData?.data?.complaint_created_at, `DD/MM/YYYY HH:mm`)}</p>
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

ComplaintDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}