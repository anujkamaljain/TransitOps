import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { notifyError } from "@/lib/api/mutation-error"

interface EntityRowActionsProps {
  onEdit?: () => void
  deleteTitle: string
  deleteDescription: string
  deleting: boolean
  onDelete: () => Promise<unknown>
}

export function EntityRowActions({
  onEdit,
  deleteTitle,
  deleteDescription,
  deleting,
  onDelete,
}: EntityRowActionsProps) {
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    try {
      await onDelete()
      setConfirm(false)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Row actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setConfirm(true)}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
