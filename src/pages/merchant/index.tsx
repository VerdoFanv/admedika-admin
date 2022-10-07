import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import Access from "@components/util/Access.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import Link from "next/link"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import * as yup from "yup"
import { useContext, useEffect, useState } from "react"
import { postData } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { DashboardContext } from "@contexts/DashboardContext.context"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Subpage from "./SubPage.component"

export default function MerchantCategory() {
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
	const { currentPath } = useCurrentPath()

	const { dispatch } = useContext(DashboardContext)
	const [ showSidebar, setShowSidebar ] = useState(false)

	const setForm = useForm({
		resolver: yupResolver(schema)
	})

	const { reset, handleSubmit } = setForm
	const [ loading, setLoading ] = useState(false)
	const { data: mainPage, isLoading: pageIsLoading } = useGetData(`/page/list-page-id`)
	const pageId = mainPage?.data?.page_id[`mymerchant-home`]
	const { data: pageData, isLoading } = useGetData(`/page/${pageId}`)
	useLoading(loading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await postData(`/page/${pageId}/update`, {
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

	useEffect(() => {
		if (isLoading || pageIsLoading) {
			setLoading(true)
		} else {
			setLoading(false)
		}
	}, [ isLoading, pageIsLoading ])

	useEffect(() => {
		if (pageData) {
			reset({
				...pageData.data,
				page_status: pageData?.data?.page_status === 1 ? true : false
			})
		}
	}, [ pageData, reset ])

	if (!pageData?.data) return <></>

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Category"
					legend="merchant"
					action={
						<Access
							auth="write:merchant-mymerchant"
							yes={
								<ul className="actions">
									<li className="action">
										<Link href={`${currentPath}/new`} passHref><a className="button button-small button-primary">Add</a></Link>
									</li>
									{/* <li className="action">
										<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
									</li> */}
								</ul>
							}
							// no={
							// 	<ul className="actions">
							// 		<li className="action">
							// 			<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
							// 		</li>
							// 	</ul>
							// }
						/>
					}
				/>
			</header>
			<div className="admin-page-content">
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-body">
							{pageData?.data?.page_sub &&
							<Subpage subpages={pageData.data.page_sub} currentPath={currentPath} />
							}
						</div>
					</div>
				</section>
			</div>

			<AdminPageSidebar isShown={showSidebar} close={() => setShowSidebar(false)} setForm={setForm} />
		</form>
	)
}

MerchantCategory.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}