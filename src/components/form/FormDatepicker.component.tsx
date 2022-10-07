import { parseDate } from "@utils/date"
import { ReactElement } from "react"
import ReactDatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import { UseFormReturn, FieldValues, Controller } from "react-hook-form"

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	dateFormat?: string
	valueType?: string
	label?: string
	placeholder?: string
	icon?: any
	footnote?: string | ReactElement
	styleLarge?: boolean
	[x: string]: any
}

export default function FormDatepicker({ setForm, name, dateFormat, valueType = `date`, label, placeholder, icon, footnote, styleLarge, ...attrs }: Props) {
	const { control } = setForm
	const Icon = icon

	return (
		<div className="form-input">
			{label &&
			<label htmlFor={name} className="form-input-heading">{label}</label>
			}
			<div className="form-input-field">
				{Icon &&
				<i className="icon" role="img"><Icon className="svg" /></i>
				}
				{control &&
				<Controller
					control={control}
					name={name}
					render={({ field: { onChange, onBlur, value } }) => (
						value ? (
							<ReactDatePicker
								id={name}
								className="input"
								dateFormat={dateFormat}
								onChange={onChange}
								onBlur={onBlur}
								selected={valueType === `string` ? parseDate(value) : value}
								placeholderText={placeholder}
								showYearDropdown
								showTimeInput
								{...attrs}
							/>
						) : (
							<ReactDatePicker
								id={name}
								className="input"
								dateFormat={dateFormat}
								onChange={onChange}
								onBlur={onBlur}
								placeholderText={placeholder}
								showYearDropdown
								showTimeInput
								{...attrs}
							/>
						)
					)
					}
				/>
				}
			</div>
			{footnote &&
			<p className="form-input-footnote">{footnote}</p>
			}
		</div>
	)
}