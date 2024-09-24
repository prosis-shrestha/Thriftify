import { useToast } from '@chakra-ui/react'

export const useAlert=()=>{
    const toast = useToast()
    const alert=(type:"success"|"error",message:string)=>{

         toast({
          title: '',
          description: message,
          status: type,
          duration: 4000,
          position:"top",
          isClosable: true,
        })

    }
    return {alert}
}