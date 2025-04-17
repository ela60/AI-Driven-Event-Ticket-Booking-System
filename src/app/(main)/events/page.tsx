import EventCards from "@/components/AllCategories/EventCards";
import {getSearchedEvents} from "@/actions/eventActions";
import {NoDataMessage} from "@/components/no-data";
import {MusicIcon} from "lucide-react";
import SearchFilter from "@/app/(main)/events/search-filter";

export default async function EventsPage({
                                             searchParams,
                                         }: {
    searchParams: Promise<{
        search: string | null,
        category: string | null,
        sort: string | null
    }>
}) {

    const search = (await searchParams).search || null
    const category = (await searchParams).category || "all"
    const sort = (await searchParams).sort || "latest"

    const events = await getSearchedEvents(search, category, sort);


    return (
        <>
            <SearchFilter/>
            {events.length === 0 ?
                <NoDataMessage icon={<MusicIcon/>} title={"No events found"}
                               description={"No events match your search criteria. Try adjusting your search terms."}/>
                :

                <div className={"max-w-7xl mx-auto px-4 sm:px-6"}>
                    <EventCards events={events}/>
                </div>
            }

        </>
    );
}