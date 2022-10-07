import { FieldError, FieldValues, UseFormReturn } from "react-hook-form"

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	type: `checkbox`
	name: string
	value?: any
	label?: string
	onChange?: (event: any) => void
	heading?: string
	error?: FieldError
	styleReadOnly?: boolean
	styleCenter?: boolean
	[x: string]: any
}

export default function FormCheck({ setForm, type, name, label, value, onChange, heading, error, styleReadOnly, styleCenter, ...attrs }: Props) {
	const { register } = setForm

	return (
		<div className="form-check">
			{heading &&
			<p className="form-check-heading">{heading}</p>
			}
			{error &&
			<p className="form-check-error">{error.message}</p>
			}
			<div className={`form-check-field ${styleCenter ? `form-check-field-center` : ``}`}>
				<>
					<input
						type={type}
						id={name}
						className={`input ${styleReadOnly ? `input-readonly` : ``}`}
						value={value}
						{...attrs}
						{...register(name, { onChange })}
					/>
					{label &&
						<label htmlFor={name} className="label">{label}</label>
					}
				</>
			</div>
		</div>
	)
}
