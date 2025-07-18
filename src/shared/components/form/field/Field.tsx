import React, { CSSProperties, FC, useState } from 'react'

import { Control, Controller, FieldValues } from 'react-hook-form'

import Button from '../../button/Button'
import { TextField, Select, Checkbox, Radio, RadioGroup, FormControlLabel, MenuItem, Box, Chip, OutlinedInput } from '@mui/material'
import { Cancel } from '@mui/icons-material'

import './Field.scss'
import appTheme from '../../../../assets/styles/theme'

interface FieldOptions {
	label: string
	value: any
}

interface FieldRule {
	required: boolean
	validationFunctions: ((...args: any[]) => boolean)[]
}

interface FormFieldProps {
	defaultValue?: any
	field: IFormField | any
	containerStyle?: CSSProperties
	style?: CSSProperties
	error?: string
	control?: Control<FieldValues, any>
	isSubmitEnabled?: boolean
	onChange?: (field: string, value: any, selectOptionIndex?: number) => void
	onSubmit?: () => Promise<any>
}

export interface IFormField {
	name?: string
	type: 'text' | 'number' | 'date' | 'password' | 'select' | 'checkbox' | 'radioGroup' | 'submit' | 'element'
	label?: string
	disabled?: boolean
	checked?: boolean
	selected?: boolean
	options?: FieldOptions[]
	multiple?: boolean
	formatFn?: (value: any) => any
	rules?: FieldRule | any
	element?: JSX.Element
}

const FormField: FC<FormFieldProps> = ({ 
	field: { 
		name, 
		label, 
		type,
		disabled, 
		multiple = false, 
		options,
		rules,
		element,
		containerStyle,
		formatFn,
		style
	}, 
	control, 
	defaultValue, 
	onChange,
	error,
	isSubmitEnabled = true,
	onSubmit
}: FormFieldProps) => {
		
	const [ selectValue, setSelectValue ] = useState<any>(Array.isArray(defaultValue) ? defaultValue : [])
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)

	const handleSubmitButtonClick = async () => {
		if (onSubmit) {
			setIsSubmitting(true)
			await onSubmit()
			setIsSubmitting(false)
		}
	}
	
	const handleSelectFieldDelete = (field: string, value: any) => {
		setSelectValue(selectValue.filter((selectedValue: string) => selectedValue !== value))
		if(onChange)
			onChange(field, value)
	}

	const handleSelectOptionClick = (field: string, value: string, optionIndex: number) => {
		if (multiple) {
			const foundValueIndex = selectValue.findIndex((v: string) => v === value)
			if (foundValueIndex === -1) {
				setSelectValue([ ...selectValue, value ])
				return
			}

			setSelectValue(selectValue.filter((selectedValue: string) => selectedValue !== value))
		}

		if (!multiple) 
			setSelectValue(value)

		if (onChange) 
			onChange(field, value, optionIndex)
	}
	
	const generateSelect = (field: any) => {
		const ITEM_HEIGHT = 48
		const ITEM_PADDING_TOP = 8
		const SelectMenuOptions = {
			PaperProps: {
				style: {
					maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
					width: 250,
				},
			}
		}
		
		return <>
			<label style={{ marginBottom: 5, color: appTheme.palette.secondary.main }}>{ label }</label>
			{ selectValue.length > 0 && multiple && <Box sx={{ 
				display: 'flex', 
				flexWrap: 'wrap', 
				gap: 0.5,
				marginBottom: 1.5,
				p: 1,
				border: 1,
				borderColor: 'grey.500',
				borderRadius: 3
			}}>
				{ selectValue.map((value: any, i: number) => 
					<Chip 
						key={i} 
						label={value} 
						deleteIcon={<Cancel onMouseDown={e => e.stopPropagation()} />}  
						onDelete={() => handleSelectFieldDelete(field.name, value)}
					/>
				)}
			</Box>}
			<Select 
				{...field}
				{...(multiple && { 
					input: <OutlinedInput id='select-multiple-chip' label='Chip' />,
					value: selectValue
				}) }
				style={{ width: '100%', ...style }}
				multiple={multiple}
				MenuProps={SelectMenuOptions}
				disabled={disabled}
				//onChange={(e: SelectChangeEvent<any>) => handleSelectFieldChange(field.name, e.target.value)}
			> 
				{ options.map((option: FieldOptions, i: number) => 
					<MenuItem 
						key={i} 
						value={option.value.toString()} 
						onClick={() => handleSelectOptionClick(field.name, option.value.toString(), i)}
					>
						{option.label}
					</MenuItem>) 
				}
			</Select>
		</>
	}	
	

	return <div 
		className={`field ${type}`}
		style={containerStyle}>
		{ type === 'submit' ? 
			<Button 
				style={{ 
					width: '100%', 
					height: 55, 
					background: isSubmitEnabled ? appTheme.palette.primary.main : 'gray', 
					margin: '40px auto 15px',
					...style
				}} 
				onClick={handleSubmitButtonClick}
				disabled={!isSubmitEnabled || isSubmitting}
				loading={isSubmitting}
			>
				{ label }
			</Button>	
		: type === 'element' ? 
			element
		:
 			<Controller
				name={name}
				control={control}
				defaultValue={formatFn ? formatFn(defaultValue) : defaultValue}
				rules={rules}
				render={({ field }) =>
					['text', 'number', 'date', 'password'].includes(type) ? 
						<TextField
							type={type}
							label={label}
							disabled={disabled}
							style={{ 
								minHeight: 60, 
								width: '100%', 
								...style 
							}}
							{ ...(type === 'date' && { InputLabelProps: { shrink: true } }) }
							{ ...{ 
									...field, 
									value: formatFn ? formatFn(field.value) : field.value 
								}
							}
						/>

					: type === 'select' ? 
						generateSelect(field)

					: type === 'checkbox' ?
						<>
							<label>{ label }</label>
							<Checkbox 
								onChange={(e) => field.onChange(e.target.checked)}
								checked={!!field.value}
								style={style}
								disabled={disabled}
							/>
						</>

					: type === 'radioGroup' && options?.length ?
						<RadioGroup 
							aria-label={label} 
							style={style} 
							{...field}
						>
							{ options.map((option: FieldOptions, i: number) => <FormControlLabel key={i} label={option.label} value={option.value} control={<Radio />} />) }
						</RadioGroup>

					: <></>
				}
			/>
		}
		<small>{ error || null }</small>
	</div>
}

export default FormField
