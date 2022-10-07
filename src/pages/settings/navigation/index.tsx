import AdminHeader from '@components/admin/AdminHeader.component'
import Dashboard from '@components/dashboard/Dashboard.component'
import FormRepeater from '@components/form/FormRepeater.component'
import Access from '@components/util/Access.component'
import { DashboardContext } from '@contexts/DashboardContext.context'
import useCurrentPath from '@hooks/useCurrentPath.hook'
import useGetData from "@hooks/useGetData.hook"
import useLoading from "@hooks/useLoading.hook"
import { postData } from '@utils/fetcher'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function SettingNavigation() {
	const { dispatch } = useContext(DashboardContext)
	const { currentPath } = useCurrentPath()
	const [ loading, setLoading ] = useState(false)
	const setForm = useForm()
	const { reset, handleSubmit } = setForm

	const { data: menuTopHeader, isLoading: menuTopHeaderLoading } = useGetData(`/menu/section/top-header`)
	const { data: menuSiteHeader, isLoading: menuSiteHeaderLoading } = useGetData(`/menu/section/site-header`)
	// const { data: menuFooter, isLoading: menuFooterLoading } = useGetData(`/menu/section/footer`)
	useLoading(loading)
	const { data: menuHeader, isLoading: menuHeaderLoading } = useGetData(`/menu/list?section=header`)

	const submit = async (data) => {
		dispatch({ type: `set_isLoading`, payload: true })
		try {
			await Promise.all([
				postData(`/menu/section/top-header`, { repeater: data[`topHeader`].map((menu) => ({ ...menu, menu_status: menu.menu_status === true ? 1 : 2 })) }),
				postData(`/menu/section/site-header`, { repeater: data[`siteHeader`].map((menu) => ({ ...menu, menu_status: menu.menu_status === true ? 1 : 2 })) })
			])

			dispatch({ type: `show_notification`, payload: {
				type: `success`,
				text: `Menu has been updated!`
			} })
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, menu cannot be updated!`,
				footnote: error.message
			} })
		}
		dispatch({ type: `set_isLoading`, payload: false })
	}

	useEffect(() => {
		if (menuSiteHeaderLoading || menuTopHeaderLoading || menuHeaderLoading) {
			setLoading(true)
		} else {
			setLoading(false)
		}
	}, [ menuSiteHeaderLoading, menuTopHeaderLoading, menuHeaderLoading ])

	useEffect(() => {
		if (!menuTopHeader?.data || !menuSiteHeader?.data) return

		const navData = {
			topHeader: menuTopHeader.data.map((menu) => ({ ...menu, menu_status: menu.menu_status === 1 ? true : false })),
			siteHeader: menuSiteHeader.data.map((menu) => ({ ...menu, menu_status: menu.menu_status === 1 ? true : false })),
			// footer: menuFooter.data.map((menu) => ({ ...menu, menu_status: menu.menu_status === 1 ? true : false }))
		}

		reset(navData)
	}, [ reset, menuTopHeader, menuSiteHeader ])

	return (
		<form onSubmit={handleSubmit(submit)} className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					title="Navigation"
					legend="Settings"
					action={
						<Access
							auth="write:settings-navigation"
							yes={
								<ul className="actions">
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
						<div className="admin-section-head">
							<h2 className="title">Top Header Menu</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<FormRepeater
								setForm={setForm}
								name="topHeader"
								inputNames={[ `ml_name.id`, `ml_name.en`, `menu_link`, `menu_status` ]}
								inputTypes={[ `text`, `text`, `text`, `checkbox` ]}
								inputLabels={[ `Label (ID)`, `Label (EN)`, `Link`, `Status` ]}
								inputWidths={[ `auto` ]}
								inputProps={[
									{},
									{},
									{},
									{
										label: `Active`
									}
								]}
								max={5}
								sortable
							/>
						</div>
					</div>
				</section>
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Site Header Menu</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<FormRepeater
								setForm={setForm}
								name="siteHeader"
								inputNames={[ `ml_name.id`, `ml_name.en`, `menu_link`, `menu_status` ]}
								inputTypes={[ `text`, `text`, `text`, `checkbox` ]}
								inputLabels={[ `Label (ID)`, `Label (EN)`, `Link`, `Status` ]}
								inputWidths={[ `auto` ]}
								inputProps={[
									{},
									{},
									{},
									{
										label: `Active`
									}
								]}
								max={5}
								sortable
							/>
						</div>
					</div>
				</section>
				{/* <section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Footer Menu</h2>
						</div>
						<div className="admin-section-body admin-section-body-gray">
							<FormRepeater
								setForm={setForm}
								name="footer"
								inputNames={[ `ml_name.id`, `ml_name.en`, `menu_link`, `menu_status` ]}
								inputTypes={[ `text`, `text`, `text`, `checkbox` ]}
								inputWidths={[ `auto` ]}
								inputLabels={[ `Label (ID)`, `Label (EN)`, `Link`, `Status` ]}
								inputProps={[
									{},
									{},
									{},
									{
										label: `Active`
									}
								]}
								max={5}
								sortable
							/>
						</div>
					</div>
				</section> */}
				<section className="section">
					<div className="admin-section">
						<div className="admin-section-head">
							<h2 className="title">Header Menu</h2>
						</div>
						<div className="admin-section-body">
							{menuHeader?.data &&
							<div className="admin-data">
								<div className="admin-data-table">
									<table className="table table-noborder table-vcenter">
										<thead>
											<tr>
												<th className="narrow">#</th>
												<th>Name</th>
												<th className="right">Status</th>
											</tr>
										</thead>
										<tbody>
											{menuHeader?.data.map((menu) =>
												<Link
													key={menu[`menu_id`]}
													href={{
														pathname: `${currentPath}/${menu[`menu_id`]}`
													}}
													passHref
												>
													<tr className="linkable">
														<td className="narrow">{menu[`menu_sort_order`]}</td>
														<td>
															<p className="strong">{menu[`menu_name`]}</p>
														</td>
														<td className="right">
															{menu[`menu_status`] === 1 &&
														<span className="badge badge-green">Published</span>
															}
															{menu[`menu_status`] === 2 &&
														<span className="badge">Draft</span>
															}
														</td>
													</tr>
												</Link>
											)}
										</tbody>
									</table>
								</div>
							</div>
							}
						</div>
					</div>
				</section>
			</div>
		</form>
	)
}

SettingNavigation.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}