import AdminHeader from "@components/admin/AdminHeader.component"
import Dashboard from "@components/dashboard/Dashboard.component"
import { DashboardContext } from "@contexts/DashboardContext.context"
import EiPagination from "@components/ei/EiPagination.component"
import useCurrentPath from "@hooks/useCurrentPath.hook"
import useGetData from "@hooks/useGetData.hook"
import { formatDate } from "@utils/date"
import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import { fetcherGet } from '@utils/fetcher'
import * as XLSX from 'xlsx'

export default function ServicesDownloadList() {
	const { dispatch, state } = useContext(DashboardContext)
	const [ pageIndex, setPageIndex ] = useState(1)
	const [ selectedSort, setSelectedSort ] = useState(`desc`)
	const { data: pageData, isLoading: pageIsLoading } = useGetData(
		`/service-inquiry?page=${pageIndex}&order=${selectedSort}`
	)
	const { currentPath } = useCurrentPath()
	const [ exportLoading, setExportLoading ] = useState(false)
	const sortOrderOptions = [
		{ label: `Sort by Newest`, value: `desc` },
		{ label: `Sort by Oldest`, value: `asc` }
	]

	useEffect(() => {
		dispatch({ type: `set_pageMemory`, payload: { inquiryList: { index: pageIndex, orderBy: selectedSort } } })
	}, [ pageIndex, selectedSort, dispatch ])

	useEffect(() => {
		if (state?.pageMemory?.inquiryList?.index !== 0 && state?.pageMemory?.inquiryList?.index) {
			setPageIndex(state.pageMemory.inquiryList.index)
		}
		if (state?.pageMemory?.inquiryList?.orderBy !== `` && state?.pageMemory?.inquiryList?.orderBy) {
			setSelectedSort(state.pageMemory.inquiryList.orderBy)
		}
	}, [])

	const getExportData = async (pageIndex) => {
		return fetcherGet(`${process.env.NEXT_PUBLIC_API_URL}/service-inquiry?page=${pageIndex}`)
	}

	const handleExportData = async () => {
		setExportLoading(true)
		let initialData = []
		for (let i = 1; i <= pageData.meta.last_page; i++) {
			const response = await getExportData(i)
			const mapResponse = response.data.map((item) => ({
				Date: item.si_created_at,
				Email: item.si_email,
				Name: item.si_name,
				Phone: item.si_phone,
				Company: item.si_company,
				Service: item.si_service,
				Address: item.si_address,
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
		XLSX.writeFile(wb, `ADMEDIKA-service-inquiry-list-${formatDate(new Date(), `DD/MM/YYYY`)}.xlsx`)
	}

	return (
		<form className="admin-page">
			<header className="admin-page-header">
				<AdminHeader
					legend="Services"
					title="Inquiry List"
					action={
						<ul className="actions">
							<li className="action">
								<button type="button" onClick={handleExportData} className={`button button-small button-primary ${exportLoading ? `simple-loading` : ``}`}>Export To xlsx</button>
							</li>
						</ul>
					}
				/>
			</header>
			<div className="admin-page-content">
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
									<th>Date</th>
									<th>Name</th>
									<th className="right">Service</th>
								</tr>
							</thead>
							<tbody>
								{pageData?.data && (
									pageData.data.map((list) => (
										<Link
											key={list[`si_id`]}
											href={{
												pathname: `${currentPath}/${list[`si_id`]}`,
											}}
											passHref
										>
											<tr className="linkable">
												<td>
													<p>
														{formatDate(
															list[`si_created_at`],
															`DD/MM/YYYY`
														)}
													</p>
													<p className="small">
														{formatDate(list[`si_created_at`], `HH:mm`)}
													</p>
												</td>
												<td>
													<p className="strong">{list[`si_name`]}</p>
													<p className="small">{list[`si_email`]}</p>
												</td>
												<td className="right">
													<p>{list[`si_service`]}</p>
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

ServicesDownloadList.getLayout = function getLayout(page) {
	return <Dashboard>{page}</Dashboard>
}
