import Spinner from "@/components/common/Spinner";

export default function loading() {
    return (
        <div className={"w-full h-screen flex justify-center items-center"}>
            <Spinner/>
        </div>
    )
}