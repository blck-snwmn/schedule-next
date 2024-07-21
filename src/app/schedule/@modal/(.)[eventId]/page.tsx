"use client"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

type Props = {
    params: { eventId: string }
}
export default async function Detail({ params }: Props) {
    const router = useRouter(); // required "use client"
    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        <div>app/schedule/@modal/{params.eventId}/page.tsx</div>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                    <DialogFooter>
                        footer
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}