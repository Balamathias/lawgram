import toast from "react-hot-toast"
import { Button, Image, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react"
import { useDeletePost } from "../react-query/queriesAndMutations";
import { useNavigate } from "react-router";
import { Models } from "appwrite";


function DeletePost({post}: {post: Models.Document | undefined}) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const {mutateAsync: deletePost, isPending: isDeleting} = useDeletePost()
    const navigate = useNavigate()

    const handleDeletePost = () => {
        deletePost({postId: post?.$id || '', imageId: post?.imageId},{
            onSuccess() {
                navigate('/')
                onOpenChange()
                return toast?.success("Post deleted successfully.")
            },
        })
        }

  return (
    <>
        <div className="flex-1 py-2 md:py-4 max-w-5xl">
            <Button onPress={onOpen} className="border-none bg-dark-2 flex-center w-6 h-6 rounded-full">
            <Image
                src="/assets/icons/delete.svg"
                width={24}
                height={24}
                alt="delete"
                />
            </Button>
        </div>
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="center"
            backdrop="opaque"
        >
            <ModalContent className="bg-dark-2 p-4 shadow-2xl border border-rose-700">
            {(onClose) => (
                <>
                <ModalBody>
                <div className="py-6 flex flex-col gap-3 px-6 rounded-lg shadow z-20 bg-dark-2 border-rose-900">
                    <p className="text-rose-700 base-medium">Are you sure you want to delete this post? This action cannot be undone!</p>
                </div>
                    <ModalFooter>
                    <Button color="primary" variant="solid" onPress={onClose} className="rounded-[50px]">
                        Close
                    </Button>
                    <Button variant={'flat'} color="danger" isLoading={isDeleting} className={`ghost_details-delete_btn border justify-end flex items-center gap-3 w-fit`}
                    onClick={handleDeletePost}
                    >
                    {!isDeleting && <Image src="/assets/icons/delete.svg" alt="delete" width={16} height={16} />}
                    <span>Delet{isDeleting ? 'ing...': 'e'}</span>
                    </Button>
                    </ModalFooter>
                </ModalBody>
                </>
            )}
            </ModalContent>
        </Modal>
    </>
  )
}

export default DeletePost