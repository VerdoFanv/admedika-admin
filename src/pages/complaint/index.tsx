import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import EiPagination from "@components/ei/EiPagination.component"
import Access from "@components/util/Access.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import Link from "next/link"
import { useCallback, useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { formatDate } from "@utils/date"
import { fetcherGet } from "@utils/fetcher"
import * as XLSX from 'xlsx'

export default function NewsPosts() {
	const { dispatch, state } = useContext(DashboardContext)
	const [ pageIndex, setPageIndex ] = useState(1)
	const [ selectedSort, setSelectedSort ] = useState(`desc`)
	const [ searchQuery, setSearchQuery ] = useState(``)
	const [ exportLoading, setExportLoading ] = useState(false)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(
		`/complaint?sort=${selectedSort}&s=${searchQuery}`
	)
	const { register, handleSubmit } = useForm()
	const { currentPath } = useCurrentPath()
	const sortOrderOptions = [
		{ label: `Sort by Newest`, value: `desc` },
		{ label: `Sort by Oldest`, value: `asc` }
	]

	useEffect(() => {
		dispatch({ type: `set_pageMemory`, payload: { complaintList: { index: pageIndex, orderBy: selectedSort } } })
	}, [ pageIndex, selectedSort, dispatch ])

	useEffect(() => {
		if (state?.pageMemory?.complaintList?.index !== 0 && state?.pageMemory?.complaintList?.index) {
			setPageIndex(state.pageMemory.complaintList.index)
		}
		if (state?.pageMemory?.complaintList?.orderBy !== `` && state?.pageMemory?.complaintList?.orderBy) {
			setSelectedSort(state.pageMemory.complaintList.orderBy)
		}
	}, [])

	const onSubmitSearch = useCallback((query) => {
		setSearchQuery(query.searchBar)
	}, [])

	const getExportData = async (pageIndex) => {
		return fetcherGet(`${process.env.NEXT_PUBLIC_API_URL}/complaint?page=${pageIndex}`)
	}

	const handleExportData = async () => {
		setExportLoading(true)
		let initialData = []
		for (let i = 1; i <= pageData.meta.last_page; i++) {
			const response = await getExportData(i)
			const mapResponse = response.data.map((item) => ({
				Date: item.complaint_created_at,
				Email: item.complaint_email,
				Name: item.complaint_name,
				Merchant: item.complaint_merchant_name,
				message: item.complaint_message,
			}))
			initialData = [
				...initialData,
				...mapResponse
			]
		}
		setExportLoading(false)

		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(initialData)
		XLSX.utils.book_append_sheet(wb, ws, `sheet-1`)
		XLSX.writeFile(wb, `MYMERCHANT-complaint-list-${formatDate(new Date(), `DD/MM/YYYY`)}.xlsx`)
	}

	return (
		<form className="admin-page" onSubmit={handleSubmit(onSubmitSearch)}>
			<header className="admin-page-header">
				<AdminHeader
					title="Complaint"
					action={
						<Access
							auth="write:complaint-mymerchant"
							yes={
								<ul className="actions">
									<li className="action">
										<button type="button" onClick={handleExportData} className={`button button-small button-primary ${exportLoading ? `simple-loading` : ``}`}>Export To xlsx</button>
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
									<th>Name</th>
									<th>Merchant</th>
									<th className="right">Date</th>
								</tr>
							</thead>
							<tbody>
								{pageData?.data && (
									pageData.data.map((list) => (
										<Link
											key={list[`complaint_id`]}
											href={{
												pathname: `${currentPath}/${list[`complaint_id`]}`,
											}}
											passHref
										>
											<tr className="linkable">
												<td>
													<p>{list.complaint_name}</p>
												</td>
												<td>
													<p>{list.complaint_merchant_name}</p>
												</td>
												<td className="right">
													<p>
														{formatDate(list.complaint_created_at, `DD/MM/YYYY`)}
													</p>
													<p className="small">{formatDate(list.complaint_created_at, `HH:mm`)}</p>
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