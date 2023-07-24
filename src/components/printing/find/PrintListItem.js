import { BsCalendarFill, BsPrinterFill } from 'react-icons/bs';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    Divider,
    HStack,
    Heading,
    Spacer,
    Text,
    Tooltip,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';

import getStateColor from '@/util/getStateColor';

export default function PrintListItem({ data, isActive, onClick }) {
    const { expandedPrintData, progressMessage, printerData, progress, timeLeft } = usePrintParser(data);

    const progressTrackColor = useColorModeValue('gray.200', 'gray.500');

    return (
        <Card
            w="100%"
            h="auto"
            as={Button}
            p={0}
            variant="filled"
            isActive={isActive}
            onClick={onClick}
        >
            <CardBody w="100%">
                <VStack
                    spacing={3}
                    alignItems="flex-start"
                    h="100%"
                >
                    <HStack w="100%">
                        <Tooltip label={expandedPrintData.trayName}>
                            <Heading
                                size="md"
                                fontWeight="medium"
                                fontFamily="body"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                            >
                                {expandedPrintData.trayName}
                            </Heading>
                        </Tooltip>
                        <Badge
                            variant="subtle"
                            colorScheme={getStateColor(expandedPrintData.latestEvent)}
                        >
                            {expandedPrintData.latestEvent}
                        </Badge>
                    </HStack>

                    <HStack
                        w="100%"
                        justifyContent="flex-start"
                        spacing={5}
                        color="gray.300"
                    >
                        <HStack spacing={2}>
                            <BsPrinterFill size={15} />
                            <Text fontWeight="normal">{printerData?.displayName}</Text>
                        </HStack>
                        <HStack spacing={2}>
                            <BsCalendarFill size={15} />
                            <Text fontWeight="normal">{expandedPrintData.queuedAtFormatted}</Text>
                        </HStack>
                    </HStack>

                    {expandedPrintData.printing && (
                        <>
                            <Divider />

                            <HStack spacing={1.5}>
                                <CircularProgress
                                    value={progress}
                                    color="green.200"
                                    size={5}
                                    thickness={8}
                                    trackColor={progressTrackColor}
                                />
                                <VStack
                                    align="start"
                                    justify="start"
                                    spacing={1}
                                >
                                    <Text
                                        fontSize="lg"
                                        fontWeight="medium"
                                        lineHeight={1}
                                    >
                                        {timeLeft}
                                    </Text>
                                </VStack>
                            </HStack>
                        </>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );
}
