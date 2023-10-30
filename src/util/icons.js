import {
    AddIcon,
    ArrowBackIcon,
    ArrowDownIcon,
    ArrowForwardIcon,
    ArrowUpIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CloseIcon,
    CopyIcon,
    DeleteIcon,
    DownloadIcon,
    ExternalLinkIcon,
    HamburgerIcon,
    MoonIcon,
    RepeatIcon,
    SearchIcon,
    SettingsIcon,
    SunIcon,
    TimeIcon
} from '@chakra-ui/icons';

import { BsDot } from 'react-icons/bs';
import {
    FaBoxOpen,
    FaCalendar,
    FaCalendarPlus,
    FaCamera,
    FaCodeBranch,
    FaCubes,
    FaIdCard,
    FaMinusCircle,
    FaPlay,
    FaPrint,
    FaSave,
    FaSitemap,
    FaSortNumericDown,
    FaStop,
    FaTable,
    FaTachometerAlt,
    FaToggleOn,
    FaUser,
    FaUserCog,
    FaUserPlus,
    FaUsers,
    FaWrench
} from 'react-icons/fa';
import {
    FaArrowRightToBracket,
    FaBarsProgress,
    FaFaceSmile,
    FaLink,
    FaNoteSticky,
    FaPencil,
    FaRightFromBracket,
    FaTableCellsLarge,
    FaTableList,
    FaTimeline
} from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';

const iconSet = {
    wrench: FaWrench,
    play: FaPlay,
    x: CloseIcon,
    check: CheckIcon,
    printer: FaPrint,
    download: DownloadIcon,
    queue: FaSortNumericDown,
    calendar: FaCalendar,
    calendarAdd: FaCalendarPlus,
    search: SearchIcon,
    settings: SettingsIcon,
    dashboard: FaTachometerAlt,
    add: AddIcon,
    table: FaTable,
    pencil: FaPencil,
    smile: FaFaceSmile,
    site: FaSitemap,
    toggles: FaToggleOn,
    note: FaNoteSticky,
    stop: FaStop,
    moon: MoonIcon,
    sun: SunIcon,
    external: ExternalLinkIcon,
    delete: DeleteIcon,
    save: FaSave,
    person: FaUser,
    people: FaUsers,
    personPlus: FaUserPlus,
    copy: CopyIcon,
    peerInstructor: FaUserCog,
    clock: TimeIcon,
    material: FaCubes,
    materialAmount: FaBarsProgress,
    logout: FaRightFromBracket,
    sendTo: FaArrowRightToBracket,
    refresh: RepeatIcon,
    branch: FaCodeBranch,
    rightArrow: ArrowForwardIcon,
    timeline: FaTimeline,
    leftArrow: ArrowBackIcon,
    camera: FaCamera,
    dot: BsDot,
    paginateDot: GoDotFill,
    buzzCard: FaIdCard,
    link: FaLink,
    list: FaTableList,
    grid: FaTableCellsLarge,
    minus: FaMinusCircle,
    hamburger: HamburgerIcon,
    dropdownClosed: ChevronDownIcon,
    dropdownOpened: ChevronUpIcon,
    upArrow: ArrowUpIcon,
    downArrow: ArrowDownIcon,
    boxes: FaBoxOpen
};

export default iconSet;
