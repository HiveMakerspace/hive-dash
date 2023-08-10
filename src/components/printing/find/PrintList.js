import { useCallback, useMemo, useState } from 'react';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CircularProgress,
    Divider,
    FormControl,
    HStack,
    Heading,
    Icon,
    InputGroup,
    ListItem,
    Spacer,
    Text,
    Tooltip,
    UnorderedList,
    VStack,
    chakra,
    useColorModeValue
} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';

import { AsyncSelect } from 'chakra-react-select';
import { useRouter } from 'next/router';

import usePrinting from '@/contexts/printing/PrintingContext';

import usePrintParser from '@/hooks/printing/usePrintParser';
import usePrintProgress from '@/hooks/printing/usePrintProgress';

import iconSet from '@/util/icons';
import { PrintStates, StateColors } from '@/util/states';

const ChakraAsyncSelect = chakra(AsyncSelect);

function PrintListItem({ data, isActive, onClick }) {
    const { betterPrintData, printerData } = usePrintParser(data);
    const { progressMessage, progress, timeLeftHumanizedDetailed } = usePrintProgress(data);

    const progressColor = useColorModeValue('green.500', 'green.200');

    return (
        <Card
            w="100%"
            h="auto"
            as={Button}
            p={0}
            variant="outline"
            isActive={isActive}
            onClick={onClick}
            bgColor="chakra-subtle-bg"
        >
            <CardBody w="100%">
                <VStack
                    spacing={3}
                    alignItems="flex-start"
                    h="100%"
                >
                    <HStack w="100%">
                        <Tooltip label={betterPrintData.trayName}>
                            <Heading
                                size="md"
                                fontWeight="medium"
                                fontFamily="body"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                            >
                                {betterPrintData.trayName}
                            </Heading>
                        </Tooltip>
                        <Spacer />
                        <Badge
                            variant="subtle"
                            colorScheme={StateColors[betterPrintData.state]}
                        >
                            {betterPrintData.stateName}
                        </Badge>
                    </HStack>

                    <VStack
                        w="100%"
                        justify="start"
                        align="start"
                        spacing={2}
                        color="secondaryText"
                        fontSize="sm"
                    >
                        <HStack
                            spacing={2}
                            align="center"
                        >
                            <Icon as={iconSet.printer} />
                            <Text fontWeight="normal">{printerData?.displayName}</Text>
                        </HStack>
                        <HStack
                            spacing={2}
                            align="center"
                        >
                            <Icon as={iconSet.refresh} />
                            <Text fontWeight="normal">{betterPrintData.updatedAtHumanized}</Text>
                        </HStack>
                    </VStack>

                    {betterPrintData.state === PrintStates.PRINTING && (
                        <>
                            <Divider />

                            <HStack spacing={1.5}>
                                <CircularProgress
                                    value={progress}
                                    color={progressColor}
                                    size={5}
                                    thickness={8}
                                    trackColor="progressTrack"
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
                                        {timeLeftHumanizedDetailed}
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

export default function PrintList({ selectedPrintData, setSelectedPrintId }) {
    const { printers, printerTypes, queue } = usePrinting();
    const { push } = useRouter();

    const [searchTerms, setSearchTerms] = useState([]);
    // const [matchedPrints, setMatchedPrints] = useState([]);

    // const matchedPrints = useMemo(() => {
    //     if (searchTerm.length > 0) {
    //         return queue
    //             .filter(
    //                 (print) =>
    //                     print.endUser.email.toLowerCase().includes(searchTerm) ||
    //                     (print.endUser.firstname || '').toLowerCase().includes(searchTerm) ||
    //                     (print.endUser.lastname || '').toLowerCase().includes(searchTerm) ||
    //                     print.trayName.toLowerCase().includes(searchTerm) ||
    //                     dayjs(print.queuedAt).local().format('MM/DD/YYYY').includes(searchTerm)
    //             )
    //             .sort((a, b) => {
    //                 return dayjs.utc(b.queuedAt) - dayjs.utc(a.queuedAt);
    //             });
    //     } else {
    //         return [];
    //     }
    // }, [queue, searchTerm]);

    const matchedPrints = useMemo(() => {
        if (searchTerms.length < 1) {
            return [];
        }
        const matches = queue.filter((print) => {
            let match = true;
            searchTerms.forEach((term) => {
                const type = term.split(':')[0];
                const value = term.split(':')[1];

                if (type === 'email') {
                    if (!print.endUser.email.toLowerCase().includes(value)) {
                        match = false;
                    }
                } else if (type === 'name') {
                    if (
                        !(
                            (print.endUser.firstname || '').toLowerCase().includes(value) ||
                            (print.endUser.lastname || '').toLowerCase().includes(value)
                        )
                    ) {
                        match = false;
                    }
                } else if (type === 'tray') {
                    if (!print.trayName.toLowerCase().includes(value)) {
                        match = false;
                    }
                }
            });
            return match;
        });

        return matches;
    }, [searchTerms, queue]);

    const search = useCallback(
        (inputValue, callback) => {
            console.log(inputValue);
            if (inputValue.length < 1) {
                return callback([]);
            }

            let currentResults;
            if (matchedPrints.length > 0) {
                currentResults = [...matchedPrints];
            } else {
                currentResults = [...queue];
            }

            let newResults = [];

            let emails = currentResults.map((print) => print.endUser.email.toLowerCase());
            // search for email
            let emailResults = emails.filter((email) => email.includes(inputValue));
            emailResults = [...new Set(emailResults)]; //removes duplicates
            newResults.push({
                label: 'Email',
                options: emailResults.map((email) => ({
                    label: email,
                    value: `email:${email}`
                }))
            });

            let trays = currentResults.map((print) => print.trayName.toLowerCase());
            // search for email
            let traysResults = trays.filter((tray) => tray.includes(inputValue));
            traysResults = [...new Set(traysResults)]; //removes duplicates
            newResults.push({
                label: 'Tray',
                options: traysResults.map((tray) => ({
                    label: tray,
                    value: `tray:${tray}`
                }))
            });

            // //search for name
            // let nameResults = queue.filter(
            //     (print) =>
            //         (print.endUser.firstname || '').toLowerCase().includes(inputValue) ||
            //         (print.endUser.lastname || '').toLowerCase().includes(inputValue)
            // );
            // nameResults = [...new Set(nameResults)]; //removes duplicates
            // results.push({
            //     label: 'Name',
            //     options: nameResults.map((print) => ({
            //         label: `${print.endUser.firstname} ${print.endUser.lastname}`,
            //         value: `name:${print.endUser.firstname} ${print.endUser.lastname}`
            //     }))
            // });

            return callback(newResults);
        },
        [queue, matchedPrints]
    );

    return (
        <>
            <VStack
                w="375px"
                h="100%"
                spacing={3}
                alignItems="flex-start"
                justifyContent="flex-start"
            >
                <FormControl>
                    <InputGroup w="100%">
                        <ChakraAsyncSelect
                            w="100%"
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                })
                            }}
                            menuPlacement="auto"
                            isMulti
                            isClearable
                            placeholder={
                                <HStack spacing={2}>
                                    <SearchIcon />
                                    <Text>Search for a print</Text>
                                </HStack>
                            }
                            selectedOptionStyle="check"
                            loadOptions={search}
                            onChange={(value) => {
                                if (value) {
                                    setSearchTerms(value.map((term) => term.value));
                                } else {
                                    setSearchTerms([]);
                                }
                            }}
                            value={
                                searchTerms.length > 0
                                    ? searchTerms.map((term) => ({
                                          label: `${term.split(':')[0]}: ${term.split(':')[1]}`,
                                          value: term
                                      }))
                                    : null
                            }
                            noOptionsMessage={() => 'Search for something!'}
                        />
                    </InputGroup>
                </FormControl>

                <VStack
                    w="100%"
                    alignItems="flex-start"
                    spacing={3}
                    overflow="auto"
                    pt={3}
                    pr={1}
                >
                    {matchedPrints.length > 0 ? (
                        matchedPrints.map((print) => {
                            return (
                                <PrintListItem
                                    key={print._id}
                                    data={print}
                                    onClick={() => {
                                        push(`/printing/find/${print._id}`, undefined, { shallow: true });
                                    }}
                                    isActive={selectedPrintData?._id === print._id}
                                />
                            );
                        })
                    ) : (
                        <VStack
                            align="start"
                            px={3}
                        >
                            <Text fontSize="lg">Search for a print using any of the following fields:</Text>
                            <UnorderedList>
                                <ListItem>Your @gatech.edu email</ListItem>
                                <ListItem>The print&apos;s name</ListItem>
                            </UnorderedList>
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </>
    );
}
