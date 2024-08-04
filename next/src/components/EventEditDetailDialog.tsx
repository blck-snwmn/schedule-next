"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EventEditDetail } from "./EventEditDetail";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props<T> = {
    event: ScheduleEvent;
    talents: Talent[];
    action: (form: FormData) => Promise<T>
};

export default async function EditDetailDialog<T>({ event, talents, action }: Props<T>) {
    const router = useRouter(); // required "use client"

    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>X:{event.name}</DialogTitle>
                </DialogHeader>
                <form action={action}>
                    <EventEditDetail event={event} talents={talents} />
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit">Save Event</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}