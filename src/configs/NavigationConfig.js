import {
    HomeOutlined,
    UnorderedListOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {APP_PREFIX_PATH} from 'configs/AppConfig'

const dashBoardNavTree = [
    {
        key: 'home',
        path: `${APP_PREFIX_PATH}/home`,
        title: 'Home',
        icon: HomeOutlined,
        breadcrumb: false,
        submenu: []
    },
    {
        key: 'problems',
        path: `${APP_PREFIX_PATH}/problems`,
        title: 'Problems list',
        icon: UnorderedListOutlined,
        breadcrumb: false,
        submenu: []
    },
    {
        key: 'add-problem',
        path: `${APP_PREFIX_PATH}/add-problem`,
        title: 'Add problem',
        icon: PlusOutlined,
        breadcrumb: false,
        submenu: []
    }
]

const navigationConfig = [
    ...dashBoardNavTree
]

export default navigationConfig;
