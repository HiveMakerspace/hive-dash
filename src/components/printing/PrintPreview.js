import { useMemo } from 'react';

import {
    Badge,
    Box,
    Card,
    CardBody,
    CircularProgress,
    CircularProgressLabel,
    Divider,
    Flex,
    HStack,
    Icon,
    Progress,
    Spacer,
    Text,
    VStack,
    useColorModeValue
} from '@chakra-ui/react';

import usePrintParser from '@/hooks/usePrintParser';
import usePrintProgress from '@/hooks/usePrintProgress';
import useTextColor from '@/hooks/useTextColor';

import iconSet from '@/util/icons';

export default function PrintPreview({ print }) {
    const { betterPrintData, printerData, updatedAtHumanized, printerTypeData } = usePrintParser(print);
    const {
        progressBarColor,
        progressMessage,
        progress,
        progressMessageColor,
        timeLeftHumanized,
        timeLeftHumanizedDetailed
    } = usePrintProgress(print);

    const { secondaryAlt, secondary } = useTextColor();

    const dataFields = useMemo(() => {
        return [
            {
                label: 'Printer',
                icon: iconSet.printer,
                value: printerData.displayName
            },
            {
                label: 'Material',
                icon: iconSet.material,
                value: betterPrintData.materialType
            },
            {
                label: 'Est. material',
                icon: iconSet.material,
                value: betterPrintData.materialUsage,
                suffix: betterPrintData.materialSymbol
            },
            {
                label: 'Est. time',
                icon: iconSet.clock,
                value: betterPrintData.estTimeFormatted
            }
        ];
    }, [printerData, betterPrintData]);

    return (
        <Card
            w="100%"
            h="auto"
            variant="outline"
            background="transparent"
            overflow="hidden"
            //bgColor={useColorModeValue('gray.200', 'gray.600')}
        >
            <CardBody
                p={0}
                w="full"
                overflow="hidden"
            >
                <Box
                    p={5}
                    pb={3}
                    maxW="full"
                >
                    <VStack
                        w="full"
                        h="auto"
                        align="start"
                        justify="start"
                        spacing={3}
                        oveflow="hidden"
                    >
                        <HStack w="full">
                            <CircularProgress
                                size={16}
                                thickness={6}
                                value={progress}
                                color={useColorModeValue(`${progressBarColor}.500`, `${progressBarColor}.200`)}
                                trackColor={useColorModeValue('gray.100', 'gray.700')}
                            />
                            <VStack
                                align="start"
                                justify="start"
                                spacing={1}
                            >
                                <HStack>
                                    <Text
                                        fontSize="2xl"
                                        lineHeight={1}
                                        fontWeight="medium"
                                    >
                                        {betterPrintData.trayName}
                                    </Text>
                                </HStack>
                                <HStack
                                    fontSize="md"
                                    color={secondaryAlt}
                                    spacing={2}
                                >
                                    <Icon as={iconSet.clock} />
                                    <Text fontSize="sm">{timeLeftHumanizedDetailed}</Text>
                                </HStack>
                            </VStack>
                            <Spacer />
                            <VStack
                                spacing={1}
                                color={secondary}
                                justify="center"
                                h="full"
                            >
                                <HStack
                                    h="full"
                                    w="full"
                                    align="center"
                                    justify="start"
                                    fontSize="sm"
                                >
                                    <Icon as={iconSet.calendarAdd} />
                                    <Text>{betterPrintData.queuedAtFormatted}</Text>
                                </HStack>
                                <HStack
                                    h="full"
                                    w="full"
                                    align="center"
                                    justify="start"
                                    fontSize="sm"
                                >
                                    <Icon as={iconSet.person} />
                                    <Text>
                                        {betterPrintData.endUser.firstname} {betterPrintData.endUser.lastname}
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>
                        <Divider w="full" />

                        <HStack
                            w="full"
                            h="auto"
                        >
                            <HStack
                                w="auto"
                                h="auto"
                                align="center"
                                justify="start"
                                pb={2}
                                spacing={6}
                                overflow="auto"
                                whiteSpace="nowrap"
                                // borderRight={actions && '1px'}
                                // borderRightColor={actions && 'chakra-border-color'}
                            >
                                {dataFields.map((field, i) => {
                                    return (
                                        <>
                                            <VStack
                                                spacing={1}
                                                align="start"
                                            >
                                                <HStack
                                                    fontSize="sm"
                                                    color={secondaryAlt}
                                                >
                                                    <Icon as={field.icon} />
                                                    <Text>{field.label}</Text>
                                                </HStack>
                                                <HStack
                                                    alignItems="end"
                                                    spacing={1}
                                                >
                                                    <Text
                                                        fontSize="2xl"
                                                        fontWeight="semibold"
                                                        lineHeight={1}
                                                    >
                                                        {field.value}
                                                    </Text>
                                                    {field.suffix && <Text fontSize="sm">{field.suffix}</Text>}
                                                </HStack>
                                            </VStack>
                                            {i < dataFields.length - 1 && (
                                                <Divider
                                                    orientation="vertical"
                                                    h="50px"
                                                />
                                            )}
                                        </>
                                    );
                                })}
                            </HStack>
                            {/* <Spacer />
                            <VStack
                                h="full"
                                justify="end"
                            >
                                {actions}
                            </VStack> */}
                        </HStack>
                    </VStack>
                </Box>
                <Flex
                    w="full"
                    h="auto"
                    align="center"
                    justify="end"
                    dir="row"
                    py={1}
                    px={3}
                    borderTop="1px"
                    borderColor="chakra-border-color"
                    gap={3}
                >
                    {/* <Badge fontSize="2xs">{progressMessage}</Badge>
                    <Spacer /> */}
                    <HStack
                        fontSize="xs"
                        color={secondary}
                        spacing={1}
                    >
                        <Icon as={iconSet.peerInstructor} />
                        <Text>{betterPrintData.queuedBy}</Text>
                    </HStack>
                    <HStack
                        fontSize="xs"
                        color={secondary}
                        spacing={1}
                    >
                        <Icon as={iconSet.refresh} />
                        <Text>{betterPrintData.updatedAtHumanized}</Text>
                    </HStack>
                </Flex>
            </CardBody>
        </Card>
    );
}
