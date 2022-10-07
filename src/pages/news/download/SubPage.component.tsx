import Link from "next/link"

interface Props {
	subpages: object[]
	currentPath: string
}

export default function SubPage({ subpages, currentPath }: Props) {
	return (
		<div className="admin-data">
			<div className="admin-data-table">
				<table className="table table-noborder table-vcenter">
					<thead>
						<tr>
							<th>Title</th>
							<th className="right">Status</th>
						</tr>
					</thead>
					<tbody>
						{subpages && subpages.map((subpage) =>
							<Link
								key={subpage[`page_id`]}
								href={{
									pathname: `${currentPath}/${subpage[`page_id`]}`
								}}
								passHref
							>
								<tr className="linkable">
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