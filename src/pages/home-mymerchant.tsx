import AdminHeader from "@components/admin/AdminHeader.component"
import AdminPageSidebar from "@components/admin/AdminPageSidebar.component"
import Dashboard from '@components/dashboard/Dashboard.component'
import FormRepeater from "@components/form/FormRepeater.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from "@utils/fetcher"
import IconSidebar from 'public/assets/icons/icon-sidebar.svg'
import { useContext, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'

export default function Home() {
	const { dispatch } = useContext(DashboardContext)
	const [ showSidebar, setShowSidebar ] = useState(false)
	const setForm = useForm()
	const { reset, handleSubmit } = setForm
	const { data: pageId } = useGetData(`/page/list-page-id`)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(`/page/${pageId?.data?.page_id[`mymerchant-home`]}`)

	useLoading(pageIsLoading)

	async function onSubmit(data) {
		dispatch({ type: `set_isLoading`, payload: true })

		try {
			await postData(`/page/${pageId?.data?.page_id[`mymerchant-home`]}/update`, {
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
					title="Home"
					action={
						<Access
							auth="write:home-mymerchant"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="submit" className="button button-small">Save</button>
									</li>
									<li className="action">
										<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
									</li>
								</ul>
							}
							no={
								<ul className="actions">
									<li className="action">
										<button type="button" onClick={() => setShowSidebar(true)} className="button button-gray button-small"><i className="icon icon-medium icon-only" role="img"><IconSidebar className="svg" /></i></button>
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
							<h2 className="title">Hero Banner</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<div className="form-fieldset">
								<div className="form-fieldset-body">
									<div className="row">
										<FormRepeater
											setForm={setForm}
											name="meta.repeater.banner"
											inputNames={[ `image`, `image_tablet`, `image_mobile`, `image_alt`, `text.id`, `text.en` ]}
											inputTypes={[ `image`, `image`, `image`, `text`, `wysiwyg-color-picker-only`, `wysiwyg-color-picker-only` ]}
											inputLabels={[ `Image Desktop`, `Image Tablet`, `Image Mobile`, `Image Alt`, `Text (ID)`, `Text (EN)` ]}
											inputWidths={[ `auto`, `auto`, `auto` ]}
											inputShown={3}
											inputProps={[
												{
													size: `medium`,
													aspectRatio: `10/6`,
													title: `Recommended size 1920x1080px. Max filesize 6MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 1920x1080px. Max filesize 6MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												},
												{
													size: `medium`,
													aspectRatio: `8/6`,
													title: `Recommended size 1024x760px. Max filesize 3MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 1024x760px. Max filesize 3MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												},
												{
													size: `medium`,
													aspectRatio: `14/13`,
													title: `Recommended size 414x381px. Max filesize 2MB. Accepted format: jpg, png.`,
													footnote: `Recommended size 414x381px. Max filesize 2MB. Accepted format: jpg, png.`,
													styleNoButton: true,
													styleNoPlaceholder: true,
												}
											]}
											max={100}
											sortable
										/>
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

Home.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}