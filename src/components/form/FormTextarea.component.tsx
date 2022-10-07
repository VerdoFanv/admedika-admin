import { DetailedHTMLProps, ReactElement, TextareaHTMLAttributes } from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	label?: string
	icon?: any
	footnote?: string | ReactElement
	error?: any
	[x: string]: any
}

export default function FormTextarea({ setForm, name, label, icon, footnote, error, ...attrs }: Props) {
	const { register } = setForm
	const Icon = icon

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			<div className={`form-input-field ${error ? `is-error` : ``}`}>
				{Icon &&
				<i className="icon" role="img"><Icon className="svg" /></i>
				}
				<textarea id={name} className="input input-textarea" {...attrs} {...register(name)}></textarea>
			</div>
			{footnote && !error &&
			<p className="form-input-footnote">{footnote}</p>
			}
			{error &&
			<p className="form-input-error">{error.message}</p>
			}
		</div>
	)
}