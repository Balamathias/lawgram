import { Button } from "@/components/ui/button"
import { useGetInfinitePosts } from "../react-query/queriesAndMutations"

function Error() {
  const {refetch} = useGetInfinitePosts()
  return (
    <div className="flex-center p-4">
        <div className="py-6 px-5 rounded-lg border border-rose-800 shadow-lg flex flex-col gap-4">
            <p className="text-rose-600 small-medium text-subtle p-2">
                An Error Occured. Please make sure you are connected to the internet
            </p>
            <Button onClick={() => refetch()} className="bg-primary-600 text-light-2">
                Try again
            </Button>
        </div>
    </div>
  )
}

export default Error