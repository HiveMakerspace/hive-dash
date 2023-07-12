import { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Divider,
    Flex,
    VStack,
    useColorModeValue,
    Spacer
} from '@chakra-ui/react';
import {
    AiFillDashboard,
    AiFillPrinter,
    AiOutlinePlus,
    AiOutlineSearch
} from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

export default function Navigation(props) {
    const pathname = usePathname();
    const [pathPage, setPathPage] = useState('');

    useEffect(() => {
        setPathPage(pathname.split('/')[2]);
    }, [pathname]);

    return (
        <>
            <Flex
                direction="column"
                w="260px"
                h="calc(100% - 80px)"
                top="80px"
                position="fixed"
                borderRight="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
                <VStack p={2} h="100%">
                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        colorScheme="green"
                        as={NextLink}
                        href="/printing/newprint"
                        isActive={pathPage === 'newprint'}
                        leftIcon={<AiOutlinePlus />}
                    >
                        New print
                    </Button>

                    <Divider />

                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        as={NextLink}
                        href="/printing/dashboard"
                        isActive={pathPage === 'dashboard'}
                        leftIcon={<AiFillDashboard />}
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        as={NextLink}
                        href="/printing/printers"
                        isActive={pathPage === 'printers'}
                        leftIcon={<AiFillPrinter />}
                    >
                        Printers
                    </Button>
                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        as={NextLink}
                        href="/printing/find"
                        isActive={pathPage === 'find'}
                        leftIcon={<AiOutlineSearch />}
                    >
                        Find a print
                    </Button>

                    <Spacer />

                    <Button
                        variant="ghost"
                        w="100%"
                        justifyContent="flex-start"
                        as={NextLink}
                        href="/printing/knowledge"
                        isActive={pathPage === 'knowledge'}
                        leftIcon={<AiOutlineSearch />}
                    >
                        Knowledge base
                    </Button>
                </VStack>
            </Flex>
        </>
    );
}