
import React, { FC, CSSProperties, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import FormField from './field/Field'
import type { IFormField } from './field/Field'

import './Form.scss'
import { cgcUtils } from '../../utils/cgc'

interface FormProps {
  fields: IFormField[] | IFormField[][]
	values?: any
	isSubmitting?: boolean
	onChange?: (field: any, value: any, selectOptionIndex?: number) => void
  	onSubmit: (data: any) => Promise<any>
	onClose?: () => void
	style?: CSSProperties
}

interface FieldErrorMessage {
	[key: string]: string
}

const CustomForm: FC<FormProps> = ({ fields, onSubmit, onChange, isSubmitting, values = {}, style = {} }: FormProps) => {
	const { control, handleSubmit, formState: { errors }, getValues, trigger } = useForm({
		defaultValues: values,
		mode: "all"
	})

	const errorMessagesByField: FieldErrorMessage = { username: 'Informe um Cpf/Cnpj válidos', quantity: 'Quantidade máxima excedida.' }
	const errorMessagesByErrorType: FieldErrorMessage = { required: 'Campo obrigatório.' }
	
	const handleFormFieldChange = (field: string, value: any, selectOptionIndex?: number) => { 

		console.log("aqui")

		if(field === "LOGIN") {
			value = cgcUtils.maskaraCpfCnpj(value)
		}

		if(onChange) {
			onChange(field, value, selectOptionIndex)
			return
		}
	}

	const handleFieldSubmit = async (): Promise<void> =>
		trigger()
		.then(async result => {
			if (result)
				await onSubmit(getValues())
		})
	
	const getFieldErrorMsg = (searchValue: string): string  => {
		if (!errors[searchValue]?.type)
			return ''

		return { ...errorMessagesByField, ...errorMessagesByErrorType }[searchValue]  || 'Campo inválido'
	}

	
	useEffect(() => {
		fields.forEach(field => {
			if (Array.isArray(field)) {
				field.forEach(field => { 
					if (field.name && field.rules?.select)
						field.rules = { validate: () => getValues(field.name!).length > 0 }
				})
				return
			}
			
			if (field.name && field.rules?.select)
				field.rules = { validate: () => getValues(field.name!).length > 0 }
		})
	})


	const generateField = (field: IFormField, key: number | string) => 
		<FormField 
			key={`${key}${field.name}`}
			field={field} 
			control={control}
			error={getFieldErrorMsg(field.name!)} 	
			defaultValue={values[field.name!] || ''} 
			onSubmit={handleFieldSubmit}
			onChange={handleFormFieldChange}
			isSubmitEnabled={!Object.keys(errors).length}
	/>

	if (!fields.length)
		return null

  return <form 
		className="flex flex-column" 
		onSubmit={handleSubmit(onSubmit)} 
		style={style}
	>	

		{ fields.map((field: any, i) => 
			Array.isArray(field) ? 
				<div className="field-group" key={i}>
					{ field.map(subField => generateField(subField, `${i}${subField.name}`))}
				</div>
			: 
				generateField(field, i)
		)}
  </form>
}

export default CustomForm
