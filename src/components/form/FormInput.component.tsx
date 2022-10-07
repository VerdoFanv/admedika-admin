import IconEyeOff from 'public/assets/icons/icon-eye-off.svg'
import IconEye from 'public/assets/icons/icon-eye.svg'
import { DetailedHTMLProps, InputHTMLAttributes, ReactElement, useState } from "react"
import { FieldValues, UseFormReturn, FieldError } from "react-hook-form"

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	setForm?: UseFormReturn<FieldValues, any>
	type?: string
	name: string
	label?: string
	error?: FieldError
	icon?: any
	footnote?: string | ReactElement
	styleLarge?: boolean
	[x: string]: any
}

export default function FormInput({ setForm, type = `text`, name, label, error, icon, footnote, styleLarge, ...attrs }: Props) {
	const [ passReveal, setPassReveal ] = useState(false)
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

				{type === `text` &&
				<input
					type={passReveal ? `password` : `text`}
					id={name}
					className={`input ${styleLarge ? `input-large` : ``}`}
					{...attrs}
					{...register(name)}
				/>
				}

				{type === `password` &&
				<>
					<input
						type={passReveal ? `text` : `password`}
						id={name}
						className={`input ${styleLarge ? `input-large` : ``}`}
						{...attrs}
						{...register(name)}
					/>
					<button type="button" onClick={() => setPassReveal(!passReveal)} className="reveal"><i className="icon" role="img">{passReveal ? <IconEyeOff className="svg" /> : <IconEye className="svg" />}</i></button>
				</>
				}

				{type === `color` && (
					<>
						<input
							type="color"
							id={name}
							className={`input`}
							style={{ width: `5%` }}
							{...attrs}
							{...register(name)}
						/>
					</>
				)}
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