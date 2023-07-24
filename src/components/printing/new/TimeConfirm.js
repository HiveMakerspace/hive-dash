import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from '@chakra-ui/react';

export default function TimeConfirm(props) {
    return (
        <AlertDialog isOpen>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader>Confirm long print permission</AlertDialogHeader>

                    <AlertDialogBody>
                        Have you confirmed with an MPI that this 9+ hour print is allowed?
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button colorScheme="green">No</Button>
                        <Button colorScheme="green">Yes</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
