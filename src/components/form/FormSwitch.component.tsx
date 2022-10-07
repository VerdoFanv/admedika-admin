import { UseFormReturn, FieldValues } from "react-hook-form"

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	label: string
	desc: string
}

export default function FormSwitch({ name, label, desc, setForm }: Props) {
	const { register } = setForm

	return (
		<div className="form-switch">
			<div className="form-switch-heading">
				<p className="label">{label}</p>
				<p className="desc">{desc}</p>
			</div>
			<div className="form-switch-field">
				<input type="checkbox" id="switch-1" className="input" {...register(name)} />
			</div>
		</div>
	)
}