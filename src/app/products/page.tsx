'use client'
import Product from '@/components/product'
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  BarsArrowUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { classNames } from '@/lib/utils'
import Breadcrumb from '@/components/breadcrumb'

const sortOptions = [
  { name: 'Newest', value: '-createdAt' },
  { name: 'Oldest', value: 'createdAt' },
  { name: 'Price from high to low', value: '-price' },
  { name: 'Price from low to high', value: 'price' },
]
const categoryOptions = [
  { value: '', label: 'All' },
  { value: 'tees', label: 'Tees' },
  { value: 'hoodies', label: 'Hoodies' },
  { value: 'sweatshirts', label: 'Sweatshirts' },
  {
    value: 'long-sleeve-tees',
    label: 'Long Sleeve Tees',
  },
  { value: 'caps', label: 'Caps' },
  { value: 'mugs', label: 'Mugs' },
  { value: 'bags', label: 'Bags' },
  { value: 'notebooks', label: 'Notebooks' },
]

export default function Products() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const params = new URLSearchParams(searchParams)

  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [pages, setPages] = useState(0)

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts({ category, search, sort, page })
  }, [])

  function fetchProducts({ category, search, sort, page }: any) {
    params.set('category', category)
    params.set('search', search)
    params.set('sort', sort)
    params.set('page', String(page))
    replace(`${pathname}?${params.toString()}`)

    fetch(
      `/api/products?category=${category}&search=${search}&sort=${sort}&page=${page}`
    ).then((res) => {
      res.json().then((products) => {
        setProducts(products.result)
        setPages(products.pages)
      })
    })
  }

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='py-5 sm:items-center'>
          <Breadcrumb pages={[{ name: 'Products', href: '/products' }]} />
        </div>
        <div
          aria-labelledby='filter-heading'
          className='border-t border-gray-200 pt-6'
        >
          <div className='flex items-center justify-between'>
            <div className='flex rounded-md shadow-sm mr-6'>
              <div className='relative flex-grow focus-within:z-10'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlassIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </div>
                <input
                  type='text'
                  name='search-products'
                  id='search-products'
                  className='w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600'
                  placeholder='Search products'
                  onChange={(ev) => {
                    setSearch(ev.target.value)
                    fetchProducts({
                      category,
                      search: ev.target.value,
                      sort,
                      page: 1,
                    })
                  }}
                />
              </div>
              <Menu as='div' className='relative inline-block text-left'>
                <Menu.Button className='relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                  <BarsArrowUpIcon
                    className='-ml-0.5 h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                  Sort
                  <ChevronDownIcon
                    className='-mr-1 h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href='#'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm font-medium text-gray-900'
                              )}
                              onClick={() => {
                                setSort(option.value)
                                fetchProducts({
                                  category,
                                  search,
                                  sort: option.value,
                                  page: 1,
                                })
                              }}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            <div className='flex sm:items-baseline sm:space-x-8'>
              <Menu as='div' className='relative ml-4 flex-shrink-0'>
                <div>
                  <Menu.Button className='group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
                    <span>Category</span>
                    <ChevronDownIcon
                      className='-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                      aria-hidden='true'
                    />
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
                    <div className='py-1'>
                      {categoryOptions.map((option) => (
                        <Menu.Item key={option.label}>
                          {({ active }) => (
                            <a
                              href='#'
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={() => {
                                setCategory(option.value)
                                fetchProducts({
                                  category: option.value,
                                  search,
                                  sort,
                                  page: 1,
                                })
                              }}
                            >
                              {option.label}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8'>
        <div className='mt-6 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 xl:gap-x-8'>
          {products.map((product: any) => (
            <Product key={product._id} product={product} href='products' />
          ))}
        </div>
      </div>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <nav className='flex items-center justify-between border-t border-gray-200 px-4 mt-8 sm:px-0'>
          <div className='-mt-px flex w-0 flex-1'>
            {page > 1 && (
              <a
                href='#'
                className='inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                onClick={() => {
                  setPage(page - 1)
                  fetchProducts({ category, search, sort, page: page - 1 })
                }}
              >
                <ArrowLongLeftIcon
                  className='mr-3 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
                Previous
              </a>
            )}
          </div>
          <p className='pt-4 text-sm font-medium text-gray-500'>
            {page}/{pages}
          </p>
          {/* <div className="hidden md:-mt-px md:flex">
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              1
            </a>
            * Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" *
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
              aria-current="page"
            >
              2
            </a>
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              3
            </a>
            <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
              ...
            </span>
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              8
            </a>
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              9
            </a>
            <a
              href="#"
              className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              10
            </a>
          </div> */}
          <div className='-mt-px flex w-0 flex-1 justify-end'>
            {page < pages && (
              <a
                href='#'
                className='inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                onClick={() => {
                  setPage(page + 1)
                  fetchProducts({ category, search, sort, page: page + 1 })
                }}
              >
                Next
                <ArrowLongRightIcon
                  className='ml-3 h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </a>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
