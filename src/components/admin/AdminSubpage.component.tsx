import Link from "next/link"

interface Props {
	subpages: object[]
	currentPath: string
}

export default function AdminSubpage({ subpages, currentPath }: Props) {

	return (
		<div className="admin-data">
			<div className="admin-data-table">
				<table className="table table-noborder table-vcenter">
					<thead>
						<tr>
							<th className="narrow">#</th>
							<th>Title</th>
							<th className="right">Status</th>
						</tr>
					</thead>
					<tbody>
						{subpages.map((subpage) =>
							<Link
								key={subpage[`page_id`]}
								href={{
									pathname: `${currentPath}/${subpage[`page_id`]}`
								}}
								passHref
							>
								<tr className="linkable">
									<td className="narrow">{subpage[`page_sort_order`]}</td>
									<td>
										<p className="strong">{subpage[`page_title`]}</p>
									</td>
									<td className="right">
										{subpage[`page_status`] === 1 &&
										<span className="badge badge-green">Published</span>
										}
										{subpage[`page_status`] === 2 &&
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
	)
}