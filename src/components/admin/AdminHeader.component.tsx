import { ReactElement } from "react"

interface Props {
	title: String
	parent?: String | ReactElement
	legend?: String
	backlink?: any
	action?: ReactElement
}

export default function AdminHeader({ title, parent, legend, backlink, action }: Props) {

	return (
		<div className="admin-header">
			<div className="admin-header-heading">
				{/* {legend && backlink &&
				<Link href={backlink} passHref>
					<a className="legend"><i className="icon" role="img"><IconArrowLeft className="svg" /></i> {legend}</a>
				</Link>
				} */}
				{legend &&
				<p className="legend">{legend}</p>
				}
				<h1 className="title">
					{parent &&
						<span className="parent">{parent} / </span>
					}
					{title}
				</h1>
			</div>
			<div className="admin-header-action">
				{action}
			</div>
		</div>
	)
}