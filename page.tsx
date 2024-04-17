"use client"

import React, { useState } from 'react';
import {
  Box,
  Button,
  Image,
  useToast,
  VStack,
  Heading,
  Center,
  HStack,
  Text,
  Spinner,
  Link
} from '@chakra-ui/react';
import imglyRemoveBackground from '@imgly/background-removal';
import { useDropzone } from 'react-dropzone';

function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [processedImageSrc, setProcessedImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {'image': ['image/*']},
    onDrop: acceptedFiles => {
      setIsLoading(true);
      setProcessedImageSrc(''); // Reset the processed image view on new upload
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imgSrc = event.target!.result;
        setImageSrc(imgSrc as string);
        removeBackground(imgSrc as string);
      };
      reader.readAsDataURL(file);
    }
  });

  const removeBackground = (src: string) => {
    imglyRemoveBackground(src).then((blob) => {
      const url = URL.createObjectURL(blob);
      setProcessedImageSrc(url);
      setIsLoading(false);
    }).catch(error => {
      toast({
        title: "Error processing image",
        description: "Failed to remove background.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Failed to remove background: ", error);
      setIsLoading(false);
    });
  };

  return (
    <Center w="100vw" h="100vh" bgGradient='linear(to-b, pink.50, pink.100)'>
      
      <VStack spacing={8}>
      <VStack spacing={2} textAlign="center" px={["6px", "0px", "0px"]}>
          <Text fontSize={16} fontWeight={300} color="pink.600" letterSpacing={4}>FREE FOREVER</Text>
          <Text fontSize={30} fontWeight={600} color="pink.900" lineHeight="36px">Remove Backgrounds with Ease</Text>
        </VStack>
        <VStack spacing={2}>
          <Center {...getRootProps()} bg="white" padding={4} border="1px dashed gray" borderColor="gray.300" borderRadius="12px" width={["90%", "90%", "500px"]} height="150px">
            <input {...getInputProps()} />
            {isLoading ? <Box width={["300px", "300px", "500px"]} textAlign="center"><Spinner size="xl" /></Box> : <Text textAlign="center">Drag & drop some files here, or click to select files</Text>}
          </Center>
          {processedImageSrc && (
            <HStack spacing={4} width={["90%", "90%", "500px"]} justifyContent="space-between" bg="white" p="8px" borderRadius="12px">
              <Image src={processedImageSrc} alt="Processed Image" border="1px" borderRadius="6px" borderColor="gray.100" height="100px"/>
              <Button marginRight={6} colorScheme="brand" onClick={() => {
                const link = document.createElement('a');
                link.href = processedImageSrc;
                link.download = "processed_image.png"; // Provide a file name
                link.click();
              }}>
                Download
              </Button>
            </HStack>
          )}
        </VStack>
        <Button as="a" href="https://bento.me/pinkie" target="_blank" rel="noopener noreferrer"
          variant="ghost" 
          rightIcon={<Image height={3} src='/pinkie_logo.svg' alt='Pinkie Logo' />}
          fontWeight={400}
          _hover={{}}
        >
          Built with love by
        </Button>
      </VStack>
    </Center>
  );
}

export default App;
