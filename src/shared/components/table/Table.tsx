
import React, { FC, ReactNode, CSSProperties, isValidElement, useEffect } from 'react'
import { Edit, DeleteOutline, Add, Check } from '@mui/icons-material'
import { Paper, Toolbar, Table as MUITable, TableBody, TableCell, TableHead, TableRow, TablePagination } from '@mui/material'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'

import useMUITablePagination from '../../hooks/useMuiTablePagination'

import { formatDate } from '../../../shared/utils/date'

import Button from '../button/Button'
import TooltipIconButton from '../tooltip-icon-button/TooltipIconButton'

import { Loader } from '../loader'

import appTheme from '../../../assets/styles/theme'


interface DataColumn {
	displayName: string
	dataKey: string
	alignment?: 'left' | 'center' | 'right'
	formatFn?: Function
}

interface TableProps {
	data: any[]
	columns: DataColumn[]
	unWrappedColumns?: string[]
	dateFieldsToFormat?: string[]
	title?: string
	toolbarContent?: JSX.Element | ReactNode 
	addToolbarButton?: {
		caption: string
		style?: CSSProperties
	}
	selectable?: boolean
	rowsPerPage?: number
	loading?: boolean
	onAddToolbarButtonClick?: () => void
	onRowColumnClick?: (rowIndex: number, columnName: string, rowData?: any) => Promise<void> | void
	onEditRowButtonClick?: (rowIndex: number) => void
	onRemoveRowButtonClick?: (rowIndex: number) => void
	style?: CSSProperties
}

const Table: FC<TableProps> = (
	{ data, title, columns, toolbarContent, addToolbarButton, onAddToolbarButtonClick
	, onRowColumnClick, onEditRowButtonClick, onRemoveRowButtonClick, selectable, rowsPerPage = -1
	, dateFieldsToFormat, loading, unWrappedColumns = [], style = {}
}) => {

	const { page, limit, handleLimitChange, handlePageChange, rowsPerPageOptions } = useMUITablePagination(rowsPerPage)

	const getPaginatedData = (data: any[]): any[] => {
		if (!rowsPerPage || limit <= 0)
			return data

		return data.slice(page * limit, page * limit + limit)
	}

	const handleAddToolbarButtonClick = () => onAddToolbarButtonClick && onAddToolbarButtonClick()
	const handleRowEditButtonClick = (rowIndex: number) => onEditRowButtonClick!(rowIndex)
	const handleRowRemoveButtonClick = (rowIndex: number) => onRemoveRowButtonClick!(rowIndex)

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			fontSize: 18,
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 16,
			color: 'black !important'
		},
	}))
	
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		'&:nth-of-type(odd)': {
			backgroundColor: '#f2f2f2'
		},
		// hide last border
		'&:last-child td, &:last-child th': {
			border: 0,
		},
	}))

	const getColumnColor = (value: boolean) => value ? '#d5d5d9de' : 'gray'

	const getRowContent = (columName: string, value: any, formatFn?: Function) =>
			isValidElement(value) ? value
		:
			formatFn ? formatFn(value) 
		:
			typeof value === 'boolean' ? (value ? <Check /> : '') 
		:
			['number', 'string'].includes(typeof value) ? 
				dateFieldsToFormat?.includes(columName) ? formatDate(value) : value 
		:
			Array.isArray(value) && unWrappedColumns.includes(columName) ? value.join('\n') 
		: 
			<span style={{ cursor: 'pointer' }}>Ver</span>


	const setToFirstPage = (): void => {
		if (rowsPerPage > 0)
			handlePageChange(null, 0)
	}

	useEffect(() => setToFirstPage, [data])

	if (loading) 
		return <Loader 
			width={50} 
			height={50}
			color={appTheme.palette.primary.main}
			containerStyle={{ 
				display: 'flex',
				justifyContent: 'center',
				width: '100%'
			}} 
		/> 

	return <Paper style={{ 
		width: '100%', 
		overflowX: 'auto',
		height: 'max-content',
		background: 'none',
		...style
	}}>
		{ (title || toolbarContent || addToolbarButton) && <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
				background: appTheme.palette.background.default
      }}
    >
			<h3 style={{ marginRight: 10, color: appTheme.palette.secondary.main }}>{ title }</h3>
			{ toolbarContent }
			{ addToolbarButton &&
				<Button
					style={{ 
						...(!toolbarContent && { marginLeft: 'auto' }),
						height: 40,
						minWidth: 150,
						...addToolbarButton.style
					}}
					onClick={handleAddToolbarButtonClick}
				>
					<span style={{ marginLeft: 5, paddingRight: 15 }}>{ addToolbarButton.caption }</span>
					<Add style={{ marginLeft: 'auto' }} />
				</Button> 
			}
		</Toolbar>}
		<MUITable component={Paper} sx={{ minWidth: 340, overflowY: 'auto' }} size="small">
			<TableHead>
				<StyledTableRow>
					{ columns.map(({ dataKey, displayName, alignment }, i) =>
						<StyledTableCell
							key={i}
							align={ alignment || 'left' }
							style={{ 
								...(dataKey === 'enabled' && { width: 65 })
							}}
						>	
							{ displayName }
						</StyledTableCell>
					)}
					{ onEditRowButtonClick ? <StyledTableCell align='center' style={{ width: 60 }}>Editar</StyledTableCell> : null}
					{ onRemoveRowButtonClick ? <StyledTableCell align='center' style={{ width: 60 }}>Excluir</StyledTableCell> : null}
				</StyledTableRow>
			</TableHead>
			<TableBody>
			{ getPaginatedData(data)?.map((row, i) => {
					const isEnabledRow = row.enabled !== false
					const rowIndex = i + (page * limit)
			
					return <StyledTableRow 
						key={rowIndex}
						style={{ ...(selectable && { cursor: 'pointer' }) }} 
						hover
					>
						{ columns.map(({ dataKey, alignment, formatFn }, columnIndex) =>
							<StyledTableCell 
								key={columnIndex}
								align={ alignment || 'left' }
								style={{ 
									color: getColumnColor(isEnabledRow),
									whiteSpace: 'pre-line'
								}}
								onClick={() => onRowColumnClick && onRowColumnClick(i, dataKey, row)}
							>
								{ getRowContent(dataKey, row[dataKey], formatFn) }
							</StyledTableCell> 
						)}
					
						{ onEditRowButtonClick ? <StyledTableCell align='center'>
							<TooltipIconButton 
								title='Editar' 
								onClick={() => handleRowEditButtonClick(rowIndex)} 
								disabled={!isEnabledRow}
							>
								<Edit style={{ color: getColumnColor(isEnabledRow) }} />
							</TooltipIconButton>
						</StyledTableCell> : null }

						{ onRemoveRowButtonClick ? <StyledTableCell align='center'>
							<TooltipIconButton 
								title='Excluir' 
								onClick={() => handleRowRemoveButtonClick(rowIndex)} 
								disabled={!isEnabledRow}
							>
								<DeleteOutline style={{ color: getColumnColor(isEnabledRow) }} />
							</TooltipIconButton>
						</StyledTableCell> : null }
					</StyledTableRow>	
				})
			}
			</TableBody>
			</MUITable>
		{ rowsPerPage > 0 && <TablePagination
			id='table-pagination'
      component='div'
      count={data?.length || 0}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleLimitChange}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage={'Registros por página'}
			style={{ borderRadius: 15 }}
    />}
	</Paper>
}

export default Table
