import { Button, Image, Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react"
import { Models } from "appwrite";
import useAbsoluteUrl from "@/parsers/useAbsoluteUrl";
import useCopyLink from "@/parsers/useCopyLink";
import toast from "react-hot-toast";


function SharePost({ post }: {post?: Models.Document | undefined}) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const url = useAbsoluteUrl()

    const {isCopied, copyLink} = useCopyLink()
    const text = `${post?.caption?.slice(0, 300)}...\n\nContinue reading @ ${url}\n`
    const imageUrl = post?.imageUrl
    
    const handleShare = async (method: 'whatsapp' | 'email' | 'copy') => {
        if (method === 'whatsapp') {
    
          try {
            await navigator.share({
              title: document.title,
              text: text,
              url: url,
              files: [imageUrl],
            });
          } catch (error) {
            console.error('Error sharing via WhatsApp:', error);
          }
        } else if (method === 'email') {
          const subject = `Check out this post by ${post?.creator?.name}`
          const body = `${post?.caption?.slice(0, 300)}...\n\nContinue reading @ ${url}\n`
          const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
          window.location.href = mailtoLink
        } else if (method === 'copy') {
            navigator.clipboard.writeText(post?.caption).then(
                () => {
                    toast?.success("Post content copied successfully")
                    onOpenChange()
                }
            ).catch(() => toast?.error("Could not copy Post content, please try again"))
        }
      }

      const shareOnWhatsApp = () => {    
        const encodedText = encodeURIComponent(text);
        const encodedUrl = encodeURIComponent(imageUrl);
    
        const whatsappLink = `https://wa.me/?text=${encodedText}%0A${encodedUrl}`;
    
        window.open(whatsappLink, '_blank');
      }

  return (
    <>
        <div className="flex-1 py-2 md:py-4 max-w-5xl">
            <Button onPress={onOpen} className="border-none bg-dark-2 flex-center w-6 h-6 rounded-full">
            <Image
                src="/assets/icons/share.svg"
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
            <ModalContent className="bg-dark-2 p-4 shadow-2xl border border-light-4">
            {() => (
                <>
                <ModalBody className="flex gap-4 flex-col">
                    <Button 
                        className={`bg-light-4 text-light-2`}
                        onClick={copyLink}
                        variant="flat"
                        radius="sm"
                        startContent={
                            <Image 
                                src="/assets/images/link.png"
                                width={24}
                                height={24}
                            />
                        }
                    >
                        {isCopied ? "Copied Post Link" : "Copy Post Link"}
                    </Button>
                    <Button 
                        className={`bg-light-3 text-light-2`}
                        onClick={() => handleShare('copy')}
                        variant="flat"
                        radius="sm"
                        startContent={
                            <Image 
                                src="/assets/images/copy.png"
                                width={24}
                                height={24}
                            />
                        }
                    >
                        Copy Post Content
                    </Button>
                    <Button 
                        onClick={shareOnWhatsApp}
                        color="success"
                        className="bg-dark-4 text-light-2"
                        radius="sm"
                        startContent={
                            <Image 
                                src="/assets/images/whatsapp.png"
                                width={24}
                                height={24}
                            />
                        }
                    >Share Post to whatsapp</Button>
                    <Button
                        onClick={() => handleShare('email')}
                        color="secondary"
                        className="bg-light-4"
                        radius="sm"
                        startContent={
                            <Image 
                                src="/assets/images/mail.png"
                                width={24}
                                height={24}
                            />
                        }
                    >Share to Email</Button>
                </ModalBody>
                </>
            )}
            </ModalContent>
        </Modal>
    </>
  )
}

export default SharePost