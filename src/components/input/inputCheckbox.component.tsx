
interface Props {
	name: string
	label?: string
	heading?: string
	styleReadOnly?: boolean
	styleCenter?: boolean
	[x: string]: any
}

export default function InputCheckbox({ name, label, value, onChange, heading, styleReadOnly, styleCenter, ...attrs }: Props) {

	return (
		<div className="form-check">
			{heading &&
			<p className="form-check-heading">{heading}</p>
			}
			<div className={`form-check-field ${styleCenter ? `form-check-field-center` : ``}`}>
				<>
					<input type="checkbox" name={name} id={name} className={`input ${styleReadOnly ? `input-readonly` : ``}`} {...attrs} />
					{label &&
						<label htmlFor={name} className="label">{label}</label>
					}
				</>
			</div>
		</div>
	)
}
