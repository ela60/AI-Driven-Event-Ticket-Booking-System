import Spinner from "@/components/common/Spinner";

export default function loading() {
    return (
        <div className={"w-full h-[calc(100dvh-64px)] flex justify-center items-center"}>
            <Spinner/>
        </div>
    )
}