'use client'
import { useContext, useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { RadioGroup } from '@headlessui/react'
import { classNames } from '@/lib/utils'
import Breadcrumb from '@/components/breadcrumb'
import { useParams, usePathname } from 'next/navigation'
import { CartContext } from '@/components/provider'

const product = {
  name: 'Basic Tee 6-Pack',
  price: '$192',
  rating: 3.9,
  reviewCount: 512,
  colors: [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
  ],
  sizes: [
    { name: 'XXS', inStock: true },
    { name: 'XS', inStock: true },
    { name: 'S', inStock: true },
    { name: 'M', inStock: true },
    { name: 'L', inStock: true },
    { name: 'XL', inStock: true },
  ],
  // highlights: [
  //   'Hand cut and sewn locally',
  //   'Dyed with our proprietary colors',
  //   'Pre-washed & pre-shrunk',
  //   'Ultra-soft 100% cotton',
  // ],
}

export default function Product() {
  const { id } = useParams()
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    fetch(`/api/product?id=${id}`).then((res) => {
      res.json().then((product) => {
        setName(product.name)
        setDescription(product.description)
        setPrice(product.price)
        setImage(product.image)
      })
    })
  }, [])

  const { addToCart } = useContext(CartContext)

  return (
    <>
      <div className='mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-18 lg:px-8'>
        <Breadcrumb
          pages={[
            { name: 'Products', href: '/products' },
            { name, href: usePathname() },
          ]}
        />
      </div>

      <div className='mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8'>
          <div className='lg:col-span-5 lg:col-start-8'>
            <div className='flex justify-between'>
              <h1 className='text-xl font-medium text-gray-900'>{name}</h1>
              <p className='text-xl font-medium text-gray-900'>${price}</p>
            </div>
            {/* Reviews */}
            {/* <div className="mt-4">
              <h2 className="sr-only">Reviews</h2>
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  {product.rating}
                  <span className="sr-only"> out of 5 stars</span>
                </p>
                <div className="ml-1 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div aria-hidden="true" className="ml-4 text-sm text-gray-300">
                  ·
                </div>
                <div className="ml-4 flex">
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    See all {product.reviewCount} reviews
                  </a>
                </div>
              </div>
            </div> */}
          </div>

          {/* Image gallery */}
          <div className='mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0'>
            <h2 className='sr-only'>Image</h2>
            <img
              //key={image.id}
              src={image} //.imageSrc
              //alt={image.imageAlt}
              className='lg:col-span-2 lg:row-span-2 rounded-lg'
            />
          </div>

          <div className='mt-8 lg:col-span-5'>
            <form>
              {/* Color picker */}
              <div>
                <h2 className='text-sm font-medium text-gray-900'>Color</h2>

                <RadioGroup
                  value={selectedColor}
                  onChange={setSelectedColor}
                  className='mt-2'
                >
                  <RadioGroup.Label className='sr-only'>
                    Choose a color
                  </RadioGroup.Label>
                  <div className='flex items-center space-x-3'>
                    {product.colors.map((color) => (
                      <RadioGroup.Option
                        key={color.name}
                        value={color}
                        className={({ active, checked }) =>
                          classNames(
                            color.selectedClass,
                            active && checked ? 'ring ring-offset-1' : '',
                            !active && checked ? 'ring-2' : '',
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                          )
                        }
                      >
                        <RadioGroup.Label as='span' className='sr-only'>
                          {color.name}
                        </RadioGroup.Label>
                        <span
                          aria-hidden='true'
                          className={classNames(
                            color.class,
                            'h-8 w-8 rounded-full border border-black border-opacity-10'
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Size picker */}
              <div className='mt-8'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-sm font-medium text-gray-900'>Size</h2>
                  <a
                    href='#'
                    className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                  >
                    Size guide
                  </a>
                </div>

                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className='mt-2'
                >
                  <RadioGroup.Label className='sr-only'>
                    Choose a size
                  </RadioGroup.Label>
                  <div className='grid grid-cols-3 gap-3 sm:grid-cols-6'>
                    {product.sizes.map((size) => (
                      <RadioGroup.Option
                        key={size.name}
                        value={size}
                        className={({ active, checked }) =>
                          classNames(
                            size.inStock
                              ? 'cursor-pointer focus:outline-none'
                              : 'cursor-not-allowed opacity-25',
                            active
                              ? 'ring-2 ring-indigo-500 ring-offset-2'
                              : '',
                            checked
                              ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
                            'flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1'
                          )
                        }
                        disabled={!size.inStock}
                      >
                        <RadioGroup.Label as='span'>
                          {size.name}
                        </RadioGroup.Label>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <button
                //type="submit"
                type='button'
                className='mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                onClick={() =>
                  addToCart(
                    { name, description, price, image },
                    selectedColor,
                    selectedSize
                  )
                }
              >
                Add to cart
              </button>
            </form>
            <div className='mt-10'>
              <h2 className='text-sm font-medium text-gray-900'>Description</h2>

              <div className='mt-4'>
                <p className='text-base text-gray-500'>{description}</p>
              </div>
            </div>

            {/* <div className='mt-10'>
              <h2 className='text-sm font-medium text-gray-900'>Highlights</h2>

              <div className='mt-4'>
                <ul role='list' className='list-disc space-y-2 pl-4 text-sm'>
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className='text-gray-400'>
                      <span className='text-gray-500'>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}
