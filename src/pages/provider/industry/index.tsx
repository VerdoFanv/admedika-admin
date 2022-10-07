import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPagination from "@components/ei/EiPagination.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import Link from "next/link"
import { useCallback, useContext, useEffect, useState } from "react"
import IconPlus from "public/assets/icons/icon-plus.svg"
import { useForm } from "react-hook-form"

export default function NewsPosts() {
	const { dispatch, state } = useContext(DashboardContext)
	const [ pageIndex, setPageIndex ] = useState(1)
	const [ selectedSort, setSelectedSort ] = useState(`desc`)
	const [ searchQuery, setSearchQuery ] = useState(``)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(
		`/provider-client-industry?sort=${selectedSort}&s=${searchQuery}`
	)
	const { register, handleSubmit } = useForm()
	const { currentPath } = useCurrentPath()
	const sortOrderOptions = [
		{ label: `Sort by Newest`, value: `desc` },
		{ label: `Sort by Oldest`, value: `asc` }
	]

	useEffect(() => {
		dispatch({ type: `set_pageMemory`, payload: { newsPosts: { index: pageIndex, orderBy: selectedSort } } })
	}, [ pageIndex, selectedSort, dispatch ])

	useEffect(() => {
		if (state?.pageMemory?.providerClientIndustry?.index !== 0 && state?.pageMemory?.providerClientIndustry?.index) {
			setPageIndex(state.pageMemory.providerClientIndustry.index)
		}
		if (state?.pageMemory?.providerClientIndustry?.orderBy !== `` && state?.pageMemory?.providerClientIndustry?.orderBy) {
			setSelectedSort(state.pageMemory.providerClientIndustry.orderBy)
		}
	}, [])

	const onSubmitSearch = useCallback((query) => {
		setSearchQuery(query.searchBar)
	}, [])

	return (
		<form className="admin-page" onSubmit={handleSubmit(onSubmitSearch)}>
			<header className="admin-page-header">
				<AdminHeader
					legend="provider"
					title="Clients Industry"
					action={
						<Access
							auth="write:provider-clients-industry"
							yes={
								<ul className="actions">
									<li className="action">
										<Link href={`${currentPath}/new`} passHref><a className="button button-small button-primary"><i className="icon icon-inline" role="img"><IconPlus className="svg" /></i> Add</a></Link>
									</li>
								</ul>
							}
						/>
					}
				/>
			</header>
			<div className="admin-page-content">
				<div className="form-search">
					<div className="form-search-field">
						<input type="text" className="input" placeholder="Search Here" {...register(`searchBar`)} />
						<button type="submit" className="button button-alt">Search</button>
					</div>
				</div>
				<div className="admin-data-filters">
					<div className="admin-data-filter">
						<select name="sort" id="sort" className="input" onChange={(ev) => setSelectedSort(ev.target.value)} value={selectedSort}>
							{sortOrderOptions.map((item, i) =>
								<option
									key={i}
									value={item.value}
								>
									{item.label}
								</option>)}
						</select>
					</div>
				</div>
				<div className="admin-data">
					<div className={`admin-data-table ${pageIsLoading ? `is-loading` : ``}`}>
						<table className="table">
							<thead>
								<tr>
									{/* <th>Name (EN)</th> */}
									<th>Name (ID)</th>
									<th className="right">Status</th>
								</tr>
							</thead>
							<tbody>
								{pageData?.data && (
									pageData.data.map((list) => (
										<Link
											key={list[`pci_id`]}
											href={{
												pathname: `${currentPath}/${list[`pci_id`]}`,
											}}
											passHref
										>
											<tr className="linkable">
												<td>
													<p>
														{list.pci_name}
													</p>
												</td>
												<td className="right">
													{list[`pci_status`] === 1 &&
														<span className="badge badge-green">Active</span>
													}
													{list[`pci_status`] === 2 &&
														<span className="badge">Draft</span>
													}
												</td>
											</tr>
										</Link>
									))
								)}
							</tbody>
						</table>
					</div>
					{pageData?.data && (
						<div className="admin-data-foot">
							<EiPagination
								data={pageData.meta}
								pageIndex={pageIndex}
								setPageIndex={setPageIndex}
							/>
						</div>
					)}
				</div>
			</div>
		</form>
	)
}

NewsPosts.getLayout = function getLayout(page) {
	return (
		<Dashboard>
			{page}
		</Dashboard>
	)
}