import { LifeBuoy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ForgotPasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:underline"
        >
          Forgot password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <span className="mb-1 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <LifeBuoy className="size-5" />
          </span>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription className="space-y-3 pt-1 text-left">
            <span className="block">
              For security, TransitOps passwords are managed by your fleet
              administrator rather than self-service reset links.
            </span>
            <span className="block">
              Contact your administrator at{" "}
              <a
                href="mailto:admin@transitops.in"
                className="font-medium text-primary hover:underline"
              >
                admin@transitops.in
              </a>{" "}
              to have your credentials reissued.
            </span>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
