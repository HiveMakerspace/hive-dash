import { useCallback, useMemo, useState } from 'react';

import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Divider,
    HStack,
    Heading,
    Icon,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Text,
    VStack,
    useDisclosure
} from '@chakra-ui/react';

import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';

import dayjs from '@/lib/time';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintUpdate from '@/hooks/printing/usePrintUpdate';

import iconSet from '@/util/icons';
import { PrintStates } from '@/util/states';

import PrintEditorModal from '@/components/printing/printEdit/PrintEditorModal';
import UpdateModal from '@/components/printing/printers/UpdateModal';
import Timeline from '@/components/printing/prints/Timeline';

export default function PrintInfo({ selectedPrintData }) {
    const router = useRouter();

    const { betterPrintData, printerData } = usePrintParser(selectedPrintData);

    const { isOpen: isEditorOpen, onOpen: onEditorOpen, onClose: onEditorClose } = useDisclosure();
    const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();

    const [cancelEventData, setCancelEventData] = useState(null);

    const { update: printUpdater } = usePrintUpdate();

    const cancelPrint = useCallback(() => {
        setCancelEventData({
            type: PrintStates.CANCELED,
            notes: '',
            timestamp: dayjs.utc().toISOString()
        });
        onCancelOpen();
    }, [onCancelOpen]);

    const confirmCancel = useCallback(
        (event) => {
            let data = {
                ...selectedPrintData,
                state: PrintStates.CANCELED,
                events: [event, ...selectedPrintData.events]
            };
            printUpdater(selectedPrintData._id, data);
            onCancelClose();
        },
        [printUpdater, onCancelClose, selectedPrintData]
    );

    const dataFields = useMemo(() => {
        return [
            {
                label: 'Printer',
                icon: iconSet.printer,
                value: printerData?.displayName || betterPrintData?.printer,
                link: `/printing/printers/${betterPrintData?.printer}`
            },
            {
                label: 'Material',
                icon: iconSet.material,
                value: betterPrintData?.materialType
            },
            {
                label: 'Est. material',
                icon: iconSet.materialAmount,
                value: betterPrintData?.materialUsage,
                suffix: betterPrintData?.materialSymbol
            },
            {
                label: 'Est. time',
                icon: iconSet.clock,
                value: betterPrintData?.estTimeFormatted
            }
        ];
    }, [printerData, betterPrintData]);

    return (
        <>
            {selectedPrintData && (
                <>
                    <UpdateModal
                        isOpen={isCancelOpen}
                        onClose={onCancelClose}
                        eventData={cancelEventData}
                        save={(event) => {
                            confirmCancel(event);
                        }}
                    />
                    <PrintEditorModal
                        isOpen={isEditorOpen}
                        onClose={onEditorClose}
                        initialData={selectedPrintData}
                    />
                </>
            )}
            {selectedPrintData ? (
                <>
                    <VStack
                        position="relative"
                        w="100%"
                        h="auto"
                        justify="center"
                        align="start"
                        spacing={3}
                        px={1}
                    >
                        {selectedPrintData.state === PrintStates.CANCELED && (
                            <Box
                                w="100%"
                                h="auto"
                            >
                                <Alert
                                    status="error"
                                    borderRadius={5}
                                >
                                    <AlertIcon />
                                    <AlertDescription>This print has been canceled</AlertDescription>
                                </Alert>
                            </Box>
                        )}

                        {/* {printerData?.type === 'stratasys' &&
                                        selectedPrintData.state !== PrintStates.CANCELED ? (
                                            <Box
                                                w="100%"
                                                h="auto"
                                            >
                                                <Alert
                                                    status="warning"
                                                    borderRadius={5}
                                                >
                                                    <AlertIcon />
                                                    <AlertDescription>
                                                        This print uses QSR supports, which we will remove for you.
                                                        Expect it to be ready one business day later than the print
                                                        completion date.
                                                    </AlertDescription>
                                                </Alert>
                                            </Box>
                                        ) : null} */}

                        <HStack
                            w="full"
                            position="relative"
                            overflow="hidden"
                        >
                            <VStack
                                align="start"
                                justify="start"
                                spacing={3}
                            >
                                <Heading
                                    size="lg"
                                    fontWeight="semibold"
                                >
                                    {betterPrintData.trayName}
                                </Heading>
                                <HStack
                                    w="auto"
                                    h="auto"
                                    align="center"
                                    justify="start"
                                    pb={2}
                                    spacing={3}
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
                                                        alignItems="center"
                                                        spacing={2}
                                                        color="secondaryText"
                                                    >
                                                        <Icon
                                                            fontSize="lg"
                                                            as={field.icon}
                                                        />
                                                        <HStack
                                                            align="end"
                                                            spacing={1}
                                                            height="full"
                                                        >
                                                            <Text
                                                                as={field.link ? Link : 'span'}
                                                                fontSize="xl"
                                                                fontWeight="medium"
                                                                lineHeight={1}
                                                                href={field?.link}
                                                            >
                                                                {field.value}
                                                            </Text>
                                                            {field.suffix && <Text fontSize="sm">{field.suffix}</Text>}
                                                        </HStack>
                                                    </HStack>
                                                </VStack>
                                                {i < dataFields.length - 1 && (
                                                    <Icon
                                                        color="secondaryText"
                                                        fontSize="sm"
                                                        as={iconSet.dot}
                                                    />
                                                )}
                                            </>
                                        );
                                    })}
                                </HStack>
                            </VStack>
                            <Spacer />
                            <Menu strategy="fixed">
                                <MenuButton
                                    as={IconButton}
                                    icon={<Icon as={iconSet.hamburger} />}
                                />
                                <MenuList>
                                    <MenuItem
                                        icon={<Icon as={iconSet.pencil} />}
                                        onClick={onEditorOpen}
                                    >
                                        Edit print
                                    </MenuItem>
                                    <MenuItem
                                        icon={<Icon as={iconSet.minus} />}
                                        onClick={cancelPrint}
                                        isDisabled={
                                            selectedPrintData.state === PrintStates.CANCELED ||
                                            selectedPrintData.state === PrintStates.COMPLETED
                                        }
                                    >
                                        Cancel print
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </HStack>

                        <Divider />

                        <Timeline print={selectedPrintData} />

                        <HStack
                            w="full"
                            h="full"
                            minH="300px"
                            align="start"
                            spacing={5}
                            flexGrow={1}
                        >
                            <VStack
                                w="50%"
                                h="full"
                                spacing={1}
                                align="start"
                            >
                                <HStack>
                                    <Icon as={iconSet.camera} />
                                    <Text
                                        fontSize="xl"
                                        fontWeight="medium"
                                    >
                                        Preview
                                    </Text>
                                </HStack>
                                <Image
                                    src={
                                        betterPrintData.preview ||
                                        'https://firebasestorage.googleapis.com/v0/b/hive-af57a.appspot.com/o/previews%2Fu2!?alt=media&token=2571082c-e369-400e-b428-27a1c51564ee'
                                    }
                                    alt="print preview"
                                    width={512}
                                    height={512}
                                    style={{
                                        width: 'auto',
                                        height: 'auto',
                                        alignSelf: 'center'
                                    }}
                                />
                            </VStack>

                            <Divider
                                orientation="vertical"
                                h="full"
                            />

                            <VStack
                                w="50%"
                                h="full"
                                align="start"
                            >
                                <HStack>
                                    <Icon as={iconSet.note} />
                                    <Text
                                        fontSize="xl"
                                        fontWeight="medium"
                                    >
                                        Notes
                                    </Text>
                                </HStack>
                                {selectedPrintData.notes?.length > 0 ? (
                                    <>
                                        <ReactMarkdown
                                            components={ChakraUIRenderer()}
                                            skipHtml
                                        >
                                            {selectedPrintData?.notes || 'test'}
                                        </ReactMarkdown>
                                    </>
                                ) : (
                                    <VStack
                                        justify="center"
                                        align="center"
                                        h="full"
                                    >
                                        <Text
                                            w="full"
                                            h="full"
                                            color={'secondaryText'}
                                            textAlign="center"
                                        >
                                            No notes are attached to this print.
                                        </Text>
                                    </VStack>
                                )}
                            </VStack>
                        </HStack>
                    </VStack>
                </>
            ) : (
                <VStack
                    minH="100%"
                    w="100%"
                    justify="center"
                >
                    <Text color="gray.400">select a print</Text>
                </VStack>
            )}
        </>
    );
}