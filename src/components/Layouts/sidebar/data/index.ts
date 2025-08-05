import * as Icons from '../icons'

export const NAV_DATA = [
  {
    label: 'MAIN MENU',
    items: [
      {
        title: 'Dashboard',
        icon: Icons.HomeIcon,
        items: [
          {
            title: 'eCommerce',
            url: '/',
          },
        ],
      },
      {
        title: 'Categories',
        url: '/categories',
        icon: Icons.CategoriesIcon,
        items: [],
      },
      {
        title: 'Products',
        url: '/products',
        icon: Icons.ProductsIcon,
        items: [],
      },
      {
        title: 'Orders',
        url: '/orders',
        icon: Icons.ProductsIcon,
        items: [],
      },
      {
        title: 'Users',
        url: '/users',
        icon: Icons.User,
        items: [],
      },
      {
        title: 'Sellers',
        url: '/sellers',
        icon: Icons.User,
        items: [],
      },
      {
        title: 'Coupons',
        url: '/coupons',
        icon: Icons.Table, // Using Table icon as placeholder, can be updated with a proper coupon icon
        items: [
          {
            title: 'All Coupons',
            url: '/coupons',
          },
          {
            title: 'Add Coupon',
            url: '/coupons/add',
          },
          {
            title: 'Bulk Create',
            url: '/coupons/bulk',
          },
          {
            title: 'Statistics',
            url: '/coupons/stats',
          },
        ],
      },
      {
        title: 'Calendar',
        url: '/calendar',
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: 'Profile',
        url: '/profile',
        icon: Icons.User,
        items: [],
      },
      {
        title: 'Forms',
        icon: Icons.Alphabet,
        items: [
          {
            title: 'Form Elements',
            url: '/forms/form-elements',
          },
          {
            title: 'Form Layout',
            url: '/forms/form-layout',
          },
        ],
      },
      {
        title: 'Tables',
        url: '/tables',
        icon: Icons.Table,
        items: [
          {
            title: 'Tables',
            url: '/tables',
          },
        ],
      },
      {
        title: 'Pages',
        icon: Icons.Alphabet,
        items: [
          {
            title: 'Settings',
            url: '/pages/settings',
          },
        ],
      },
      {
        title: 'Shipping',
        // icon: Icons.Truck || Icons.Delivery || Icons.Table, // fallback to Table if no truck/delivery icon
        icon: Icons.Table,
        items: [
          {
            title: 'Dashboard',
            url: '/shipping',
          },
          {
            title: 'Zones',
            url: '/shipping/zones',
          },
          {
            title: 'Methods',
            url: '/shipping/methods',
          },
          {
            title: 'Rates',
            url: '/shipping/rates',
          },
          {
            title: 'Calculator',
            url: '/shipping/calculator',
          },
        ],
      },
    ],
  },
  {
    label: 'OTHERS',
    items: [
      {
        title: 'Charts',
        icon: Icons.PieChart,
        items: [
          {
            title: 'Basic Chart',
            url: '/charts/basic-chart',
          },
        ],
      },
      {
        title: 'UI Elements',
        icon: Icons.FourCircle,
        items: [
          {
            title: 'Alerts',
            url: '/ui-elements/alerts',
          },
          {
            title: 'Buttons',
            url: '/ui-elements/buttons',
          },
        ],
      },
      {
        title: 'Authentication',
        icon: Icons.Authentication,
        items: [
          {
            title: 'Sign In',
            url: '/auth/sign-in',
          },
        ],
      },
    ],
  },
]
