import AdminHeader from "@components/admin/AdminHeader.component"
import AdminMissing from "@components/admin/AdminMissing.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPopup from "@components/ei/EiPopup.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { deleteData, postOptimisticData } from "@utils/fetcher"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { useSWRConfig } from "swr"

export function getServerSideProps({ query }) {
	return {
		props: {
			listId: query.listId
		}
	}
}

export default function ContactListId({ listId }) {
	const router = useRouter()
	const { breadcrumb } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ deletePopup, setDeletePopup ] = useState(false)

	const { mutate } = useSWRConfig()
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/contact-us/${listId}`)
	useLoading(pageIsLoading)

	async function handleDeleteSubpage() {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await deleteData(`/contact-us/${listId}/delete`)
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

	async function handleUpdateStatus(status) {
		dispatch({ type: `set_isLoading`, payload: true })

		const payload = {
			...pageData.data,
			contact_us_is_read: status,
		}

		try {
			await postOptimisticData(`/contact-us/${listId}/update`, payload, mutate, `/contact-us/${listId}`, pageData)
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Message has been updated!`
			} })
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, message cannot be updated!`,
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
						legend="Contact"
						title={`${pageData?.data?.contact_us_name}`}
						parent={<Link href="/contact/list">Message List</Link>}
						backlink="/contact/list"
						action={
							<Access
								auth="write:contact-list"
								yes={
									<ul className="actions">
										<li className="action">
											<button type="button" onClick={() => setDeletePopup(true)} className="button button-small button-alert">Delete Message</button>
											<EiPopup isShown={deletePopup} close={() => setDeletePopup(false)} closeIcon>
												<div className="popup-confirm">
													<div className="popup-confirm-head">
														<h4 className="title">Delete Message</h4>
													</div>
													<div className="popup-confirm-body">
														<p>Are you sure about deleting this message? This action cannot be undone.</p>
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
											{pageData.data.contact_us_is_read === 0 ?
												<button type="button" onClick={() => handleUpdateStatus(1)} className="button button-alt button-small">Mark Read</button>
												:
												<button type="button" onClick={() => handleUpdateStatus(0)} className="button button-alt button-small">Mark Unread</button>
											}
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
								<h2 className="title">Message Content</h2>
							</div>
							<div className="admin-section-body admin-section-body-gray">
								<div className="data-fieldset">
									<div className="data-fieldset-body">
										<div className="row">
											<p className="label">Sender Information</p>
											<p className="value strong">
												{pageData?.data?.contact_us_title} {pageData?.data?.contact_us_name}
												{pageData?.data?.contact_us_is_existing_customer === 1 &&
											<span className="badge badge-green">Existing Customer</span>
												}
											</p>
											{pageData?.data?.contact_us_company &&
										<p className="value strong">{pageData?.data?.contact_us_company}</p>
											}
										</div>
										<div className="row">
											<p className="label">Mobile Phone</p>
											<p className="value">{pageData?.data?.contact_us_phone}</p>
										</div>
										<div className="row">
											<p className="label">Email</p>
											<p className="value">{pageData?.data?.contact_us_email}</p>
										</div>
										<div className="row">
											<p className="label">Department</p>
											<p className="value">{pageData?.data?.contact_us_department}</p>
										</div>
										<div className="row">
											<p className="label">Message</p>
											<p className="value value-area">{pageData?.data?.contact_us_message}</p>
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