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

export function getServerSideProps({ query }) {
	return {
		props: {
			listId: query.listId
		}
	}
}

export default function CareerListDetail({ listId }) {
	const router = useRouter()
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ deletePopup, setDeletePopup ] = useState(false)

	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/career/${listId}`)
	useLoading(pageIsLoading)

	async function handleDeleteSubpage() {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/career/${listId}/delete`)
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
						legend="career"
						title={`${pageData?.data?.career_name}`}
						parent={<Link href="/career/list">Apply List</Link>}
						action={
							<Access
								auth="write:career-list"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Application</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Application</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this application? This action cannot be undone.</p>
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
								<h2 className="title">Apply Content</h2>
							</div>
							<div className="admin-section-body admin-section-body-gray">
								<div className="data-fieldset">
									<div className="data-fieldset-body">
										<div className="row">
											<p className="label">Name</p>
											<p className="value strong">{pageData?.data?.career_name}</p>
										</div>
										<div className="row">
											<p className="label">Email</p>
											<p className="value">{pageData?.data?.career_email}</p>
										</div>
										<div className="row">
											<p className="label">Mobile Phone</p>
											<p className="value">{pageData?.data?.career_phone}</p>
										</div>
										<div className="row">
											<p className="label">Address</p>
											<p className="value value-area">{pageData?.data?.career_address}</p>
										</div>
										<div className="row">
											<p className="label">Position</p>
											<p className="value">{pageData?.data?.career_position}</p>
										</div>
										<div className="row">
											<p className="label">Division</p>
											<p className="value">{pageData?.data?.career_division}</p>
										</div>
										<div className="row">
											<a target="blank" href={pageData?.data?.career_cv} className="button button-primary">View CV File</a>
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

CareerListDetail.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}