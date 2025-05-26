import { useState } from 'react' 

type AsyncFunction<A, O> = (...args: A[]) => Promise<O> 

interface ResultAction { 
  function: AsyncFunction<[any], any>
  params: any[]
}

interface ConfirmationDialog {
  isConfirmationDialogEnabled: boolean
  confirmationDialogMessage: string
  openConfirmationDialog: (message: string, action: any, actionParams: any[]) => void
  handleConfirmationDialogResult: (result: boolean) => Promise<void>
}

const useConfirmationDialog = (): ConfirmationDialog => {
  const [ isConfirmationDialogEnabled, setIsConfirmationDialogEnabled ] = useState<boolean>(false)
  const [ confirmationDialogMessage, setConfirmationDialogMessage ] = useState<string>('')
  const [ resultAction, setResultAction ] = useState<ResultAction | null>(null)

  async function handleConfirmationDialogResult(this: any, result: boolean): Promise<void> {
    setIsConfirmationDialogEnabled(false)

    if (result && resultAction)
      await resultAction.function.apply(this, resultAction.params)
  }

  const openConfirmationDialog = (message: string, action: any, actionParams: any[]): void => {
    setResultAction({ function: action, params: actionParams })
    setConfirmationDialogMessage(message)
    setIsConfirmationDialogEnabled(true)
  }

  return {
    isConfirmationDialogEnabled,
    confirmationDialogMessage,
    openConfirmationDialog,
    handleConfirmationDialogResult
  } as ConfirmationDialog
}

export default useConfirmationDialog
