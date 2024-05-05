'use client'
import Link from 'next/link'
import { useEffect, Fragment, useState, useContext } from 'react'
import { Menu, Dialog, Popover, Tab, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import { classNames } from '@/lib/utils'
import { CartContext } from '../provider'

const navigation = {
  categories: [
    {
      id: 'product',
      name: 'Products',
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'New Arrival', href: '/products' },
            { name: 'Tees', href: '/products?category=tees' },
            { name: 'Hoodies', href: '/products?category=hoodies' },
            { name: 'Sweatshirts', href: '/products?category=sweatshirts' },
            {
              name: 'Long Sleeve Tees',
              href: '/products?category=long-sleeve-tees',
            },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Caps', href: '/products?category=caps' },
            { name: 'Mugs', href: '/products?category=mugs' },
            { name: 'Bags', href: '/products?category=bags' },
            { name: 'Notebooks', href: '/products?category=notebooks' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '#' },
    { name: 'Stores', href: '#' },
  ],
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const session = useSession()
  const status = session.status
  const email = session.data?.user?.email
  const [image, setImage] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const { cartProducts, removeCartProduct } = useContext(CartContext)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/profile').then((response) => {
        response.json().then((data) => {
          setImage(data.image)
          setIsAdmin(data.admin)
        })
      })
    }
  }, [status])

  let subtotal = 0
  for (const p of cartProducts) {
    subtotal += p.price
  }

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-40 lg:hidden' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 z-40 flex'>
            <Transition.Child
              as={Fragment}
              enter='transition ease-in-out duration-300 transform'
              enterFrom='-translate-x-full'
              enterTo='translate-x-0'
              leave='transition ease-in-out duration-300 transform'
              leaveFrom='translate-x-0'
              leaveTo='-translate-x-full'
            >
              <Dialog.Panel className='relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl'>
                <div className='flex px-4 pb-2 pt-5'>
                  <button
                    type='button'
                    className='relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400'
                    onClick={() => setOpen(false)}
                  >
                    <span className='absolute -inset-0.5' />
                    <span className='sr-only'>Close menu</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>

                {/* Links */}
                <div className='space-y-10 px-4 pb-8 pt-10'>
                  {navigation.categories[0].sections.map((section) => (
                    <div key={section.name}>
                      <p
                        id={`${section.id}-heading-mobile`}
                        className='font-medium text-gray-900'
                      >
                        {section.name}
                      </p>
                      <ul
                        role='list'
                        aria-labelledby={`${section.id}-heading-mobile`}
                        className='mt-6 flex flex-col space-y-6'
                      >
                        {section.items.map((item) => (
                          <li key={item.name} className='flow-root'>
                            <a
                              href={item.href}
                              className='-m-2 block p-2 text-gray-500'
                            >
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className='space-y-6 border-t border-gray-200 px-4 py-6'>
                  {navigation.pages.map((page) => (
                    <div key={page.name} className='flow-root'>
                      <a
                        href={page.href}
                        className='-m-2 block p-2 font-medium text-gray-900'
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={cartOpen} as={Fragment}>
        <Dialog className='relative z-40' onClose={setCartOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-in-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in-out duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                    <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
                      <div className='flex-1 overflow-y-auto px-4 py-6 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-lg font-medium text-gray-900'>
                            Shopping cart
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='relative -m-2 p-2 text-gray-400 hover:text-gray-500'
                              onClick={() => setCartOpen(false)}
                            >
                              <span className='absolute -inset-0.5' />
                              <span className='sr-only'>Close panel</span>
                              <XMarkIcon
                                className='h-6 w-6'
                                aria-hidden='true'
                              />
                            </button>
                          </div>
                        </div>

                        <div className='mt-8'>
                          <div className='flow-root'>
                            <ul
                              role='list'
                              className='-my-6 divide-y divide-gray-200'
                            >
                              {cartProducts?.length > 0 &&
                                cartProducts.map((product: any, i: any) => (
                                  <li key={i} className='flex py-6'>
                                    <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                                      <img
                                        src={product.image}
                                        //alt={product.imageAlt}
                                        className='h-full w-full object-cover object-center'
                                      />
                                    </div>

                                    <div className='ml-4 flex flex-1 flex-col'>
                                      <div>
                                        <div className='flex justify-between text-base font-medium text-gray-900'>
                                          <h3>
                                            {/* <a href={product.href}> */}
                                            {product.name}
                                            {/* </a> */}
                                          </h3>
                                          <p className='ml-4'>
                                            ${product.price}
                                          </p>
                                        </div>
                                        <p className='mt-1 text-sm text-gray-500'>
                                          {product.color?.name}
                                        </p>
                                      </div>
                                      <div className='flex flex-1 items-end justify-between text-sm'>
                                        <p className='text-gray-500'>
                                          {product.size?.name}
                                        </p>

                                        <div className='flex'>
                                          <button
                                            type='button'
                                            className='font-medium text-indigo-600 hover:text-indigo-500'
                                            onClick={() => removeCartProduct(i)}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className='border-t border-gray-200 px-4 py-6 sm:px-6'>
                        <div className='flex justify-between text-base font-medium text-gray-900'>
                          <p>Subtotal</p>
                          <p>${subtotal}</p>
                        </div>
                        <p className='mt-0.5 text-sm text-gray-500'>
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className='mt-6'>
                          <a
                            href='#'
                            className='flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700'
                          >
                            Checkout
                          </a>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <header className='relative bg-white z-20'>
        <p className='flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8'>
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label='Top'
          className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
        >
          <div className='border-b border-gray-200'>
            <div className='flex h-16 items-center'>
              <button
                type='button'
                className='relative rounded-md bg-white p-2 text-gray-400 lg:hidden'
                onClick={() => setOpen(true)}
              >
                <span className='absolute -inset-0.5' />
                <span className='sr-only'>Open menu</span>
                <Bars3Icon className='h-6 w-6' aria-hidden='true' />
              </button>

              {/* Logo */}
              <div className='ml-4 flex lg:ml-0'>
                <Link href='/'>
                  <img className='h-8 w-auto' src='/logo.svg' alt='' />
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className='hidden lg:ml-8 lg:block lg:self-stretch'>
                <div className='flex h-full space-x-8'>
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className='flex'>
                      {({ open }) => (
                        <>
                          <div className='relative flex'>
                            <Popover.Button
                              className={classNames(
                                open
                                  ? 'border-indigo-600 text-indigo-600'
                                  : 'border-transparent text-gray-700 hover:text-gray-800',
                                'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out'
                              )}
                            >
                              {category.name}
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter='transition ease-out duration-200'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='transition ease-in duration-150'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <Popover.Panel className='absolute inset-x-0 top-full text-sm text-gray-500'>
                              {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                              <div
                                className='absolute inset-0 top-1/2 bg-white shadow'
                                aria-hidden='true'
                              />

                              <div className='relative bg-white'>
                                <div className='mx-auto max-w-7xl px-8'>
                                  <div className='grid grid-cols-2 gap-x-8 gap-y-10 py-16'>
                                    <div className='row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm'>
                                      {category.sections.map((section) => (
                                        <div key={section.name}>
                                          <p
                                            id={`${section.name}-heading`}
                                            className='font-medium text-gray-900'
                                          >
                                            {section.name}
                                          </p>
                                          <ul
                                            role='list'
                                            aria-labelledby={`${section.name}-heading`}
                                            className='mt-6 space-y-6 sm:mt-4 sm:space-y-4'
                                          >
                                            {section.items.map((item) => (
                                              <li
                                                key={item.name}
                                                className='flex'
                                              >
                                                <a
                                                  href={item.href}
                                                  className='hover:text-gray-800'
                                                >
                                                  {item.name}
                                                </a>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      className='flex items-center text-sm font-medium text-gray-700 hover:text-gray-800'
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </Popover.Group>

              <div className='ml-auto flex items-center'>
                {/* Search */}
                <div className='flex lg:ml-6'>
                  <a href='#' className='p-2 text-gray-400 hover:text-gray-500'>
                    <span className='sr-only'>Search</span>
                    <MagnifyingGlassIcon
                      className='h-6 w-6'
                      aria-hidden='true'
                    />
                  </a>
                </div>

                {/* Cart */}
                <div className='ml-4 flow-root lg:ml-6'>
                  <button
                    type='button'
                    className='group -m-2 flex items-center p-2'
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingCartIcon
                      className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                      aria-hidden='true'
                    />
                    <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>
                      {cartProducts.length}
                    </span>
                    <span className='sr-only'>items in cart, view bag</span>
                  </button>
                </div>

                <span
                  className='ml-4 h-6 w-px bg-gray-200'
                  aria-hidden='true'
                />

                <Menu as='div' className='relative ml-4 flex-shrink-0'>
                  <div>
                    <Menu.Button className='relative flex rounded-full text-sm ring-2 ring-gray-200'>
                      <span className='absolute -inset-1.5' />
                      <span className='sr-only'>Open user menu</span>
                      {image !== '' && image != undefined ? (
                        <img
                          className='h-8 w-8 rounded-full'
                          src={image}
                          alt=''
                        />
                      ) : (
                        <span className='inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100'>
                          <svg
                            className='h-full w-full text-gray-300'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                          </svg>
                        </span>
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute -right-2 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                      {status === 'authenticated' && (
                        <>
                          <div className='px-4 py-3'>
                            <p className='text-sm'>Signed in as</p>
                            <p className='truncate text-sm font-medium text-gray-900'>
                              {email}
                            </p>
                          </div>
                          <div className='py-1'>
                            <Menu.Item key='Profile'>
                              {({ active }) => (
                                <Link
                                  href='/profile'
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  Profile
                                </Link>
                              )}
                            </Menu.Item>
                            {isAdmin && (
                              <Menu.Item key='Dashboard'>
                                {({ active }) => (
                                  <Link
                                    href='/dashboard'
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    Dashboard
                                  </Link>
                                )}
                              </Menu.Item>
                            )}
                          </div>
                          <div className='py-1'>
                            <Menu.Item key='Log out'>
                              {({ active }) => (
                                <a
                                  href='#'
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                  onClick={() =>
                                    signOut({ callbackUrl: '/login' })
                                  }
                                >
                                  Log out
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </>
                      )}
                      {status === 'unauthenticated' && (
                        <div className='py-1'>
                          <Menu.Item key='Sign in'>
                            {({ active }) => (
                              <Link
                                href='/login'
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Sign in
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item key='Sign up'>
                            {({ active }) => (
                              <Link
                                href='/register'
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Sign up
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
