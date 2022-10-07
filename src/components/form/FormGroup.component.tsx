export default function FormGroup({ children, heading }) {
	return (
		<div className="form-group">
			<p className="form-group-heading">{heading}</p>
			<div className="form-group-fieldset">
				{children}
			</div>
		</div>
	)
}