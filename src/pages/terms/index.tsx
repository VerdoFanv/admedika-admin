import AdminHeader from "@components/admin/AdminHeader.component"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import AdminSubpage from "@components/admin/AdminSubpage.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import Link from "next/link"
import IconPlus from "public/assets/icons/icon-plus.svg"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import { useContext, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import useCurrentPath from "@hooks/useCurrentPath.hook"
import { pageId } from "@variables/pageId.variable"

export default function Terms() {
	const { dispatch } = useContext(DashboardContext)
	const { currentPath } = useCurrentPath()
	const setForm = useForm()
	const { reset, handleSubmit } = setForm
	const [ showSidebar, setShowSidebar ] = useState(false)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${pageId[`terms`]}`)
	useLoading(pageIsLoading)

	const onSubmit = async (data: any) => {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/page/${pageId[`terms`]}/update`, {
				...data,
				page_status: data.page_status === true ? 1 : 2,
				page_type: pageData.data.page_type,
			})
			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Page has been updated!`
			} })
		} catch {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, page cannot be updated!`
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
	}, [ reset, pageData ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Terms"
				/>
			</header>
			<div className="admin-page-content">
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Subpages</h2>
							<Access
								auth="write:about"
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
							<AdminSubpage subpages={pageData.data[`page_sub`]} currentPath={currentPath} />
							}
						</div>
					</div>
				</section>
			</div>

			<AdminPageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
		</form>
	)
}

Terms.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}