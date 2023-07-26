import { useContext, useMemo, useState } from 'react';

import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Select,
    Switch,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Textarea,
    Th,
    Thead,
    Tr,
    VStack,
    chakra,
    useColorModeValue,
    useDisclosure
} from '@chakra-ui/react';

import { DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import Editor from '@monaco-editor/react';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import ReactMarkdown from 'react-markdown';

import dayjs from '@/lib/time';

import PrintingContext from '@/contexts/printing/PrintingContext';

import usePrintEvents from '@/hooks/usePrintEvents';
import usePrintUpdate from '@/hooks/usePrintUpdate';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

import DeleteDialog from '@/components/DeleteDIalog';
import UpdateModal from '@/components/printing/printers/UpdateModal';

const ChakraEditor = chakra(Editor);

function SectionHeader({ children }) {
    return (
        <Heading
            size="lg"
            fontFamily="body"
        >
            {children}
        </Heading>
    );
}

function Section({ children }) {
    return (
        <VStack
            align="start"
            spacing={3}
        >
            {children}
        </VStack>
    );
}

function ThColored({ children }) {
    return <Th borderColor="gray.600">{children}</Th>;
}

function TdColored({ children }) {
    return <Td borderColor="gray.600">{children}</Td>;
}

function UserInfo({ printData, update }) {
    return (
        <VStack
            align="start"
            spacing={3}
            w="full"
        >
            <SectionHeader>End user info</SectionHeader>
            <HStack spacing={3}>
                <FormControl>
                    <FormLabel>First name</FormLabel>
                    <InputGroup>
                        <Input
                            value={printData.endUser.firstname}
                            onChange={(e) => {
                                update({ endUser: { ...printData.endUser, firstname: e.target.value } });
                            }}
                        />
                    </InputGroup>
                </FormControl>

                <FormControl>
                    <FormLabel>Last name</FormLabel>
                    <InputGroup>
                        <Input
                            value={printData.endUser.lastname}
                            onChange={(e) => {
                                update({ endUser: { ...printData.endUser, lastname: e.target.value } });
                            }}
                        />
                    </InputGroup>
                </FormControl>
            </HStack>
            <FormControl>
                <FormLabel>GT email</FormLabel>
                <InputGroup>
                    <Input
                        value={printData.endUser.email}
                        onChange={(e) => {
                            update({ endUser: { ...printData.endUser, email: e.target.value } });
                        }}
                    />
                    <InputRightAddon>@gatech.edu</InputRightAddon>
                </InputGroup>
            </FormControl>
        </VStack>
    );
}

function PrintInfo({ printData, update }) {
    const { printers, printerTypes } = useContext(PrintingContext);

    const selectedPrinterData = useMemo(() => {
        return printers.find((p) => p.id === printData.printer);
    }, [printData.printer, printers]);

    const selectedPrinterTypeData = useMemo(() => {
        return printerTypes.find((p) => p.id === selectedPrinterData.type);
    }, [selectedPrinterData, printerTypes]);

    const [durationInput, setDurationInput] = useState(dayjs.duration(printData.estTime).format('HH:mm'));

    return (
        <VStack
            align="start"
            spacing={3}
            w="full"
        >
            <SectionHeader>Print info</SectionHeader>
            <FormControl>
                <FormLabel>Print name</FormLabel>
                <InputGroup>
                    <Input
                        value={printData.trayName}
                        onChange={(e) => {
                            update({ trayName: e.target.value });
                        }}
                    />
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Queued by</FormLabel>
                <InputGroup>
                    <Input
                        placeholder="PI name"
                        value={printData.queuedBy}
                        onChange={(e) => {
                            update({ queuedBy: e.target.value });
                        }}
                    />
                </InputGroup>
                <FormHelperText>make this an autocomplete @colin</FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Printer</FormLabel>
                <InputGroup>
                    <Select
                        value={printData.printer}
                        onChange={(e) => {
                            update({ printer: e.target.value });
                        }}
                    >
                        {printers.map((printer) => (
                            <option
                                value={printer.id}
                                key={printer.id}
                            >
                                {printer.displayName} ({printer.type})
                            </option>
                        ))}
                    </Select>
                </InputGroup>
                <FormHelperText>i feel like some helper text will be useful here</FormHelperText>
            </FormControl>

            <HStack
                spacing={3}
                w="full"
            >
                <FormControl>
                    <FormLabel>Material type</FormLabel>
                    <InputGroup>
                        <Select
                            value={printData.materialTyoe}
                            onChange={(e) => {
                                update({ materialType: e.target.value });
                            }}
                        >
                            {selectedPrinterTypeData?.materials?.map((material) => (
                                <option
                                    value={material}
                                    key={material}
                                >
                                    {material}
                                </option>
                            ))}
                        </Select>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Material usage</FormLabel>
                    <InputGroup>
                        <Input
                            value={printData.materialUsage}
                            onChange={(e) => {
                                update({ materialUsage: e.target.value });
                            }}
                        />
                        <InputRightAddon>{selectedPrinterTypeData.materialUnits.symbol}</InputRightAddon>
                    </InputGroup>
                </FormControl>
            </HStack>
            <FormControl>
                <FormLabel>Estimated time</FormLabel>
                <InputGroup>
                    <Input
                        value={durationInput}
                        onChange={(e) => {
                            setDurationInput(e.target.value);
                        }}
                        onBlur={() => {
                            update({
                                estTime: dayjs
                                    .duration({
                                        hours: durationInput.split(':')[0],
                                        minutes: durationInput.split(':')[1]
                                    })
                                    .toISOString()
                            });
                        }}
                    />
                </InputGroup>
                <FormHelperText>format is HH:MM</FormHelperText>
            </FormControl>
        </VStack>
    );
}

function Events({ printData, update }) {
    const { detailedEvents } = usePrintEvents(printData);

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isNotesOpen, onOpen: onNotesOpen, onClose: onNotesClose } = useDisclosure();
    const [selectedEventData, setSelectedEventData] = useState(null);

    return (
        <>
            <DeleteDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onDelete={() => {
                    let newEvents = [...printData.events.filter((e) => e.timestamp !== selectedEventData.timestamp)];
                    update({ events: newEvents });
                }}
                header="Delete event"
                message="Are you sure you want to delete this event? This action cannot be undone."
            />

            <UpdateModal
                isOpen={isNotesOpen}
                onClose={onNotesClose}
                eventData={selectedEventData}
                save={(data) => {
                    let newEvents = [...printData.events.filter((e) => e.timestamp !== data.timestamp), data];
                    update({ events: newEvents });
                    onNotesClose();
                }}
            />
            <VStack
                align="start"
                spacing={3}
                w="full"
            >
                <SectionHeader>Events</SectionHeader>

                <TableContainer w="full">
                    <Table>
                        <Thead>
                            <ThColored>Event (newest first)</ThColored>
                            <ThColored>Actions</ThColored>
                        </Thead>
                        <Tbody>
                            {detailedEvents.map((event) => {
                                return (
                                    <Tr key={event.timestamp}>
                                        <TdColored borderColor="gray.400">
                                            <HStack
                                                justify="start"
                                                spacing={3}
                                            >
                                                {event.icon}

                                                <VStack
                                                    align="start"
                                                    spacing={1}
                                                >
                                                    <Text
                                                        lineHeight={1}
                                                        fontSize="md"
                                                    >
                                                        {event.description}
                                                    </Text>
                                                    <Text fontSize="xs">{event.formattedTimestamp}</Text>
                                                </VStack>
                                            </HStack>
                                        </TdColored>
                                        <TdColored>
                                            <ButtonGroup size="sm">
                                                <Button
                                                    rightIcon={<ExternalLinkIcon />}
                                                    onClick={() => {
                                                        setSelectedEventData(event);
                                                        onNotesOpen();
                                                    }}
                                                >
                                                    Edit notes
                                                </Button>
                                                <IconButton
                                                    colorScheme="red"
                                                    onClick={() => {
                                                        setSelectedEventData(event);
                                                        onDeleteOpen();
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ButtonGroup>
                                        </TdColored>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </VStack>
        </>
    );
}

function Notes({ printData, update }) {
    return (
        <VStack
            align="start"
            spacing={3}
            w="full"
            h="auto"
        >
            <SectionHeader>Print notes</SectionHeader>
            <FormControl
                h="240px"
                display="flex"
                flexDir="column"
            >
                <FormLabel>Notes</FormLabel>
                <InputGroup flexGrow={1}>
                    <Textarea
                        h="full"
                        value={printData.notes}
                        onChange={(e) => {
                            update({ notes: e.target.value });
                        }}
                    />
                </InputGroup>
                <FormHelperText>
                    Info about the print (i.e. reason for cancellation, etc). Markdown is supported.
                </FormHelperText>
            </FormControl>

            <Card
                variant="outline"
                bgColor="transparent"
                w="full"
                h="240px"
                overflow="scroll"
            >
                <CardBody
                    overflow="auto"
                    h="full"
                >
                    <ReactMarkdown
                        components={ChakraUIRenderer()}
                        skipHtml
                    >
                        {printData.notes}
                    </ReactMarkdown>
                </CardBody>
            </Card>
        </VStack>
    );
}

function PrintState({ printData, update }) {
    return (
        <VStack
            align="start"
            spacing={3}
            maxW="full"
        >
            <SectionHeader>Print state</SectionHeader>

            {/* <HStack
                w="full"
                spacing={3}
                align="start"
            > */}
            <FormControl>
                <FormLabel>State</FormLabel>
                <InputGroup>
                    <ButtonGroup
                        orientation="vertical"
                        isAttached
                        variant="outline"
                    >
                        {Object.keys(PrintStates).map((state) => {
                            let val = PrintStates[state];
                            return (
                                <Button
                                    colorScheme={(printData.state === val && StateColors[val]) || null}
                                    key={state}
                                    isActive={printData.state === val}
                                    onClick={() => {
                                        update({ state: val });
                                    }}
                                >
                                    {state}
                                </Button>
                            );
                        })}
                    </ButtonGroup>
                </InputGroup>
                <FormHelperText>
                    Change the print&apos;s state. This will not add an entry to the print&apos;s events history and
                    might break things.
                </FormHelperText>
            </FormControl>
            {/* </HStack> */}
        </VStack>
    );
}

function DangerousActions({ printData, update, onClose }) {
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const [deleting, setDeleting] = useState(false);
    const { remove } = usePrintUpdate();

    function deletePrint() {
        setDeleting(true);
        remove(printData._id)
            .then(() => {
                setDeleting(false);
                onClose();
            })
            .catch(() => {
                setDeleting(false);
            });
    }

    return (
        <>
            <DeleteDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onDelete={deletePrint}
                header="Delete print"
                message="Are you sure you want to delete this print? This action cannot be undone."
            />

            <VStack
                align="start"
                spacing={3}
            >
                <SectionHeader>Dangerous actions</SectionHeader>

                <FormControl>
                    <FormLabel>Actions</FormLabel>
                    <ButtonGroup>
                        <Button
                            colorScheme="red"
                            leftIcon={<Icon as={iconSet.delete} />}
                            onClick={onDeleteOpen}
                            isLoading={deleting}
                        >
                            Delete print
                        </Button>
                    </ButtonGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Manually edit print JSON</FormLabel>
                    <InputGroup>
                        <ChakraEditor
                            height="300px"
                            width="100%"
                            language="json"
                            theme={useColorModeValue('vs-light', 'vs-dark')}
                            options={{
                                minimap: {
                                    enabled: false
                                }
                            }}
                            defaultValue={JSON.stringify(printData, null, 4)}
                            onChange={(value) => {
                                update(JSON.parse(value));
                            }}
                        />
                    </InputGroup>
                    <FormHelperText>
                        Editing this is dangerous and should probably only be done as a last resort. Only edit this if
                        you know what you&apos;re doing.
                    </FormHelperText>
                </FormControl>
            </VStack>
        </>
    );
}

export { PrintState, UserInfo, PrintInfo, Events, Notes, DangerousActions };