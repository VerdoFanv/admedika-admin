import IconChevronLeft from 'public/assets/icons/icon-chevron-left.svg'
import IconChevronRight from 'public/assets/icons/icon-chevron-right.svg'
import { Dispatch, SetStateAction, useEffect, useState } from "react"

export interface MetaData {
  current_page: number
  from: number
  last_page: number
  links: string[]
  path: string
  per_page: number
  to: number
  total:number
}

interface Props {
	data: MetaData
	pageIndex: any
	setPageIndex: Dispatch<SetStateAction<number>>
}

export default function EiPagination({ data, pageIndex, setPageIndex }: Props) {
	const [ activePage, setActivePage ] = useState([])
	const pageRange = 3

	const removePageIndexFromStorage = () => {
		if (typeof window !== `undefined`) {
			if (sessionStorage.getItem(`pageIndex`) !== null)
				sessionStorage.removeItem(`pageIndex`)

			if (sessionStorage.getItem(`pageParentIndex`) !== null && sessionStorage.getItem(`isPageParent`) !== null)
				sessionStorage.removeItem(`pageParentIndex`)
		}
	}

	useEffect(() => {
		if (!data) return

		const allPage = Array.from({ length: data.last_page }, (_, i) => i + 1)
		const activeArr = [ 1 ]

		if (data.last_page > 1) {
			activeArr.push(data.last_page)
		}

		if (allPage.length > 2) {
			if (data.current_page <= pageRange) {
				for (let i = 0; i < pageRange; i++) {
					if (i + 2 < data.last_page) {
						activeArr.splice(i + 1, 0, i + 2)
					}
				}
			} else if (data.current_page + pageRange <= data.last_page) {
				for (let i = 0; i < pageRange; i++) {
					activeArr.splice(i + 1, 0, data.current_page - 1 + i)
				}
			} else {
				for (let i = 0; i < pageRange; i++) {
					if (data.last_page - pageRange + i > 1) {
						activeArr.splice(-1, 0, data.last_page - pageRange + i)
					}
				}
			}
		}

		setActivePage(activeArr)
	}, [ data ])

	if (!data) return <></>

	return (
		<div className="ei-pagination">
			<p className="ei-pagination-counter">Showing {data.from} – {data.to} of {data.total}</p>
			<div className="ei-pagination-nav">
				<div className="ei-pagination-prev">
					<button
						type="button"
						onClick={() => {
							setPageIndex(pageIndex - 1)
							removePageIndexFromStorage()
						}}
						className="link"
						disabled={pageIndex === 1}
					>
						<i className="icon" role="img"><IconChevronLeft className="svg" /></i>
						Prev
					</button>
				</div>
				<div className="ei-pagination-list">
					<ul className="items">
						{activePage.map(i =>
							<li key={`pagenav-${i}`} className="item">
								<button
									type="button"
									onClick={() => {
										setPageIndex(i)
										removePageIndexFromStorage()
									}}
									className={`link ${data.current_page === i ? `is-current` : ``}`}
								>
									{i}
								</button>
							</li>
						)}
					</ul>
				</div>
				<div className="ei-pagination-next">
					<button
						type="button"
						onClick={() => {
							setPageIndex(pageIndex + 1)
							removePageIndexFromStorage()
						}}
						className="link"
						disabled={pageIndex === data.last_page}
					>
						Next
						<i className="icon" role="img"><IconChevronRight className="svg" /></i>
					</button>
				</div>
			</div>
		</div>
	)
}
