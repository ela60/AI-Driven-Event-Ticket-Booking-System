import {EventManagementTable} from "@/app/(dashboard)/dashboard/(adminDashboard)/event-management/event-table";
import {GetAllEvents} from "@/actions/eventActions";

export default async function EventManagementPage() {
    const events = await GetAllEvents()

    return (
        <>
            <EventManagementTable eventData={events}/>
        </>
    )
}