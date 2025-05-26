export const formatCurrency = (value?: number): string => 
    (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
