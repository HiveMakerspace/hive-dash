import { useMemo } from 'react';
import { BsPrinterFill, BsSortNumericDown } from 'react-icons/bs';

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
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';
import usePrinterParser from '@/hooks/usePrinterParser';

import getStateColor from '@/util/getStateColor';

export default function PrinterListItem({ data, onClick, isActive, queue }) {
    const { expandedPrinterData, currentPrintData, printerTypeData } =
        usePrinterParser(data);
    const { expandedPrintData, timeLeft, progress } =
        usePrintParser(currentPrintData);

    const progressTrackColor = useColorModeValue('gray.200', 'gray.500');
    const cardColor = useColorModeValue('white.100', 'gray.700');

    return (
        <>
            {expandedPrinterData && (
                <Card
                    w="400px"
                    //minH="115px"
                    h="auto"
                    as={Button}
                    p={0}
                    variant="filled"
                    onClick={onClick}
                    isActive={isActive}
                    bgColor={cardColor}
                >
                    <CardBody w="100%">
                        <VStack spacing={3} alignItems="flex-start" h="100%">
                            <HStack w="100%">
                                <Heading
                                    size="md"
                                    fontWeight="medium"
                                    fontFamily="body"
                                >
                                    {data.displayName}
                                </Heading>
                                <Badge
                                    variant="subtle"
                                    colorScheme={getStateColor(
                                        expandedPrinterData.state
                                    )}
                                >
                                    {expandedPrinterData.state}
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
                                    <Text fontWeight="normal">
                                        {printerTypeData?.displayName}
                                    </Text>
                                </HStack>
                                <HStack spacing={2}>
                                    <BsSortNumericDown size={15} />
                                    <Text fontWeight="normal">
                                        {expandedPrinterData?.queueLength} in
                                        queue
                                    </Text>
                                </HStack>
                            </HStack>

                            {expandedPrinterData.state === 'printing' && (
                                <>
                                    <Divider />

                                    <HStack spacing={1.5}>
                                        <CircularProgress
                                            value={progress}
                                            color="green.200"
                                            size={7}
                                            thickness={8}
                                            trackColor={progressTrackColor}
                                        />
                                        <VStack
                                            align="start"
                                            justify="start"
                                            spacing={1}
                                        >
                                            <Text
                                                fontSize="md"
                                                fontWeight="medium"
                                                lineHeight={1}
                                            >
                                                {expandedPrintData.trayName}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                fontWeight="normal"
                                                color="gray.400"
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
            )}
        </>
    );
}
